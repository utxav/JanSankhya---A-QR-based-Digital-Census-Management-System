import { useState } from 'react';
import { Search, Check, ChevronRight, GraduationCap, Briefcase, Home, Users, Heart, ArrowUpDown, BookOpen } from 'lucide-react';
import { mockCitizens } from '../data/mockData';

const steps = [
  { id: 1, icon: GraduationCap, label: 'Personal & Education', color: '#FF9933' },
  { id: 2, icon: Briefcase, label: 'Employment & Income', color: '#138808' },
  { id: 3, icon: Home, label: 'Housing & Infrastructure', color: '#0D1B4B' },
  { id: 4, icon: Users, label: 'Family Composition', color: '#D4AF37' },
  { id: 5, icon: Heart, label: 'Health & Wellbeing', color: '#9C27B0' },
  { id: 6, icon: ArrowUpDown, label: 'Migration Details', color: '#C84B31' },
  { id: 7, icon: BookOpen, label: 'Govt Schemes & Benefits', color: '#00797B' },
];

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF9933]/60 focus:ring-2 focus:ring-[#FF9933]/10 bg-white transition-all placeholder-gray-300";
const selectCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF9933]/60 bg-white text-gray-700";

function Field({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <div className={span2 ? 'md:col-span-2' : ''}>
      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5" style={{ fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}

function CheckboxGroup({ label, options, selected, onChange }: { label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (o: string) => onChange(selected.includes(o) ? selected.filter(x => x !== o) : [...selected, o]);
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2" style={{ fontWeight: 600 }}>{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button key={o} type="button" onClick={() => toggle(o)}
            className={`px-3 py-1.5 rounded-xl text-xs transition-all ${selected.includes(o) ? 'bg-[#FF9933] text-white shadow-sm' : 'bg-[#F4F6FA] text-gray-500 hover:bg-orange-50 hover:text-[#FF9933]'}`}
            style={{ fontWeight: 500 }}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CensusEntryPage() {
  const [uidSearch, setUidSearch] = useState('');
  const [citizen, setCitizen] = useState<typeof mockCitizens[0] | null>(null);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Form states
  const [education, setEducation] = useState('Bachelor');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [disability, setDisability] = useState('None');
  const [employment, setEmployment] = useState('Employed');
  const [occupation, setOccupation] = useState('');
  const [income, setIncome] = useState('');
  const [houseType, setHouseType] = useState('Pucca');
  const [ownership, setOwnership] = useState('Owned');
  const [toilet, setToilet] = useState('Flush');
  const [water, setWater] = useState('Municipal Tap');
  const [electricity, setElectricity] = useState('Grid');
  const [fuel, setFuel] = useState('LPG/PNG');
  const [familyType, setFamilyType] = useState('Nuclear');
  const [members, setMembers] = useState('4');
  const [migrated, setMigrated] = useState('Native');
  const [migrationReason, setMigrationReason] = useState('');
  const [schemes, setSchemes] = useState<string[]>([]);
  const [diseases, setDiseases] = useState<string[]>([]);
  const [vaccinated, setVaccinated] = useState('Yes');
  const [insurance, setInsurance] = useState('Government Scheme');

  const handleSearch = () => {
    const found = mockCitizens.find(c => c.uid.toLowerCase() === uidSearch.toLowerCase() || c.name.toLowerCase().includes(uidSearch.toLowerCase()));
    if (found) { setCitizen(found); setNotFound(false); }
    else setNotFound(true);
  };

  if (submitted) {
    return (
      <div style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div className="px-6 py-5 border-b border-gray-100 bg-white">
          <h1 className="text-gray-800 text-xl" style={{ fontWeight: 600 }}>Census Entry</h1>
        </div>
        <div className="p-6 flex items-center justify-center min-h-[70vh]">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-10 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Check size={36} className="text-green-500" />
            </div>
            <h2 className="text-gray-800 text-2xl mb-2" style={{ fontWeight: 700 }}>Census Data Submitted!</h2>
            <p className="text-gray-400 text-sm mb-6">All 7 sections have been recorded successfully</p>
            <div className="bg-[#F4F6FA] rounded-xl p-4 mb-6">
              <p className="text-gray-600 text-sm" style={{ fontWeight: 600 }}>{citizen?.name}</p>
              <code className="text-xs text-[#FF9933]">{citizen?.uid}</code>
            </div>
            <button
              onClick={() => { setCitizen(null); setStep(1); setSubmitted(false); setUidSearch(''); }}
              className="w-full py-3 rounded-xl bg-[#0D1B4B] text-white text-sm hover:bg-[#162254] transition-all"
              style={{ fontWeight: 600 }}
            >
              Enter New Census
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <h1 className="text-gray-800 text-xl" style={{ fontWeight: 600 }}>Census Entry</h1>
        <p className="text-gray-400 text-sm mt-0.5">7-step data collection form</p>
      </div>

      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-5">
          {/* UID Search */}
          {!citizen ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-gray-700 text-sm mb-4" style={{ fontWeight: 600 }}>Search Citizen by UID or Name</h3>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF9933]/60 focus:ring-2 focus:ring-[#FF9933]/10"
                    placeholder="Enter UID (e.g. CEN847291) or name..."
                    value={uidSearch}
                    onChange={e => setUidSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <button onClick={handleSearch} className="px-6 py-3 rounded-xl bg-[#0D1B4B] text-white text-sm hover:bg-[#162254] transition-all" style={{ fontWeight: 600 }}>
                  Load
                </button>
              </div>
              {notFound && (
                <div className="mt-3 p-3 bg-red-50 rounded-xl text-red-500 text-sm border border-red-100">
                  No citizen found. Try: CEN847291 or "Rajesh"
                </div>
              )}

              {/* Quick select */}
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2" style={{ fontWeight: 500 }}>Quick select:</p>
                <div className="flex flex-wrap gap-2">
                  {mockCitizens.slice(0, 5).map(c => (
                    <button key={c.uid} onClick={() => { setCitizen(c); setNotFound(false); }}
                      className="px-3 py-1.5 bg-[#F4F6FA] text-gray-600 rounded-xl text-xs hover:bg-orange-50 hover:text-[#FF9933] transition-all">
                      {c.uid}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Citizen Card */}
              <div className="bg-gradient-to-r from-[#0D1B4B] to-[#162254] rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FF9933]/20 border border-[#FF9933]/30 flex items-center justify-center text-white text-sm flex-shrink-0" style={{ fontWeight: 700 }}>
                  {citizen.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-white" style={{ fontWeight: 600 }}>{citizen.name}</p>
                  <p className="text-white/50 text-xs">{citizen.uid} · {citizen.state} · {citizen.gender}, {citizen.age} yrs</p>
                </div>
                <button onClick={() => { setCitizen(null); setStep(1); }} className="text-white/40 hover:text-white text-xs">
                  Change
                </button>
              </div>

              {/* Steps */}
              <div className="flex gap-1 overflow-x-auto pb-1">
                {steps.map(s => {
                  const Icon = s.icon;
                  const isDone = s.id < step;
                  const isActive = s.id === step;
                  return (
                    <button key={s.id} onClick={() => s.id <= step && setStep(s.id)}
                      className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl flex-shrink-0 transition-all min-w-[72px] ${isActive ? 'bg-[#0D1B4B] text-white' : isDone ? 'bg-green-50 text-green-600' : 'bg-[#F4F6FA] text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isActive ? 'bg-white/20' : isDone ? 'bg-green-500' : 'bg-gray-200'}`}>
                        {isDone ? <Check size={12} className="text-white" /> : <Icon size={11} className={isActive ? 'text-white' : ''} />}
                      </div>
                      <span className="text-[10px] text-center leading-tight hidden sm:block" style={{ fontWeight: 500 }}>{s.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #F8F9FB, #fff)' }}>
                  {(() => {
                    const s = steps[step - 1]; const Icon = s.icon;
                    return (
                      <>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
                          <Icon size={16} style={{ color: s.color }} />
                        </div>
                        <div>
                          <h3 className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>Step {step}/7: {s.label}</h3>
                          <p className="text-gray-400 text-xs">Census data collection</p>
                        </div>
                        <div className="ml-auto text-xs text-gray-400">{Math.round((step / 7) * 100)}% complete</div>
                      </>
                    );
                  })()}
                </div>
                <div className="h-1 bg-gray-100">
                  <div className="h-full bg-[#FF9933] transition-all" style={{ width: `${(step / 7) * 100}%` }} />
                </div>

                <div className="p-6">
                  {/* Step 1 */}
                  {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field label="Education Level">
                        <select className={selectCls} value={education} onChange={e => setEducation(e.target.value)}>
                          {['No Education', 'Primary', 'Middle', 'Secondary', 'Higher Secondary', 'Diploma', 'Bachelor', 'Master', 'PhD'].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </Field>
                      <Field label="Field of Study">
                        <select className={selectCls} value={fieldOfStudy} onChange={e => setFieldOfStudy(e.target.value)}>
                          <option value="">Select</option>
                          {['Science', 'Commerce', 'Arts', 'Engineering', 'Medicine', 'Law', 'Agriculture', 'Others'].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </Field>
                      <Field label="Blood Group">
                        <select className={selectCls} value={bloodGroup} onChange={e => setBloodGroup(e.target.value)}>
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </Field>
                      <Field label="Disability Status">
                        <select className={selectCls} value={disability} onChange={e => setDisability(e.target.value)}>
                          {['None', 'Visual', 'Physical', 'Hearing', 'Cognitive', 'Multiple'].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </Field>
                    </div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field label="Employment Status">
                        <select className={selectCls} value={employment} onChange={e => setEmployment(e.target.value)}>
                          {['Employed', 'Self-Employed', 'Farmer', 'Student', 'Homemaker', 'Unemployed', 'Retired', 'Daily Wage Worker'].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </Field>
                      <Field label="Occupation">
                        <input className={inputCls} value={occupation} onChange={e => setOccupation(e.target.value)} placeholder="e.g. Software Engineer" />
                      </Field>
                      <Field label="Monthly Income (₹)">
                        <input type="number" className={inputCls} value={income} onChange={e => setIncome(e.target.value)} placeholder="e.g. 35000" />
                      </Field>
                      <Field label="Income Category">
                        <select className={selectCls}>
                          {['BPL', 'Lower', 'Lower-Middle', 'Middle', 'Upper-Middle', 'High Income'].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </Field>
                      <div className="md:col-span-2">
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2" style={{ fontWeight: 600 }}>Documents Owned</label>
                        <div className="flex flex-wrap gap-2">
                          {['PAN Card', 'Driving Licence', 'Passport', 'Voter ID'].map(d => (
                            <label key={d} className="flex items-center gap-2 px-3 py-2 bg-[#F4F6FA] rounded-xl cursor-pointer hover:bg-orange-50 transition-all">
                              <input type="checkbox" className="w-3.5 h-3.5 accent-[#FF9933]" />
                              <span className="text-xs text-gray-600">{d}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3 */}
                  {step === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {[
                        { label: 'House Type', val: houseType, set: setHouseType, opts: ['Pucca', 'Semi-Pucca', 'Kutcha'] },
                        { label: 'Ownership', val: ownership, set: setOwnership, opts: ['Owned', 'Rented', 'Leased', 'Government Quarters'] },
                        { label: 'Toilet Type', val: toilet, set: setToilet, opts: ['Flush', 'Pit Latrine', 'Open Defecation', 'None'] },
                        { label: 'Drinking Water Source', val: water, set: setWater, opts: ['Municipal Tap', 'Hand Pump', 'Tubewell', 'Well', 'River/Pond', 'Tanker'] },
                        { label: 'Electricity Source', val: electricity, set: setElectricity, opts: ['Grid', 'Solar Panel', 'Generator', 'Kerosene Lamp', 'No Electricity'] },
                        { label: 'Cooking Fuel', val: fuel, set: setFuel, opts: ['LPG/PNG', 'Firewood', 'Cow Dung Cake', 'Kerosene', 'Biogas'] },
                      ].map(({ label, val, set, opts }) => (
                        <Field key={label} label={label}>
                          <select className={selectCls} value={val} onChange={e => set(e.target.value)}>
                            {opts.map(o => <option key={o}>{o}</option>)}
                          </select>
                        </Field>
                      ))}
                      <Field label="Number of Rooms">
                        <input type="number" className={inputCls} defaultValue={3} min={1} max={20} />
                      </Field>
                      <Field label="Internet Access">
                        <select className={selectCls}>
                          {['Broadband', 'Mobile Data (4G/5G)', 'Mobile Data (2G/3G)', 'No Internet'].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </Field>
                    </div>
                  )}

                  {/* Step 4 */}
                  {step === 4 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {[
                        ['Total Family Members', members, setMembers],
                        ['Male Members', '2', () => {}],
                        ['Female Members', '2', () => {}],
                        ['Children (below 18)', '1', () => {}],
                        ['Senior Citizens (60+)', '1', () => {}],
                        ['Earning Members', '2', () => {}],
                      ].map(([lbl, val, setter]: any) => (
                        <Field key={lbl} label={lbl}>
                          <input type="number" className={inputCls} defaultValue={val} min={0} />
                        </Field>
                      ))}
                      <Field label="Family Type">
                        <select className={selectCls} value={familyType} onChange={e => setFamilyType(e.target.value)}>
                          {['Nuclear', 'Joint', 'Single Person', 'Single Parent'].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </Field>
                      <Field label="Head of Family">
                        <input className={inputCls} placeholder="Name of head" defaultValue={citizen?.name} />
                      </Field>
                    </div>
                  )}

                  {/* Step 5 */}
                  {step === 5 && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Health Insurance">
                          <select className={selectCls} value={insurance} onChange={e => setInsurance(e.target.value)}>
                            {['Government Scheme', 'Private', 'Employer', 'None'].map(o => <option key={o}>{o}</option>)}
                          </select>
                        </Field>
                        <Field label="COVID Vaccination">
                          <select className={selectCls} value={vaccinated} onChange={e => setVaccinated(e.target.value)}>
                            {['Yes - Both Doses', 'Yes - One Dose', 'No', 'Booster Taken'].map(o => <option key={o}>{o}</option>)}
                          </select>
                        </Field>
                        <Field label="Physical Activity">
                          <select className={selectCls}>
                            {['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'].map(o => <option key={o}>{o}</option>)}
                          </select>
                        </Field>
                        <Field label="Nearest Healthcare Facility">
                          <select className={selectCls}>
                            {['Government Hospital', 'Private Hospital', 'PHC', 'CHC', 'ASHA Centre', 'None Nearby'].map(o => <option key={o}>{o}</option>)}
                          </select>
                        </Field>
                      </div>
                      <CheckboxGroup label="Chronic Diseases" options={['Diabetes', 'Hypertension', 'Heart Disease', 'Cancer', 'Tuberculosis', 'Asthma', 'None']} selected={diseases} onChange={setDiseases} />
                    </div>
                  )}

                  {/* Step 6 */}
                  {step === 6 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field label="Migration Status">
                        <select className={selectCls} value={migrated} onChange={e => setMigrated(e.target.value)}>
                          <option>Native</option>
                          <option>Migrated from another state</option>
                          <option>Migrated from another district</option>
                        </select>
                      </Field>
                      {migrated !== 'Native' && (
                        <>
                          <Field label="State of Origin">
                            <select className={selectCls}>
                              {['Uttar Pradesh', 'Bihar', 'Rajasthan', 'West Bengal', 'Madhya Pradesh'].map(o => <option key={o}>{o}</option>)}
                            </select>
                          </Field>
                          <Field label="Reason for Migration">
                            <select className={selectCls} value={migrationReason} onChange={e => setMigrationReason(e.target.value)}>
                              <option value="">Select reason</option>
                              {['Employment', 'Education', 'Marriage', 'Business', 'Family', 'Natural Disaster'].map(o => <option key={o}>{o}</option>)}
                            </select>
                          </Field>
                          <Field label="Year of Migration">
                            <input type="number" className={inputCls} placeholder="e.g. 2018" min={1980} max={2026} />
                          </Field>
                        </>
                      )}
                      {migrated === 'Native' && (
                        <div className="md:col-span-2 bg-[#F0FDF4] rounded-xl p-4 border border-green-100">
                          <p className="text-[#138808] text-sm" style={{ fontWeight: 500 }}>✓ This citizen is native to {citizen?.state}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 7 */}
                  {step === 7 && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Ration Card Type">
                          <select className={selectCls}>
                            {['APL', 'BPL', 'AAY (Antyodaya)', 'PHH', 'None'].map(o => <option key={o}>{o}</option>)}
                          </select>
                        </Field>
                        <Field label="Bank Account">
                          <select className={selectCls}>
                            {['Yes - Regular', 'Yes - Jan Dhan', 'No'].map(o => <option key={o}>{o}</option>)}
                          </select>
                        </Field>
                      </div>
                      <CheckboxGroup
                        label="Government Scheme Enrollment"
                        options={['PM Awas Yojana', 'Ayushman Bharat', 'PM Kisan', 'Mudra Loan', 'MNREGA', 'Ujjwala Yojana', 'Beti Bachao', 'None']}
                        selected={schemes}
                        onChange={setSchemes}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <label className="flex items-center gap-3 p-3 bg-[#F4F6FA] rounded-xl cursor-pointer hover:bg-orange-50 transition-all">
                          <input type="checkbox" className="w-4 h-4 accent-[#FF9933]" />
                          <span className="text-sm text-gray-600">Scholarship / Education Aid Received</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 bg-[#F4F6FA] rounded-xl cursor-pointer hover:bg-orange-50 transition-all">
                          <input type="checkbox" className="w-4 h-4 accent-[#FF9933]" />
                          <span className="text-sm text-gray-600">Mid-Day Meal Beneficiary</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Nav */}
                <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-[#F8F9FB]">
                  <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    style={{ fontWeight: 500 }}>
                    Previous
                  </button>
                  <div className="text-xs text-gray-400">{step} / 7</div>
                  {step < 7 ? (
                    <button onClick={() => setStep(s => Math.min(7, s + 1))}
                      className="px-5 py-2.5 rounded-xl bg-[#0D1B4B] text-white text-sm hover:bg-[#162254] transition-all shadow-sm flex items-center gap-2"
                      style={{ fontWeight: 600 }}>
                      Next <ChevronRight size={15} />
                    </button>
                  ) : (
                    <button onClick={() => setSubmitted(true)}
                      className="px-5 py-2.5 rounded-xl bg-[#138808] text-white text-sm hover:bg-green-700 transition-all shadow-sm flex items-center gap-2"
                      style={{ fontWeight: 600 }}>
                      <Check size={15} /> Submit Census
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
