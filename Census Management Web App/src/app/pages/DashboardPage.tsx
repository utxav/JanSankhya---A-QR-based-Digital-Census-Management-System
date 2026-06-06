import { useState, useMemo } from 'react';
import { Users, MapPin, IndianRupee, BookOpen, Wifi, Syringe, Building2, Home, Car, ArrowUpRight, ClipboardList, CheckCircle2, Clock, Send, Shield } from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { gujaratEnumerators } from '../data/mockData';
import { useAuth } from '../Context/AuthContext';

const insightCards = [
  { label: 'Literacy Rate',    value: '78.4%', icon: BookOpen,   color: '#138808' },
  { label: 'Internet Access',  value: '63.5%', icon: Wifi,       color: '#0099CC' },
  { label: 'Vaccinated',       value: '71.8%', icon: Syringe,    color: '#9C27B0' },
  { label: 'Has Bank Account', value: '84.9%', icon: Building2,  color: '#FF6B35' },
  { label: 'Own a Home',       value: '55.2%', icon: Home,       color: '#138808' },
  { label: 'Own Vehicle',      value: '48.3%', icon: Car,        color: '#0D1B4B' },
  { label: 'Migrated',         value: '44.5%', icon: MapPin,     color: '#C84B31' },
  { label: 'Health Insurance', value: '52.3%', icon: Users,      color: '#D4AF37' },
];

const supervisorProgress = gujaratEnumerators.map(e => ({
  name: e.name, assigned: e.assigned, completed: e.completed, pending: e.pending
}));

const CHART_COLORS = ['#FF9933', '#138808', '#0D1B4B', '#D4AF37', '#9C27B0', '#C84B31', '#00797B'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-xl px-4 py-2.5 border border-gray-100">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-sm font-semibold" style={{ color: entry.color || '#0D1B4B' }}>
            {entry.value?.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function SupervisorReportForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ houses: '', pending: '', issues: '', notes: '' });

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col items-center gap-2">
        <CheckCircle2 size={32} className="text-green-500" />
        <p className="text-green-700 font-semibold">Report submitted to Admin!</p>
        <p className="text-green-500 text-sm">Your daily report has been recorded.</p>
        <button onClick={() => { setSubmitted(false); setForm({ houses: '', pending: '', issues: '', notes: '' }); }}
          className="mt-2 text-xs text-green-600 underline">Submit another</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList size={18} className="text-[#7C3AED]" />
        <h3 className="text-gray-800 text-sm font-semibold">Submit Daily Report to Admin</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {[
          { label: 'Houses Visited Today', key: 'houses', type: 'number', placeholder: 'e.g. 45' },
          { label: 'Still Pending',        key: 'pending', type: 'number', placeholder: 'e.g. 12' },
          { label: 'Issues Found',         key: 'issues',  type: 'number', placeholder: 'e.g. 3'  },
          { label: 'Area Covered',         key: 'notes',   type: 'text',   placeholder: 'e.g. Block 12 North' },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key}>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1">{label}</label>
            <input type={type} value={(form as any)[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              placeholder={placeholder}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#7C3AED] transition-all" />
          </div>
        ))}
      </div>
      <button onClick={() => { if (form.houses) setSubmitted(true); }}
        className="w-full py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2"
        style={{ background: '#7C3AED' }}>
        <Send size={14} /> Submit Report to Admin
      </button>
    </div>
  );
}

function AdminReportsPanel() {
  const reports = [
    { sup: 'Rajesh Sharma', zone: 'Gujarat Zone A',     houses: 45, pending: 12, issues: 2, time: '6:30 PM', date: 'Today' },
    { sup: 'Priya Singh',   zone: 'Maharashtra Zone B', houses: 38, pending: 21, issues: 0, time: '5:45 PM', date: 'Today' },
    { sup: 'Amit Verma',    zone: 'UP Zone C',          houses: 52, pending:  8, issues: 1, time: '4:20 PM', date: 'Today' },
    { sup: 'Kavitha Nair',  zone: 'Kerala Zone A',      houses: 41, pending: 15, issues: 3, time: '7:00 PM', date: 'Yesterday' },
  ];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h3 className="text-gray-800 text-sm font-semibold">Supervisor Daily Reports</h3>
          <p className="text-gray-400 text-xs mt-0.5">Auto-collected from all zones</p>
        </div>
        <span className="text-xs bg-green-50 text-green-600 px-2.5 py-1 rounded-full font-semibold">● Live</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F8F9FB]">
              {['Supervisor', 'Zone', 'Visited', 'Pending', 'Issues', 'Time'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr key={i} className="border-t border-gray-50 hover:bg-[#FAFBFC] transition-colors">
                <td className="px-5 py-3.5 text-sm text-gray-700 font-medium">{r.sup}</td>
                <td className="px-5 py-3.5 text-xs text-gray-500">{r.zone}</td>
                <td className="px-5 py-3.5 text-sm text-[#138808] font-semibold">{r.houses}</td>
                <td className="px-5 py-3.5 text-sm text-[#FF9933] font-semibold">{r.pending}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r.issues > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                    {r.issues > 0 ? `${r.issues} issues` : 'No issues'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs text-gray-400">{r.date} {r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const [activeGender, setActiveGender] = useState<number | null>(null);
  const { user, citizens, staffRegistry, enumeratorRegistry } = useAuth();
  const isAdmin = user?.role === 'admin';

  // ── Live stats derived from context ──────────────────────────────
  const totalCitizens    = citizens.length;
  const totalSupervisors = staffRegistry.filter(s => s.role === 'supervisor').length;
  const totalEnumerators = enumeratorRegistry.length;
  const statesCovered    = new Set(citizens.map(c => c.state)).size;

  // Charts derived from real citizen data (fallback to zeros if none yet)
  const genderChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    citizens.forEach(c => { counts[c.gender] = (counts[c.gender] || 0) + 1; });
    const colorMap: Record<string, string> = { Male: '#0D1B4B', Female: '#FF9933', Other: '#138808' };
    return Object.entries(counts).map(([name, value]) => ({ name, value, color: colorMap[name] || '#9C27B0' }));
  }, [citizens]);

  const casteChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    citizens.forEach(c => { counts[c.caste] = (counts[c.caste] || 0) + 1; });
    return Object.entries(counts).map(([caste, count]) => ({ caste, count }))
      .sort((a, b) => b.count - a.count).slice(0, 6);
  }, [citizens]);

  const educationChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    citizens.forEach(c => { counts[c.education] = (counts[c.education] || 0) + 1; });
    return Object.entries(counts).map(([level, count]) => ({ level, count }))
      .sort((a, b) => b.count - a.count).slice(0, 6);
  }, [citizens]);

  const stateChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    citizens.forEach(c => { counts[c.state] = (counts[c.state] || 0) + 1; });
    return Object.entries(counts).map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count).slice(0, 10);
  }, [citizens]);

  const employmentChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    citizens.forEach(c => { counts[c.occupation] = (counts[c.occupation] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value).slice(0, 5);
  }, [citizens]);

  // Recent registrations — last 8 added
  const recentCitizens = useMemo(() => [...citizens].reverse().slice(0, 8), [citizens]);

  const getHour = new Date().getHours();
  const greeting = getHour < 12 ? 'Good morning' : getHour < 17 ? 'Good afternoon' : 'Good evening';

  // ── Dynamic KPI cards ─────────────────────────────────────────────
  const adminKpiCards = [
    { label: 'Total Citizens',    value: totalCitizens.toLocaleString('en-IN'),    sub: 'In system',           icon: Users,        color: '#FF9933', bg: 'bg-orange-50' },
    { label: 'States Covered',    value: statesCovered.toString(),                  sub: 'Pan India coverage',  icon: MapPin,       color: '#138808', bg: 'bg-green-50'  },
    { label: 'Supervisors',       value: totalSupervisors.toString(),               sub: 'Active zone heads',   icon: Shield,       color: '#D4AF37', bg: 'bg-yellow-50' },
    { label: 'Enumerators',       value: totalEnumerators.toString(),               sub: 'Field staff',         icon: CheckCircle2, color: '#9C27B0', bg: 'bg-purple-50' },
  ];

  const myEnumerators = enumeratorRegistry.filter(e => e.supervisorId === user?.id);
  const supervisorKpiCards = [
    { label: 'My Zone Citizens',  value: citizens.filter(c => c.supervisorId === user?.id).length.toLocaleString('en-IN'), sub: user?.area || 'Your zone', icon: Users,        color: '#FF9933', bg: 'bg-orange-50' },
    { label: 'My Enumerators',    value: myEnumerators.length.toString(),            sub: 'Active field staff',  icon: MapPin,       color: '#7C3AED', bg: 'bg-purple-50' },
    { label: 'Total Citizens',    value: totalCitizens.toLocaleString('en-IN'),      sub: 'System-wide',        icon: CheckCircle2, color: '#138808', bg: 'bg-green-50'  },
    { label: 'Enumerators Total', value: totalEnumerators.toString(),                sub: 'Across all zones',   icon: Clock,        color: '#C84B31', bg: 'bg-red-50'    },
  ];

  const kpiCards = isAdmin ? adminKpiCards : supervisorKpiCards;

  // Empty state for charts
  const hasData = citizens.length > 0;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-gray-800 text-xl font-semibold">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">Overview &amp; key metrics</p>
        </div>
        <p className="text-gray-400 text-sm hidden sm:block">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-[#0D1B4B] p-6 md:p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-[#FF9933]/5 -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-[#FF9933] text-sm mb-1">{greeting},</p>
              <h2 className="text-white text-2xl md:text-3xl font-bold">{user?.name} 👋</h2>
              <p className="text-white/50 text-sm mt-1">
                {isAdmin
                  ? `Census operations · ${statesCovered} state${statesCovered !== 1 ? 's' : ''} covered`
                  : `Managing ${user?.area}`}
              </p>
            </div>
            <div className="flex gap-6 md:gap-10">
              {[
                { v: totalCitizens.toLocaleString('en-IN'), l: 'Citizens' },
                { v: totalSupervisors.toString(),            l: 'Supervisors' },
                { v: totalEnumerators.toString(),            l: 'Enumerators', h: true },
              ].map(({ v, l, h }) => (
                <div key={l} className="text-center">
                  <p className={`text-2xl md:text-3xl font-bold ${h ? 'text-[#FF9933]' : 'text-white'}`}>{v}</p>
                  <p className="text-white/40 text-xs mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {kpiCards.map(({ label, value, sub, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">{label}</p>
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={18} style={{ color }} />
                </div>
              </div>
              <p className="text-gray-800 text-2xl font-bold">{value}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <ArrowUpRight size={13} className="text-[#138808]" />
                <p className="text-gray-400 text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Supervisor: Daily Report + Progress */}
        {!isAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SupervisorReportForm />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-gray-800 text-sm font-semibold mb-4">My Enumerators Progress</h3>
              <div className="space-y-3">
                {supervisorProgress.map(e => {
                  const pct = Math.round((e.completed / e.assigned) * 100);
                  return (
                    <div key={e.name}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-700 font-medium">{e.name}</p>
                        <span className="text-xs font-semibold" style={{ color: pct >= 90 ? '#138808' : pct >= 60 ? '#FF9933' : '#C84B31' }}>
                          {e.completed}/{e.assigned} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: pct >= 90 ? '#138808' : pct >= 60 ? '#FF9933' : '#C84B31' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Admin: Reports Panel */}
        {isAdmin && <AdminReportsPanel />}

        {/* Insight Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
          {insightCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                <Icon size={15} style={{ color }} />
              </div>
              <div className="min-w-0">
                <p className="text-gray-800 text-sm font-bold">{value}</p>
                <p className="text-gray-400 text-xs truncate">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* No data banner */}
        {!hasData && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 text-center">
            <p className="text-orange-700 font-semibold text-sm">No citizen data yet</p>
            <p className="text-orange-500 text-xs mt-1">
              Go to <strong>Data Generator</strong> → generate citizens → click <strong>Add to Citizens List</strong> to populate charts
            </p>
          </div>
        )}

        {/* Charts Row 1 */}
        {hasData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-gray-700 text-sm font-semibold mb-4">Gender Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={genderChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value"
                    onMouseEnter={(_, idx) => setActiveGender(idx)} onMouseLeave={() => setActiveGender(null)}>
                    {genderChartData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} opacity={activeGender === null || activeGender === idx ? 1 : 0.5} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2 flex-wrap">
                {genderChartData.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    <span className="text-xs text-gray-500">{name} ({totalCitizens > 0 ? ((value / totalCitizens) * 100).toFixed(0) : 0}%)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-gray-700 text-sm font-semibold mb-4">Employment / Occupation</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={employmentChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value">
                    {employmentChartData.map((_, idx) => (
                      <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
                {employmentChartData.map(({ name }, idx) => (
                  <div key={name} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS[idx % CHART_COLORS.length] }} />
                    <span className="text-xs text-gray-400">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-gray-700 text-sm font-semibold mb-4">Caste Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={casteChartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <YAxis dataKey="caste" type="category" tick={{ fontSize: 11, fill: '#6B7280' }} width={75} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#FF9933" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Charts Row 2 */}
        {hasData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-gray-700 text-sm font-semibold mb-4">Education Level Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={educationChartData} margin={{ left: 0, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                  <XAxis dataKey="level" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#0D1B4B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-gray-700 text-sm font-semibold mb-4">Top States by Citizens</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stateChartData} layout="vertical" margin={{ left: 20, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <YAxis dataKey="state" type="category" tick={{ fontSize: 10, fill: '#6B7280' }} width={110} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#138808" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Registrations */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="text-gray-800 text-sm font-semibold">Recent Registrations</h3>
            <p className="text-gray-400 text-xs mt-0.5">
              {recentCitizens.length > 0 ? `Showing last ${recentCitizens.length} entries` : 'No citizens added yet'}
            </p>
          </div>
          {recentCitizens.length === 0 ? (
            <div className="px-5 py-10 text-center text-gray-400 text-sm">
              No registrations yet — generate citizens in Data Generator to see them here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8F9FB]">
                    {['UID', 'Name', 'State', 'Gender', 'Age', 'Caste'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentCitizens.map((c, i) => (
                    <tr key={c.uid} className={`border-t border-gray-50 hover:bg-[#FAFBFC] transition-colors ${i % 2 !== 0 ? 'bg-gray-50/30' : ''}`}>
                      <td className="px-5 py-3.5">
                        <code className="text-xs text-[#0D1B4B] bg-[#F4F6FA] px-2 py-1 rounded-lg font-semibold">{c.uid}</code>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700 font-medium">{c.name}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{c.state}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{c.gender}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{c.age}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{c.caste}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}