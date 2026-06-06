import { useState } from 'react';
import { MapPin, CheckCircle2, Clock, User, ExternalLink } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router';

export function EnumeratorsPage() {
  const { user, enumeratorRegistry, staffRegistry } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const [filter, setFilter] = useState('All');

  // Admin sees all, Supervisor sees only theirs
  const baseList = isAdmin
    ? enumeratorRegistry
    : enumeratorRegistry.filter(e => e.supervisorId === user?.id);

  const supervisors = staffRegistry.filter(s => s.role === 'supervisor');
  const getSupervisorName = (id: string) => supervisors.find(s => s.id === id)?.name || id;

  // Filter by supervisor (admin only)
  const filtered = (isAdmin && filter !== 'All')
    ? baseList.filter(e => e.supervisorId === filter)
    : baseList;

  const totalAssigned  = baseList.reduce((a, e) => a + e.assigned,  0);
  const totalCompleted = baseList.reduce((a, e) => a + e.completed, 0);
  const avgPct = baseList.length
    ? Math.round(baseList.reduce((a, e) => a + (e.assigned > 0 ? (e.completed / e.assigned) * 100 : 0), 0) / baseList.length)
    : 0;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="px-6 py-5 border-b border-gray-100 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-gray-800 text-xl font-semibold">
            {isAdmin ? 'All Enumerators' : 'My Enumerators'}
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {isAdmin ? 'All field officers across all zones' : `Field officers in ${user?.area}`}
          </p>
        </div>
        <button
          onClick={() => navigate('/register-staff')}
          className="flex items-center gap-2 px-4 py-2 text-white text-sm rounded-xl hover:opacity-90 transition-all shadow-sm"
          style={{ background: 'linear-gradient(135deg,#FF9933,#e67e00)' }}>
          <User size={15} />
          <span className="hidden sm:inline">Add Enumerator</span>
        </button>
      </div>

      <div className="p-4 md:p-6 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: isAdmin ? 'Total Enumerators' : 'My Enumerators', value: baseList.length,                     color: '#0D1B4B', bg: 'bg-blue-50'   },
            { label: 'Total Assigned',                                  value: totalAssigned.toLocaleString('en-IN'), color: '#FF9933', bg: 'bg-orange-50' },
            { label: 'Total Completed',                                 value: totalCompleted.toLocaleString('en-IN'),color: '#138808', bg: 'bg-green-50'  },
            { label: 'Avg Completion',                                  value: `${avgPct}%`,                          color: '#9C27B0', bg: 'bg-purple-50' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <User size={17} style={{ color }} />
              </div>
              <p className="text-gray-800 text-xl font-bold">{value}</p>
              <p className="text-gray-400 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filter by supervisor (admin only) */}
        {isAdmin && (
          <div className="flex gap-2 flex-wrap">
            {['All', ...supervisors.map(s => s.id)].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm transition-all font-medium ${filter === f ? 'bg-[#0D1B4B] text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                {f === 'All' ? 'All Zones' : `${getSupervisorName(f)} (${f})`}
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User size={28} className="text-[#FF9933]" />
            </div>
            <h3 className="text-gray-700 font-semibold mb-1">No enumerators yet</h3>
            <p className="text-gray-400 text-sm mb-4">Add enumerators to start collecting census data in your zone.</p>
            <button onClick={() => navigate('/register-staff')}
              className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg,#FF9933,#e67e00)' }}>
              Add First Enumerator
            </button>
          </div>
        )}

        {/* Cards grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(e => {
              const pct = e.assigned > 0 ? Math.round((e.completed / e.assigned) * 100) : 0;
              const barColor = pct >= 90 ? '#138808' : pct >= 70 ? '#FF9933' : '#C84B31';
              return (
                <div key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-base font-bold"
                        style={{ background: 'linear-gradient(135deg,#FF9933,#e67e00)' }}>
                        {e.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-gray-800 text-sm font-semibold">{e.name}</p>
                        <code className="text-xs text-gray-400">{e.id}</code>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-orange-50 text-[#FF9933]">Enumerator</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                    <MapPin size={12} className="text-[#FF9933]" />
                    <span>{e.district}, {e.state}</span>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                      <User size={12} className="text-purple-400" />
                      <span>Supervisor: <span className="text-gray-600 font-medium">{getSupervisorName(e.supervisorId)}</span></span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3 my-4">
                    {[
                      { icon: User,         label: 'Assigned',  value: e.assigned,  color: '#0D1B4B' },
                      { icon: CheckCircle2, label: 'Done',      value: e.completed, color: '#138808' },
                      { icon: Clock,        label: 'Pending',   value: e.pending,   color: '#FF9933' },
                    ].map(({ icon: Icon, label, value, color }) => (
                      <div key={label} className="text-center bg-[#F8F9FB] rounded-xl py-2.5">
                        <p className="text-gray-700 text-lg font-bold" style={{ color }}>{value}</p>
                        <p className="text-gray-400 text-[10px]">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-400">Progress</span>
                      <span className="text-xs font-semibold" style={{ color: barColor }}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table */}
        {filtered.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-gray-800 text-sm font-semibold">Detailed View</h3>
              <button onClick={() => navigate('/register-staff')}
                className="flex items-center gap-1.5 text-xs text-[#FF9933] hover:underline font-semibold">
                <ExternalLink size={12} /> Manage in Register page
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8F9FB]">
                    {['Enumerator', 'ID', 'District', isAdmin ? 'Supervisor' : 'Phone', 'Assigned', 'Completed', 'Pending', 'Progress'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(e => {
                    const pct = e.assigned > 0 ? Math.round((e.completed / e.assigned) * 100) : 0;
                    return (
                      <tr key={e.id} className="border-t border-gray-50 hover:bg-[#FAFBFC] transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                              style={{ background: 'linear-gradient(135deg,#FF9933,#e67e00)' }}>
                              {e.name.charAt(0)}
                            </div>
                            <span className="text-sm text-gray-700 font-medium">{e.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5"><code className="text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-lg">{e.id}</code></td>
                        <td className="px-4 py-3.5 text-sm text-gray-500">{e.district}, {e.state}</td>
                        <td className="px-4 py-3.5 text-sm text-gray-500">
                          {isAdmin ? getSupervisorName(e.supervisorId) : e.phone}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-700 font-medium">{e.assigned}</td>
                        <td className="px-4 py-3.5 text-sm font-medium text-[#138808]">{e.completed}</td>
                        <td className="px-4 py-3.5 text-sm font-medium text-[#FF9933]">{e.pending}</td>
                        <td className="px-4 py-3.5 w-36">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 90 ? '#138808' : '#FF9933' }} />
                            </div>
                            <span className="text-xs text-gray-500 w-9 text-right font-semibold">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
