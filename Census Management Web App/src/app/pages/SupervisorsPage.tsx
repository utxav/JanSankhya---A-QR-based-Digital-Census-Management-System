import { useState, useMemo } from 'react';
import { Search, Plus, Trash2, Eye, X, MapPin, Phone, Shield, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import type { StaffUser } from '../Context/AuthContext';

// ── Detail Modal ──────────────────────────────────────────────────
function DetailModal({ sup, enumeratorCount, onClose }: {
  sup: StaffUser;
  enumeratorCount: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'linear-gradient(135deg,#FF9933,#e67e00)' }}>
              {sup.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-gray-800 font-bold">{sup.name}</h3>
              <code className="text-xs text-[#FF9933]">{sup.id}</code>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X size={16}/></button>
        </div>
        <div className="p-6 space-y-3">
          {[
            ['Employee ID',    sup.id],
            ['Role',           'Supervisor'],
            ['Zone / Area',    sup.area   || '—'],
            ['State',          sup.state  || '—'],
            ['Phone',          sup.phone  || '—'],
            ['Joined',         sup.createdAt],
            ['Enumerators',    `${enumeratorCount} assigned`],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-xs text-gray-400 font-medium">{label}</span>
              <span className="text-xs text-gray-700 font-semibold text-right">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Add Supervisor Modal ──────────────────────────────────────────
function AddModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (result: { id: string; password: string; name: string }) => void;
}) {
  const { registerStaff } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', area: '', state: '', password: '' });
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.area.trim() || !form.state.trim() || !form.password.trim()) {
      setError('All fields are required.'); return;
    }
    if (form.phone.length !== 10 || !/^\d+$/.test(form.phone)) {
      setError('Phone must be 10 digits.'); return;
    }
    const result = registerStaff({ name: form.name.trim(), phone: form.phone.trim(), area: form.area.trim(), state: form.state.trim(), password: form.password, role: 'supervisor' });
    onAdd({ ...result, name: form.name.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-gray-800 font-bold">Add Supervisor</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X size={16}/></button>
        </div>
        <div className="p-6 space-y-3">
          {([
            ['name',     'Full Name',     'text',     'e.g. Priya Sharma'],
            ['phone',    'Phone Number',  'tel',      '10-digit mobile'],
            ['area',     'Zone / Area',   'text',     'e.g. Gujarat Zone B'],
            ['state',    'State',         'text',     'e.g. Gujarat'],
            ['password', 'Password',      'password', 'Min 6 characters'],
          ] as [keyof typeof form, string, string, string][]).map(([key, label, type, ph]) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
              <input type={type} value={form[key]} onChange={set(key)} placeholder={ph}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF9933]/50 focus:ring-2 focus:ring-[#FF9933]/10" />
            </div>
          ))}
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button onClick={handleSubmit}
            className="w-full py-2.5 rounded-xl text-white text-sm font-bold mt-2"
            style={{ background: 'linear-gradient(135deg,#FF9933,#e67e00)' }}>
            Create Supervisor
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Success Banner ────────────────────────────────────────────────
function SuccessBanner({ name, id, password, onClose }: { name: string; id: string; password: string; onClose: () => void }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-start gap-3">
      <CheckCircle size={18} className="text-[#138808] flex-shrink-0 mt-0.5"/>
      <div className="flex-1">
        <p className="text-sm text-green-800 font-semibold">Supervisor added successfully!</p>
        <p className="text-xs text-green-700 mt-1">
          <strong>{name}</strong> · ID: <code className="bg-green-100 px-1 rounded">{id}</code> · Password: <code className="bg-green-100 px-1 rounded">{password}</code>
        </p>
        <p className="text-xs text-green-500 mt-1">Share these credentials with the supervisor.</p>
      </div>
      <button onClick={onClose} className="text-green-400 hover:text-green-600"><X size={14}/></button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export function SupervisorsPage() {
  const { staffRegistry, enumeratorRegistry, deleteStaff } = useAuth();

  const supervisors = useMemo(() =>
    staffRegistry.filter(s => s.role === 'supervisor'),
  [staffRegistry]);

  const [search,    setSearch]    = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [selected,  setSelected]  = useState<StaffUser | null>(null);
  const [showAdd,   setShowAdd]   = useState(false);
  const [success,   setSuccess]   = useState<{ name: string; id: string; password: string } | null>(null);

  const states = useMemo(() =>
    ['All', ...Array.from(new Set(supervisors.map(s => s.state || ''))).filter(Boolean).sort()],
  [supervisors]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return supervisors.filter(s => {
      const matchState  = stateFilter === 'All' || s.state === stateFilter;
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || (s.area || '').toLowerCase().includes(q) || (s.phone || '').includes(q);
      return matchState && matchSearch;
    });
  }, [supervisors, search, stateFilter]);

  const getEnumCount = (supId: string) =>
    enumeratorRegistry.filter(e => e.supervisorId === supId).length;

  const handleDelete = (sup: StaffUser) => {
    const enumCount = getEnumCount(sup.id);
    const msg = enumCount > 0
      ? `"${sup.name}" has ${enumCount} enumerator(s) assigned. Delete anyway?`
      : `Delete supervisor "${sup.name}"?`;
    if (confirm(msg)) deleteStaff(sup.id);
  };

  const handleAdd = (result: { id: string; password: string; name: string }) => {
    setShowAdd(false);
    setSuccess(result);
  };

  // Summary stats
  const totalEnums     = supervisors.reduce((a, s) => a + getEnumCount(s.id), 0);
  const statesCovered  = new Set(supervisors.map(s => s.state).filter(Boolean)).size;
  const avgEnums       = supervisors.length > 0 ? Math.round(totalEnums / supervisors.length) : 0;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {selected && (
        <DetailModal
          sup={selected}
          enumeratorCount={getEnumCount(selected.id)}
          onClose={() => setSelected(null)}
        />
      )}
      {showAdd && (
        <AddModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      )}

      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-gray-800 text-xl font-semibold flex items-center gap-2">
            <Shield size={20} className="text-[#FF9933]"/>
            Supervisors
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {supervisors.length} supervisors · {statesCovered} states covered
          </p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 text-white text-sm rounded-xl font-semibold shadow-sm hover:opacity-90 transition-all"
          style={{ background: 'linear-gradient(135deg,#FF9933,#e67e00)' }}>
          <Plus size={14}/> Add Supervisor
        </button>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {/* Success banner */}
        {success && (
          <SuccessBanner
            name={success.name}
            id={success.id}
            password={success.password}
            onClose={() => setSuccess(null)}
          />
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Supervisors', value: supervisors.length,        color: '#0D1B4B' },
            { label: 'States Covered',    value: statesCovered,             color: '#138808' },
            { label: 'Total Enumerators', value: totalEnums,                color: '#FF9933' },
            { label: 'Avg Enumerators',   value: `${avgEnums} / supervisor`, color: '#7C3AED' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 px-4 py-3.5 shadow-sm">
              <p className="text-xl font-bold" style={{ color }}>{value}</p>
              <p className="text-gray-400 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e => { setSearch(e.target.value); }}
              placeholder="Search by name, ID, zone, phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF9933]/50 focus:ring-2 focus:ring-[#FF9933]/10 bg-white"/>
          </div>
          <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white text-gray-600 min-w-[160px]">
            {states.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8F9FB]">
                  {['Supervisor', 'ID', 'Zone / State', 'Phone', 'Enumerators', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                      No supervisors found.
                    </td>
                  </tr>
                ) : filtered.map(sup => {
                  const enumCount = getEnumCount(sup.id);
                  return (
                    <tr key={sup.id} className="border-t border-gray-50 hover:bg-[#FAFBFC] transition-colors">
                      {/* Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg,#FF9933,#e67e00)' }}>
                            {sup.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm text-gray-800 font-semibold">{sup.name}</p>
                            <p className="text-xs text-gray-400">{sup.area || '—'}</p>
                          </div>
                        </div>
                      </td>
                      {/* ID */}
                      <td className="px-4 py-3.5">
                        <code className="text-xs bg-[#FFF4E6] text-[#FF9933] px-2 py-1 rounded-lg font-bold">{sup.id}</code>
                      </td>
                      {/* Zone / State */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-gray-300 flex-shrink-0"/>
                          <div>
                            <p className="text-sm text-gray-700 font-medium">{sup.state || '—'}</p>
                            <p className="text-xs text-gray-400">{sup.area || '—'}</p>
                          </div>
                        </div>
                      </td>
                      {/* Phone */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-gray-300"/>
                          <span className="text-sm text-gray-600">{sup.phone || '—'}</span>
                        </div>
                      </td>
                      {/* Enumerators */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Users size={12} className="text-gray-300"/>
                          <span className={`text-sm font-semibold ${enumCount > 0 ? 'text-[#138808]' : 'text-gray-400'}`}>
                            {enumCount}
                          </span>
                        </div>
                      </td>
                      {/* Joined */}
                      <td className="px-4 py-3.5 text-sm text-gray-500">{sup.createdAt}</td>
                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelected(sup)}
                            className="p-2 text-gray-300 hover:text-[#FF9933] hover:bg-orange-50 rounded-lg transition-all">
                            <Eye size={15}/>
                          </button>
                          <button onClick={() => handleDelete(sup)}
                            className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 size={15}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          <div className="px-5 py-3 border-t border-gray-50">
            <p className="text-xs text-gray-400">{filtered.length} of {supervisors.length} supervisors shown</p>
          </div>
        </div>
      </div>
    </div>
  );
}