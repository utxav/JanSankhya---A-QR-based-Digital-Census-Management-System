import { useState } from 'react';
import { Download, Home, Heart, ArrowUpDown, Briefcase, Users, BookOpen, ShieldCheck, BarChart3, CheckCircle2 } from 'lucide-react';
import { mockCitizens } from '../data/mockData';

const exportCards = [
  {
    id: 'housing', title: 'Housing & Infrastructure', icon: Home, color: '#FF9933',
    desc: 'House type, wall material, toilet, water source, electricity, cooking fuel',
    records: 5000, fields: 18, bg: 'from-orange-50 to-orange-50/30',
  },
  {
    id: 'health', title: 'Health & Wellbeing', icon: Heart, color: '#C84B31',
    desc: 'Insurance, chronic diseases, vaccination status, healthcare access',
    records: 5000, fields: 12, bg: 'from-red-50 to-red-50/30',
  },
  {
    id: 'migration', title: 'Migration Details', icon: ArrowUpDown, color: '#9C27B0',
    desc: 'Migration status, origin state, reason, year of migration',
    records: 2225, fields: 8, bg: 'from-purple-50 to-purple-50/30',
  },
  {
    id: 'employment', title: 'Employment & Income', icon: Briefcase, color: '#138808',
    desc: 'Employment status, occupation, income level, documents owned',
    records: 5000, fields: 15, bg: 'from-green-50 to-green-50/30',
  },
  {
    id: 'family', title: 'Family Composition', icon: Users, color: '#0D1B4B',
    desc: 'Family size, type, earning members, age distribution',
    records: 5000, fields: 10, bg: 'from-blue-50 to-blue-50/30',
  },
  {
    id: 'schemes', title: 'Govt Schemes & Benefits', icon: ShieldCheck, color: '#00797B',
    desc: 'Scheme enrollment, ration card, bank account, scholarships',
    records: 5000, fields: 14, bg: 'from-teal-50 to-teal-50/30',
  },
  {
    id: 'education', title: 'Education Details', icon: BookOpen, color: '#D4AF37',
    desc: 'Education level, field of study, institution details',
    records: 5000, fields: 9, bg: 'from-yellow-50 to-yellow-50/30',
  },
  {
    id: 'combined', title: 'Complete Dataset (Power BI)', icon: BarChart3, color: '#FF9933',
    desc: 'All 100+ fields across all 10 tables — full dataset for analytics',
    records: 5000, fields: 112, bg: 'from-orange-100 to-orange-50/30', featured: true,
  },
];

export function ReportsPage() {
  const [downloaded, setDownloaded] = useState<string[]>([]);

  const handleDownload = (id: string, title: string, records: number) => {
    const headers = 'UID,Name,Age,Gender,State,District,Caste,Religion,Status\n';
    const rows = mockCitizens.slice(0, Math.min(records, mockCitizens.length)).map(c =>
      `${c.uid},${c.name},${c.age},${c.gender},${c.state},${c.district},${c.caste},${c.religion},${c.censusStatus}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `census_${id}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setDownloaded(d => [...d, id]);
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="px-6 py-5 border-b border-gray-100 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-gray-800 text-xl" style={{ fontWeight: 600 }}>Reports &amp; Export</h1>
          <p className="text-gray-400 text-sm mt-0.5">Download census data in CSV format</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#F4F6FA] rounded-xl">
          <BarChart3 size={15} className="text-[#0D1B4B]" />
          <span className="text-sm text-gray-600" style={{ fontWeight: 500 }}>5,000 records available</span>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Summary banner */}
        <div className="bg-gradient-to-r from-[#0D1B4B] to-[#162254] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-white text-lg mb-1" style={{ fontWeight: 700 }}>Export Census Data</h2>
              <p className="text-white/50 text-sm">Download topic-wise datasets for analysis and reporting</p>
            </div>
            <div className="flex gap-4">
              {[
                { v: '8', l: 'Export Types' },
                { v: '112', l: 'Total Fields' },
                { v: '5K', l: 'Records' },
              ].map(({ v, l }) => (
                <div key={l} className="text-center">
                  <p className="text-[#FF9933] text-xl" style={{ fontWeight: 700 }}>{v}</p>
                  <p className="text-white/40 text-xs">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {exportCards.map(card => {
            const Icon = card.icon;
            const isDone = downloaded.includes(card.id);
            return (
              <div key={card.id} className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all flex flex-col ${card.featured ? 'border-[#FF9933]/30 ring-1 ring-[#FF9933]/20' : 'border-gray-100'}`}>
                {card.featured && (
                  <div className="flex h-1 rounded-t-2xl overflow-hidden">
                    <div className="flex-1 bg-[#FF9933]" />
                    <div className="flex-1 bg-white border-y border-gray-100" />
                    <div className="flex-1 bg-[#138808]" />
                  </div>
                )}
                <div className={`p-5 flex-1 bg-gradient-to-br ${card.bg}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${card.color}18` }}>
                      <Icon size={20} style={{ color: card.color }} />
                    </div>
                    {card.featured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF9933]/15 text-[#FF9933]" style={{ fontWeight: 600 }}>Recommended</span>
                    )}
                  </div>
                  <h3 className="text-gray-800 text-sm mb-1.5" style={{ fontWeight: 600 }}>{card.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4">{card.desc}</p>
                  <div className="flex gap-3 text-xs">
                    <div className="bg-white/70 rounded-lg px-2 py-1">
                      <span className="text-gray-400">Records: </span>
                      <span className="text-gray-700" style={{ fontWeight: 600 }}>{card.records.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="bg-white/70 rounded-lg px-2 py-1">
                      <span className="text-gray-400">Fields: </span>
                      <span className="text-gray-700" style={{ fontWeight: 600 }}>{card.fields}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-50">
                  <button
                    onClick={() => handleDownload(card.id, card.title, card.records)}
                    className={`w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${
                      isDone
                        ? 'bg-green-50 text-green-600 border border-green-100'
                        : 'bg-[#0D1B4B] text-white hover:bg-[#162254] shadow-sm'
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {isDone ? <><CheckCircle2 size={15} /> Downloaded</> : <><Download size={15} /> Export CSV</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Power BI Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F4F6FA] flex items-center justify-center flex-shrink-0">
              <BarChart3 size={22} className="text-[#0D1B4B]" />
            </div>
            <div>
              <h3 className="text-gray-800 text-sm mb-1" style={{ fontWeight: 600 }}>Power BI Analytics Dashboard</h3>
              <p className="text-gray-400 text-sm mb-3">The complete dataset is optimised for Microsoft Power BI with 8 analysis pages:</p>
              <div className="flex flex-wrap gap-2">
                {['Executive Overview', 'Housing', 'Education & Employment', 'Health', 'Migration', 'Family', 'Govt Schemes', 'Revenue Dashboard'].map(p => (
                  <span key={p} className="text-xs px-3 py-1 bg-[#F4F6FA] text-gray-600 rounded-full" style={{ fontWeight: 500 }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
