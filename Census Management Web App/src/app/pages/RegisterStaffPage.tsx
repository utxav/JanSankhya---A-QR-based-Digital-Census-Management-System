import { useState } from 'react';
import { UserPlus, Trash2, Eye, EyeOff, Check, Copy, Shield, Users, MapPin, Phone, Search, Smartphone } from 'lucide-react';
import { useAuth, StaffUser, Enumerator } from '../context/AuthContext';

const indianStates = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi',
];

const iCls = 'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 bg-white transition-all placeholder-gray-300';
const supInput = iCls + ' focus:border-[#7C3AED]/60 focus:ring-[#7C3AED]/10';
const enmInput = iCls + ' focus:border-[#FF9933]/60 focus:ring-[#FF9933]/10';
const supSel   = 'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#7C3AED]/60 bg-white text-gray-600';
const enmSel   = 'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF9933]/60 bg-white text-gray-600';

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
      {text} {required && <span className="text-[#FF9933]">*</span>}
    </label>
  );
}

// ── Credential success modal ───────────────────────────────────────────────
function SuccessModal({ result, onDone }: {
  result: { id: string; name: string; type: string; area: string; password: string };
  onDone: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const color = result.type === 'Supervisor' ? '#7C3AED' : '#FF9933';

  const copy = () => {
    navigator.clipboard.writeText(`ID: ${result.id}\nPassword: ${result.password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${color}15` }}>
          <Check size={36} style={{ color }} />
        </div>
        <h2 className="text-gray-800 text-2xl font-bold mb-1">{result.type} Created!</h2>
        <p className="text-gray-400 text-sm mb-6">{result.name} · {result.area}</p>

        <div className="rounded-2xl p-6 mb-4 text-left text-white" style={{ background: `linear-gradient(135deg, #0D1B4B, #1a2d6e)` }}>
          <p className="text-white/50 text-xs font-semibold uppercase tracking-wide mb-4">Login Credentials</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-2.5">
              <div>
                <p className="text-white/50 text-xs">Employee ID</p>
                <p className="text-white text-lg font-bold tracking-wider">{result.id}</p>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}30` }}>
                <Shield size={14} style={{ color }} />
              </div>
            </div>
            <div className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-2.5">
              <div>
                <p className="text-white/50 text-xs">Password</p>
                <p className="text-white text-lg font-bold tracking-wider">{result.password}</p>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-500/20">
                <Check size={14} className="text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {result.type === 'Enumerator' && (
          <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
            <Smartphone size={14} className="text-[#FF9933] mt-0.5 flex-shrink-0" />
            <p className="text-orange-700 text-xs text-left">Share these credentials with {result.name}. They will use the <strong>Android app</strong> to log in and collect census data.</p>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={copy}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all">
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Credentials'}
          </button>
          <button onClick={onDone}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold transition-all"
            style={{ background: color }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirm ─────────────────────────────────────────────────────────
function DeleteConfirm({ name, id, onConfirm, onCancel }: { name: string; id: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-400" />
        </div>
        <h3 className="text-gray-800 font-bold text-lg mb-1">Remove Access?</h3>
        <p className="text-gray-500 text-sm">{name}</p>
        <p className="text-gray-400 text-xs mb-2">{id}</p>
        <p className="text-red-400 text-xs bg-red-50 rounded-xl px-4 py-2 mb-5">Their login will be revoked immediately.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold">Remove</button>
        </div>
      </div>
    </div>
  );
}

// ── Supervisor registration form ───────────────────────────────────────────
function SupervisorTab() {
  const { staffRegistry, registerStaff, deleteStaff } = useAuth();
  const [form, setForm]     = useState({ name: '', phone: '', state: '', zone: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess]   = useState<any>(null);
  const [toDelete, setToDelete] = useState<StaffUser | null>(null);
  const [search,   setSearch]   = useState('');
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())                              e.name     = 'Required';
    if (!form.phone.trim() || form.phone.length !== 10) e.phone    = 'Valid 10-digit number required';
    if (!form.state)                                    e.state    = 'Select a state';
    if (!form.zone.trim())                              e.zone     = 'Required';
    if (!form.password || form.password.length < 6)    e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;
    const result = registerStaff({ name: form.name.trim(), role: 'supervisor', area: form.zone.trim(), state: form.state, phone: form.phone.trim(), password: form.password.trim() });
    setSuccess({ id: result.id, name: form.name, type: 'Supervisor', area: form.zone, password: result.password });
    setForm({ name: '', phone: '', state: '', zone: '', password: '' });
  };

  const supervisors = staffRegistry.filter(s => s.role === 'supervisor');
  const filtered = supervisors.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.state?.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {success  && <SuccessModal result={success} onDone={() => setSuccess(null)} />}
      {toDelete && <DeleteConfirm name={toDelete.name} id={toDelete.id} onConfirm={() => { deleteStaff(toDelete.id); setToDelete(null); }} onCancel={() => setToDelete(null)} />}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Form */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50" style={{ background: 'linear-gradient(135deg,#F5F3FF,#fff)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Shield size={18} className="text-[#7C3AED]" />
                </div>
                <div>
                  <h3 className="text-gray-800 text-sm font-semibold">New Supervisor</h3>
                  <p className="text-gray-400 text-xs">Creates web dashboard login</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label text="Full Name" required />
                <input className={supInput} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Kavitha Nair" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label text="Phone" required />
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className={supInput + ' pl-9'} value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g,''))} placeholder="10-digit mobile" maxLength={10} />
                </div>
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Label text="Assigned State" required />
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select className={supSel + ' pl-9'} value={form.state} onChange={e => { set('state', e.target.value); set('zone', e.target.value ? `${e.target.value} Zone A` : ''); }}>
                    <option value="">Select state</option>
                    {indianStates.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
              </div>
              <div>
                <Label text="Zone Name" required />
                <input className={supInput} value={form.zone} onChange={e => set('zone', e.target.value)} placeholder="e.g. Kerala Zone A" />
                <p className="text-gray-400 text-xs mt-1">Auto-filled — edit if needed</p>
                {errors.zone && <p className="text-red-400 text-xs mt-1">{errors.zone}</p>}
              </div>
              <div>
                <Label text="Password" required />
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} className={supInput + ' pr-10'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 characters" />
                  <button onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>
              <button onClick={handleRegister}
                className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#5B21B6)' }}>
                <UserPlus size={15} /> Create Supervisor
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-gray-800 text-sm font-semibold">All Supervisors</h3>
                <p className="text-gray-400 text-xs">{supervisors.length} supervisors registered</p>
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                  className="pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none w-40" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8F9FB]">
                    {['Supervisor', 'ID', 'State / Zone', 'Created', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0
                    ? <tr><td colSpan={5} className="text-center py-10 text-gray-400 text-sm">No supervisors found</td></tr>
                    : filtered.map(s => (
                      <tr key={s.id} className="border-t border-gray-50 hover:bg-[#FAFBFC] transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                              style={{ background: 'linear-gradient(135deg,#7C3AED,#5B21B6)' }}>
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm text-gray-700 font-semibold">{s.name}</p>
                              <p className="text-xs text-gray-400">{s.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5"><code className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-lg font-semibold">{s.id}</code></td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm text-gray-600 font-medium">{s.state}</p>
                          <p className="text-xs text-gray-400">{s.area}</p>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-400">{s.createdAt}</td>
                        <td className="px-4 py-3.5">
                          <button onClick={() => setToDelete(s)} className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Enumerator registration form ───────────────────────────────────────────
function EnumeratorTab({ defaultSupervisorId }: { defaultSupervisorId?: string }) {
  const { user, staffRegistry, enumeratorRegistry, registerEnumerator, deleteEnumerator } = useAuth();
  const isAdmin = user?.role === 'admin';

  const supervisors = staffRegistry.filter(s => s.role === 'supervisor');

  // If supervisor is logged in, lock supervisorId to themselves
  const [form, setForm] = useState({
    name:         '',
    phone:        '',
    state:        isAdmin ? '' : (user?.state || ''),
    district:     '',
    supervisorId: isAdmin ? (defaultSupervisorId || '') : (user?.id || ''),
    password:     '',
  });
  const [showPass, setShowPass] = useState(false);
  const [success,  setSuccess]  = useState<any>(null);
  const [toDelete, setToDelete] = useState<Enumerator | null>(null);
  const [search,   setSearch]   = useState('');
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  // When supervisor is selected (admin view), auto-fill state
  const handleSupChange = (supId: string) => {
    set('supervisorId', supId);
    const sup = supervisors.find(s => s.id === supId);
    if (sup?.state) set('state', sup.state);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())                              e.name         = 'Required';
    if (!form.phone.trim() || form.phone.length !== 10) e.phone        = 'Valid 10-digit number required';
    if (!form.state)                                    e.state        = 'Required';
    if (!form.district.trim())                          e.district     = 'Required';
    if (!form.supervisorId)                             e.supervisorId = 'Select a supervisor';
    if (!form.password || form.password.length < 6)    e.password     = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;
    const sup = supervisors.find(s => s.id === form.supervisorId);
    const result = registerEnumerator({
      name:         form.name.trim(),
      phone:        form.phone.trim(),
      state:        form.state,
      district:     form.district.trim(),
      supervisorId: form.supervisorId,
      password:     form.password.trim(),
    });
    setSuccess({ id: result.id, name: form.name, type: 'Enumerator', area: `${form.district}, ${form.state} (${sup?.name})`, password: result.password });
    setForm(f => ({ ...f, name: '', phone: '', district: '', password: '' }));
  };

  // Show only enumerators relevant to current user
  const visibleEnumerators = isAdmin
    ? enumeratorRegistry
    : enumeratorRegistry.filter(e => e.supervisorId === user?.id);

  const filtered = visibleEnumerators.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.district.toLowerCase().includes(search.toLowerCase()) ||
    e.id.toLowerCase().includes(search.toLowerCase())
  );

  const getSupervisorName = (id: string) => supervisors.find(s => s.id === id)?.name || id;

  return (
    <>
      {success  && <SuccessModal result={success} onDone={() => setSuccess(null)} />}
      {toDelete && <DeleteConfirm name={toDelete.name} id={toDelete.id} onConfirm={() => { deleteEnumerator(toDelete.id); setToDelete(null); }} onCancel={() => setToDelete(null)} />}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Form */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50" style={{ background: 'linear-gradient(135deg,#FFF8F0,#fff)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Smartphone size={18} className="text-[#FF9933]" />
                </div>
                <div>
                  <h3 className="text-gray-800 text-sm font-semibold">New Enumerator</h3>
                  <p className="text-gray-400 text-xs">Creates Android app login</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label text="Full Name" required />
                <input className={enmInput} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Anil Kumar" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label text="Phone" required />
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className={enmInput + ' pl-9'} value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g,''))} placeholder="10-digit mobile" maxLength={10} />
                </div>
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Supervisor selector — Admin picks, Supervisor sees their own name */}
              <div>
                <Label text="Assign to Supervisor" required />
                {isAdmin ? (
                  <select className={enmSel} value={form.supervisorId} onChange={e => handleSupChange(e.target.value)}>
                    <option value="">Select supervisor</option>
                    {supervisors.map(s => (
                      <option key={s.id} value={s.id}>{s.id} — {s.name} ({s.area})</option>
                    ))}
                  </select>
                ) : (
                  <div className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-600 flex items-center gap-2">
                    <Shield size={14} className="text-[#7C3AED]" />
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-gray-400">· {user?.area}</span>
                  </div>
                )}
                {errors.supervisorId && <p className="text-red-400 text-xs mt-1">{errors.supervisorId}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label text="State" required />
                  <select className={enmSel} value={form.state} onChange={e => set('state', e.target.value)} disabled={!isAdmin}>
                    <option value="">Select</option>
                    {indianStates.map(s => <option key={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
                </div>
                <div>
                  <Label text="District" required />
                  <input className={enmInput} value={form.district} onChange={e => set('district', e.target.value)} placeholder="e.g. Ahmedabad" />
                  {errors.district && <p className="text-red-400 text-xs mt-1">{errors.district}</p>}
                </div>
              </div>

              <div>
                <Label text="Password" required />
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} className={enmInput + ' pr-10'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 characters" />
                  <button onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                <p className="text-orange-700 text-xs font-semibold mb-1 flex items-center gap-1.5"><Smartphone size={12} /> Android App Only</p>
                <p className="text-orange-600 text-xs">Enumerators use the Android app to collect census data. They do not have web dashboard access.</p>
              </div>

              <button onClick={handleRegister}
                className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#FF9933,#e67e00)' }}>
                <UserPlus size={15} /> Create Enumerator
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-gray-800 text-sm font-semibold">
                  {isAdmin ? 'All Enumerators' : 'My Enumerators'}
                </h3>
                <p className="text-gray-400 text-xs">{visibleEnumerators.length} enumerators registered</p>
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                  className="pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none w-40" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8F9FB]">
                    {['Enumerator', 'ID', 'District', isAdmin ? 'Supervisor' : 'Progress', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0
                    ? <tr><td colSpan={5} className="text-center py-10 text-gray-400 text-sm">No enumerators found</td></tr>
                    : filtered.map(e => {
                      const pct = e.assigned > 0 ? Math.round((e.completed / e.assigned) * 100) : 0;
                      return (
                        <tr key={e.id} className="border-t border-gray-50 hover:bg-[#FAFBFC] transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                                style={{ background: 'linear-gradient(135deg,#FF9933,#e67e00)' }}>
                                {e.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm text-gray-700 font-semibold">{e.name}</p>
                                <p className="text-xs text-gray-400">{e.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5"><code className="text-xs bg-orange-50 text-orange-500 px-2 py-1 rounded-lg font-semibold">{e.id}</code></td>
                          <td className="px-4 py-3.5">
                            <p className="text-sm text-gray-600 font-medium">{e.district}</p>
                            <p className="text-xs text-gray-400">{e.state}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            {isAdmin ? (
                              <div>
                                <p className="text-xs text-gray-700 font-medium">{getSupervisorName(e.supervisorId)}</p>
                                <p className="text-xs text-gray-400">{e.supervisorId}</p>
                              </div>
                            ) : (
                              <div className="w-24">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-400">{e.completed}/{e.assigned}</span>
                                  <span className="font-semibold" style={{ color: pct >= 80 ? '#138808' : '#FF9933' }}>{pct}%</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full">
                                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 80 ? '#138808' : '#FF9933' }} />
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <button onClick={() => setToDelete(e)} className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export function RegisterStaffPage() {
  const { user, enumeratorRegistry, staffRegistry } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Supervisor goes straight to enumerator tab
  const [tab, setTab] = useState<'supervisor' | 'enumerator'>(isAdmin ? 'supervisor' : 'enumerator');

  const supervisors  = staffRegistry.filter(s => s.role === 'supervisor');
  const myEnumerators = isAdmin
    ? enumeratorRegistry.length
    : enumeratorRegistry.filter(e => e.supervisorId === user?.id).length;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-gray-800 text-xl font-semibold">
            {isAdmin ? 'Register Staff' : 'Register Enumerator'}
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {isAdmin ? 'Create login credentials for supervisors and enumerators' : `Add enumerators to your zone · ${user?.area}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-xl">
              <Shield size={13} className="text-purple-500" />
              <span className="text-purple-600 text-xs font-semibold">{supervisors.length} Supervisors</span>
            </div>
          )}
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl">
            <Smartphone size={13} className="text-[#FF9933]" />
            <span className="text-orange-600 text-xs font-semibold">{myEnumerators} Enumerators</span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-5">
        {/* Tabs — only Admin sees both; Supervisor sees only Enumerator */}
        {isAdmin && (
          <div className="flex gap-2">
            {([['supervisor', Shield, 'Register Supervisor', '#7C3AED'], ['enumerator', Smartphone, 'Register Enumerator', '#FF9933']] as const).map(([key, Icon, label, color]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === key ? 'text-white shadow-md' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'}`}
                style={tab === key ? { background: color } : {}}>
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Tab content */}
        {tab === 'supervisor' && isAdmin && <SupervisorTab />}
        {tab === 'enumerator' && <EnumeratorTab defaultSupervisorId={!isAdmin ? user?.id : ''} />}
      </div>
    </div>
  );
}
