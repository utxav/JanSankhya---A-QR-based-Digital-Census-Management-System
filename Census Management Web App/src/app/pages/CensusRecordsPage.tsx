import { useState, useEffect } from 'react';
import { Search, Eye, X, Users, FileText, Calendar } from 'lucide-react';

const API_URL = 'http://localhost/jansankhya-api/census/list.php';

export function CensusRecordsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setRecords(data.records);
          setFiltered(data.records);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(records.filter(r =>
      r.uid?.toLowerCase().includes(q) ||
      r.occupation?.toLowerCase().includes(q) ||
      r.migration_status?.toLowerCase().includes(q) ||
      r.family_type?.toLowerCase().includes(q)
    ));
  }, [search, records]);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-3 pb-2 border-b border-gray-100" style={{ fontWeight: 600 }}>{title}</h4>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );

  const Field = ({ label, value }: { label: string; value: string }) => (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm text-gray-700 mt-0.5" style={{ fontWeight: 500 }}>{value || '—'}</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <h1 className="text-gray-800 text-xl" style={{ fontWeight: 600 }}>Census Records</h1>
        <p className="text-gray-400 text-sm mt-0.5">{records.length} total records collected</p>
      </div>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Records', value: records.length, icon: FileText, color: '#1E88E5' },
            { label: 'This Month', value: records.filter(r => new Date(r.created_at).getMonth() === new Date().getMonth()).length, icon: Calendar, color: '#43A047' },
            { label: 'Unique UIDs', value: new Set(records.map(r => r.uid)).size, icon: Users, color: '#FF9933' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <p className="text-2xl text-gray-800" style={{ fontWeight: 700 }}>{value}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-50">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-300"
                placeholder="Search by UID, occupation, family type..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading records...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No records found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    {['UID', 'Education', 'Employment', 'Family Type', 'Migration', 'Submitted', 'Action'].map(h => (
                      <th key={h} className="px-4 py-3 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <code className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">{r.uid}</code>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{r.education || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{r.employment_status || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{r.family_type || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg text-xs ${r.migration_status === 'Native' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                          {r.migration_status || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelected(r)}
                          className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-3xl">
              <div>
                <h3 className="text-gray-800" style={{ fontWeight: 600 }}>Census Record Details</h3>
                <code className="text-xs text-blue-500">{selected.uid}</code>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <Section title="Personal & Education">
                <Field label="Education" value={selected.education} />
                <Field label="Field of Study" value={selected.field_of_study} />
                <Field label="Blood Group" value={selected.blood_group} />
                <Field label="Disability" value={selected.disability} />
              </Section>

              <Section title="Employment & Income">
                <Field label="Employment Status" value={selected.employment_status} />
                <Field label="Occupation" value={selected.occupation} />
                <Field label="Monthly Income" value={selected.monthly_income ? `₹${selected.monthly_income}` : ''} />
                <Field label="Income Category" value={selected.income_category} />
              </Section>

              <Section title="Housing & Infrastructure">
                <Field label="House Type" value={selected.house_type} />
                <Field label="Ownership" value={selected.ownership} />
                <Field label="Toilet Type" value={selected.toilet_type} />
                <Field label="Drinking Water" value={selected.drinking_water} />
                <Field label="Electricity" value={selected.electricity} />
                <Field label="Cooking Fuel" value={selected.cooking_fuel} />
                <Field label="No. of Rooms" value={selected.num_rooms} />
                <Field label="Internet" value={selected.internet} />
              </Section>

              <Section title="Family Composition">
                <Field label="Total Members" value={selected.total_people} />
                <Field label="Males" value={selected.total_males} />
                <Field label="Females" value={selected.total_females} />
                <Field label="Children" value={selected.total_children} />
                <Field label="Senior Citizens" value={selected.senior_citizens} />
                <Field label="Earning Members" value={selected.earning_members} />
                <Field label="Family Type" value={selected.family_type} />
              </Section>

              <Section title="Health & Wellbeing">
                <Field label="Health Insurance" value={selected.health_insurance} />
                <Field label="COVID Vaccination" value={selected.covid_vaccination} />
                <Field label="Physical Activity" value={selected.physical_activity} />
                <Field label="Nearest Healthcare" value={selected.nearest_healthcare} />
                <div className="col-span-2">
                  <Field label="Chronic Diseases" value={selected.chronic_diseases} />
                </div>
              </Section>

              <Section title="Migration Details">
                <Field label="Migration Status" value={selected.migration_status} />
                <Field label="State of Origin" value={selected.state_of_origin} />
                <Field label="Reason" value={selected.migration_reason} />
                <Field label="Year" value={selected.migration_year} />
              </Section>

              <Section title="Govt Schemes & Benefits">
                <Field label="Ration Card" value={selected.ration_card} />
                <Field label="Bank Account" value={selected.bank_account} />
                <div className="col-span-2">
                  <Field label="Enrolled Schemes" value={selected.govt_schemes} />
                </div>
              </Section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}