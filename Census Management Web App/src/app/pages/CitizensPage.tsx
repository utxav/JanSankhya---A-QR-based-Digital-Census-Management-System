import { useState, useMemo } from 'react';
import { Search, Filter, Download, Eye, X, QrCode, MapPin, Phone, User, BookOpen, Home } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import type { Citizen } from '../Context/AuthContext';  // ← type from context, not mockData

const ITEMS_PER_PAGE = 15;

// ── QR Viewer Modal ────────────────────────────────────────────────────────
function QRModal({ citizen, onClose }: { citizen: Citizen; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-800 font-bold text-base">{citizen.name}</h3>
            <p className="text-gray-400 text-xs mt-0.5">{citizen.uid}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X size={16} /></button>
        </div>
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex items-center justify-center mb-4">
          <img src={citizen.qrCode} alt="QR Code" className="w-48 h-48" />
        </div>
        <div className="rounded-2xl p-4 text-white text-sm" style={{ background: 'linear-gradient(135deg,#0D1B4B,#1a2d6e)' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-white/50 text-xs mb-1">UNIQUE IDENTIFICATION CARD</p>
              <p className="font-bold text-base">{citizen.name}</p>
              <p className="text-white/60 text-xs mt-1">{citizen.gender} · {citizen.dob}</p>
              <p className="text-white/60 text-xs">{citizen.district}, {citizen.state}</p>
              <p className="text-[#FF9933] font-bold text-lg mt-2 tracking-wider">{citizen.uid}</p>
            </div>
            <img src={citizen.qrCode} alt="QR" className="w-16 h-16 bg-white rounded-xl p-1" />
          </div>
        </div>
        <p className="text-gray-400 text-xs text-center mt-3">Scan QR with the Android app to load citizen data</p>
      </div>
    </div>
  );
}

// ── Citizen Detail Modal ───────────────────────────────────────────────────
function DetailModal({ citizen, onClose, onShowQR }: { citizen: Citizen; onClose: () => void; onShowQR: () => void }) {
  const sections = [
    {
      title: 'Personal', icon: User, color: '#FF9933',
      rows: [['Full Name', citizen.name], ['Gender', citizen.gender], ['Date of Birth', citizen.dob], ['Age', `${citizen.age} years`], ['Religion', citizen.religion], ['Caste', citizen.caste], ['Mother Tongue', citizen.motherTongue], ['Marital Status', citizen.maritalStatus]]
    },
    {
      title: 'Contact', icon: Phone, color: '#138808',
      rows: [['Mobile', citizen.mobile], ['Email', citizen.email], ['Aadhaar', citizen.aadhaar]]
    },
    {
      title: 'Address', icon: MapPin, color: '#0D1B4B',
      rows: [['State', citizen.state], ['District', citizen.district], ['PIN Code', citizen.pincode]]
    },
    {
      title: 'Socioeconomic', icon: BookOpen, color: '#7C3AED',
      rows: [['Education', citizen.education], ['Occupation', citizen.occupation], ['Income Class', citizen.incomeClass], ['Disability', citizen.disability], ['Household Size', `${citizen.householdSize} members`], ['Children', `${citizen.numberOfChildren}`]]
    },
    {
      title: 'Housing', icon: Home, color: '#059669',
      rows: [['House Material', citizen.houseMaterial], ['Ownership', citizen.homeOwnership], ['Drinking Water', citizen.drinkingWater], ['Electricity', citizen.electricitySource], ['Cooking Fuel', citizen.cookingFuel], ['Sanitation', citizen.sanitation]]
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'linear-gradient(135deg,#0D1B4B,#1a2d6e)' }}>
              {citizen.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-gray-800 font-bold">{citizen.name}</h3>
              <code className="text-xs text-[#FF9933]">{citizen.uid}</code>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onShowQR} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D1B4B] text-white text-xs rounded-xl font-semibold hover:bg-[#162254]">
              <QrCode size={12} /> View QR
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X size={16} /></button>
          </div>
        </div>
        <div className="overflow-y-auto p-6 space-y-4">
          {sections.map(({ title, icon: Icon, color, rows }) => (
            <div key={title}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Icon size={13} style={{ color }} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{title}</p>
              </div>
              <div className="bg-[#F8F9FB] rounded-xl overflow-hidden">
                {rows.map(([label, val]) => (
                  <div key={label} className="flex justify-between px-4 py-2 border-b border-gray-100 last:border-0">
                    <span className="text-xs text-gray-400 font-medium">{label}</span>
                    <span className="text-xs text-gray-700 font-semibold text-right max-w-[55%] truncate">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export function CitizensPage() {
  const { user, citizens } = useAuth();  // ← citizens from context now
  const isAdmin = user?.role === 'admin';

  const [search,      setSearch]      = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [page,        setPage]        = useState(1);
  const [selected,    setSelected]    = useState<Citizen | null>(null);
  const [showQR,      setShowQR]      = useState<Citizen | null>(null);

  // Admin sees all, supervisor sees only their zone
  const baseCitizens = useMemo(() =>
    isAdmin ? citizens : citizens.filter(c => c.supervisorId === user?.id),
  [isAdmin, user?.id, citizens]);

  const states = useMemo(() =>
    ['All', ...Array.from(new Set(baseCitizens.map(c => c.state))).sort()],
  [baseCitizens]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return baseCitizens.filter(c => {
      const matchState  = stateFilter === 'All' || c.state === stateFilter;
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.uid.toLowerCase().includes(q) || c.district.toLowerCase().includes(q) || c.mobile.includes(q);
      return matchState && matchSearch;
    });
  }, [baseCitizens, search, stateFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleState  = (v: string) => { setStateFilter(v); setPage(1); };

  const exportCSV = () => {
    const headers = ['UID','Name','Gender','DOB','Age','State','District','Religion','Caste','Education','Occupation','Mobile','Income Class','Household Size'];
    const rows = filtered.map(c => [c.uid,c.name,c.gender,c.dob,c.age,c.state,c.district,c.religion,c.caste,c.education,c.occupation,c.mobile,c.incomeClass,c.householdSize]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `census_citizens_${stateFilter.replace(/ /g,'_')}.csv`;
    a.click();
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {showQR   && <QRModal    citizen={showQR}    onClose={() => setShowQR(null)} />}
      {selected && !showQR && (
        <DetailModal citizen={selected} onClose={() => setSelected(null)} onShowQR={() => { setShowQR(selected); setSelected(null); }} />
      )}

      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-gray-800 text-xl font-semibold">
            {isAdmin ? 'All Citizens' : `Citizens — ${user?.area}`}
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {baseCitizens.length.toLocaleString('en-IN')} citizens · {filtered.length.toLocaleString('en-IN')} shown · {totalPages} pages
          </p>
        </div>
        <button onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-[#138808] text-white text-sm rounded-xl hover:bg-green-700 transition-all shadow-sm">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {/* Supervisor zone banner */}
        {!isAdmin && (
          <div className="bg-purple-50 border border-purple-100 rounded-2xl px-5 py-3 flex items-center gap-3">
            <MapPin size={15} className="text-purple-400 flex-shrink-0" />
            <p className="text-purple-700 text-sm">Showing citizens from <strong>{user?.area}</strong> only. Total: {baseCitizens.length} citizens in your zone.</p>
          </div>
        )}

        {/* Empty state */}
        {citizens.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <p className="text-gray-400 font-medium">No citizens yet.</p>
            <p className="text-gray-300 text-sm mt-1">Go to <strong>Data Generator</strong> → generate citizens → click <strong>"Add to Citizens List"</strong>.</p>
          </div>
        )}

        {citizens.length > 0 && (
          <>
            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => handleSearch(e.target.value)}
                  placeholder="Search by name, UID, district, mobile..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF9933]/50 focus:ring-2 focus:ring-[#FF9933]/10 bg-white" />
              </div>
              <div className="relative">
                <Filter size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <select value={stateFilter} onChange={e => handleState(e.target.value)}
                  className="pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white text-gray-600 min-w-[180px]">
                  {states.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total Citizens', value: baseCitizens.length.toLocaleString('en-IN'), color: '#0D1B4B' },
                { label: 'Filtered',       value: filtered.length.toLocaleString('en-IN'),      color: '#FF9933' },
                { label: 'States Covered', value: new Set(baseCitizens.map(c=>c.state)).size,   color: '#138808' },
                { label: 'Avg Age',        value: baseCitizens.length > 0 ? `${Math.round(baseCitizens.reduce((a,c)=>a+c.age,0)/baseCitizens.length)} yrs` : '—', color: '#7C3AED' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 px-4 py-3.5 shadow-sm">
                  <p className="text-xl font-bold" style={{ color }}>{value}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F8F9FB]">
                      {['Citizen','UID','State / District','Age / Gender','Education','QR','Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map(c => (
                      <tr key={c.uid} className="border-t border-gray-50 hover:bg-[#FAFBFC] transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                              style={{ background: c.gender==='Male' ? 'linear-gradient(135deg,#0D1B4B,#1a2d6e)' : c.gender==='Female' ? 'linear-gradient(135deg,#FF9933,#e67e00)' : 'linear-gradient(135deg,#7C3AED,#5B21B6)' }}>
                              {c.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm text-gray-800 font-semibold">{c.name}</p>
                              <p className="text-xs text-gray-400">{c.religion} · {c.caste}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5"><code className="text-xs bg-[#F0F4FF] text-[#0D1B4B] px-2 py-1 rounded-lg font-bold">{c.uid}</code></td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm text-gray-700 font-medium">{c.state}</p>
                          <p className="text-xs text-gray-400">{c.district}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm text-gray-700">{c.age} yrs</p>
                          <p className="text-xs text-gray-400">{c.gender}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-medium">{c.education}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <button onClick={() => setShowQR(c)} className="p-2 text-gray-300 hover:text-[#0D1B4B] hover:bg-blue-50 rounded-lg transition-all">
                            <QrCode size={16} />
                          </button>
                        </td>
                        <td className="px-4 py-3.5">
                          <button onClick={() => setSelected(c)} className="p-2 text-gray-300 hover:text-[#FF9933] hover:bg-orange-50 rounded-lg transition-all">
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
                <p className="text-xs text-gray-400">Showing {((page-1)*ITEMS_PER_PAGE)+1}–{Math.min(page*ITEMS_PER_PAGE, filtered.length)} of {filtered.length.toLocaleString('en-IN')}</p>
                <div className="flex items-center gap-1">
                  <button onClick={()=>setPage(1)} disabled={page===1} className="px-2.5 py-1.5 rounded-lg text-xs border border-gray-200 disabled:opacity-40 hover:bg-gray-50">«</button>
                  <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-2.5 py-1.5 rounded-lg text-xs border border-gray-200 disabled:opacity-40 hover:bg-gray-50">‹</button>
                  {Array.from({length:Math.min(5,totalPages)},(_,i)=>{
                    const p=Math.max(1,Math.min(totalPages-4,page-2))+i;
                    return <button key={p} onClick={()=>setPage(p)} className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${page===p?'bg-[#0D1B4B] text-white':'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{p}</button>;
                  })}
                  <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-2.5 py-1.5 rounded-lg text-xs border border-gray-200 disabled:opacity-40 hover:bg-gray-50">›</button>
                  <button onClick={()=>setPage(totalPages)} disabled={page===totalPages} className="px-2.5 py-1.5 rounded-lg text-xs border border-gray-200 disabled:opacity-40 hover:bg-gray-50">»</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}