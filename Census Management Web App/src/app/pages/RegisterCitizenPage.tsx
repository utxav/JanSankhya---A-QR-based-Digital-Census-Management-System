import { useState } from 'react';
import { User, MapPin, CreditCard, Camera, Check, ChevronRight, Sparkles } from 'lucide-react';

const sections = [
  { id: 1, icon: User, label: 'Personal Details', color: '#FF9933' },
  { id: 2, icon: CreditCard, label: 'Identity & Documents', color: '#138808' },
  { id: 3, icon: MapPin, label: 'Address Details', color: '#0D1B4B' },
  { id: 4, icon: Camera, label: 'Photo Upload', color: '#D4AF37' },
];

const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'];
const religions = ['Hindu', 'Islam', 'Christianity', 'Sikhism', 'Buddhism', 'Jainism', 'Others'];
const castes = ['General', 'OBC', 'SC', 'ST'];
const languages = ['Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Urdu', 'Odia', 'Others'];

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5" style={{ fontWeight: 600 }}>
        {label} {required && <span className="text-[#FF9933]">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF9933]/60 focus:ring-2 focus:ring-[#FF9933]/10 bg-white transition-all placeholder-gray-300";
const selectCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF9933]/60 bg-white text-gray-600";

export function RegisterCitizenPage() {
  const [active, setActive] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [generatedUID, setGeneratedUID] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', dob: '', gender: 'Male', religion: 'Hindu', caste: 'OBC',
    motherTongue: 'Hindi', maritalStatus: 'Single', mobile: '', email: '',
    aadhaar: '', voter: '', pan: '', drivingLic: '', passport: '',
    houseNo: '', street: '', village: '', district: '', state: '', pincode: '',
    photo: null as File | null,
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    const uid = 'CEN' + Math.floor(100000 + Math.random() * 900000);
    setGeneratedUID(uid);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div className="px-6 py-5 border-b border-gray-100 bg-white">
          <h1 className="text-gray-800 text-xl" style={{ fontWeight: 600 }}>Register Citizen</h1>
        </div>
        <div className="p-6 flex items-center justify-center min-h-[70vh]">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-10 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Check size={36} className="text-green-500" />
            </div>
            <h2 className="text-gray-800 text-2xl mb-2" style={{ fontWeight: 700 }}>Registration Successful!</h2>
            <p className="text-gray-400 text-sm mb-6">Citizen has been registered successfully in the system</p>

            <div className="bg-gradient-to-r from-[#0D1B4B] to-[#162254] rounded-2xl p-6 mb-6 text-white">
              <p className="text-white/60 text-xs mb-1">Unique Citizen ID (UID)</p>
              <p className="text-3xl tracking-wider" style={{ fontWeight: 700 }}>{generatedUID}</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF9933]" />
                <p className="text-white/50 text-xs">QR Code generated &amp; UID Card ready</p>
              </div>
            </div>

            <div className="bg-[#F4F6FA] rounded-xl p-4 mb-6 text-left">
              <p className="text-gray-600 text-sm" style={{ fontWeight: 600 }}>
                {form.firstName} {form.lastName}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">{form.mobile} · {form.state}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setSubmitted(false); setActive(1); setForm({ firstName: '', lastName: '', dob: '', gender: 'Male', religion: 'Hindu', caste: 'OBC', motherTongue: 'Hindi', maritalStatus: 'Single', mobile: '', email: '', aadhaar: '', voter: '', pan: '', drivingLic: '', passport: '', houseNo: '', street: '', village: '', district: '', state: '', pincode: '', photo: null }); }}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all"
                style={{ fontWeight: 500 }}
              >
                Register Another
              </button>
              <button className="flex-1 py-3 rounded-xl bg-[#FF9933] text-white text-sm hover:bg-orange-500 transition-all shadow-sm" style={{ fontWeight: 600 }}>
                Print UID Card
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <h1 className="text-gray-800 text-xl" style={{ fontWeight: 600 }}>Register Citizen</h1>
        <p className="text-gray-400 text-sm mt-0.5">Add new citizen to the census database</p>
      </div>

      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
            {sections.map((s, i) => {
              const Icon = s.icon;
              const isDone = s.id < active;
              const isActive = s.id === active;
              return (
                <div key={s.id} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => s.id <= active && setActive(s.id)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all ${isActive ? 'bg-[#0D1B4B] text-white shadow-md' : isDone ? 'bg-green-50 text-green-600 cursor-pointer hover:bg-green-100' : 'bg-gray-50 text-gray-400 cursor-not-allowed'}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-white/20' : isDone ? 'bg-green-500' : 'bg-gray-200'}`}>
                      {isDone ? <Check size={14} className="text-white" /> : <Icon size={14} className={isActive ? 'text-white' : ''} />}
                    </div>
                    <span className="text-xs hidden sm:block" style={{ fontWeight: 600 }}>{s.label}</span>
                  </button>
                  {i < sections.length - 1 && (
                    <ChevronRight size={16} className="text-gray-300 mx-2 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #F8F9FB, #ffffff)' }}>
              {(() => {
                const s = sections[active - 1];
                const Icon = s.icon;
                return (
                  <>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
                      <Icon size={18} style={{ color: s.color }} />
                    </div>
                    <div>
                      <h3 className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>Section {active}: {s.label}</h3>
                      <p className="text-gray-400 text-xs">Fill in the required details</p>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="p-6">
              {/* Section 1: Personal */}
              {active === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="First Name" required>
                    <input className={inputCls} value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="e.g. Rajesh" />
                  </FormField>
                  <FormField label="Last Name" required>
                    <input className={inputCls} value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="e.g. Kumar" />
                  </FormField>
                  <FormField label="Date of Birth" required>
                    <input type="date" className={inputCls} value={form.dob} onChange={e => set('dob', e.target.value)} />
                  </FormField>
                  <FormField label="Gender" required>
                    <select className={selectCls} value={form.gender} onChange={e => set('gender', e.target.value)}>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </FormField>
                  <FormField label="Religion">
                    <select className={selectCls} value={form.religion} onChange={e => set('religion', e.target.value)}>
                      {religions.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Caste">
                    <select className={selectCls} value={form.caste} onChange={e => set('caste', e.target.value)}>
                      {castes.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Mother Tongue">
                    <select className={selectCls} value={form.motherTongue} onChange={e => set('motherTongue', e.target.value)}>
                      {languages.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Marital Status">
                    <select className={selectCls} value={form.maritalStatus} onChange={e => set('maritalStatus', e.target.value)}>
                      <option>Single</option><option>Married</option><option>Widowed</option><option>Divorced</option>
                    </select>
                  </FormField>
                  <FormField label="Mobile Number" required>
                    <input className={inputCls} value={form.mobile} onChange={e => set('mobile', e.target.value)} placeholder="10-digit mobile number" maxLength={10} />
                  </FormField>
                  <FormField label="Email Address">
                    <input type="email" className={inputCls} value={form.email} onChange={e => set('email', e.target.value)} placeholder="example@email.com" />
                  </FormField>
                </div>
              )}

              {/* Section 2: Identity */}
              {active === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { key: 'aadhaar', label: 'Aadhaar Number', placeholder: '12-digit Aadhaar', maxLen: 12 },
                    { key: 'voter', label: 'Voter ID', placeholder: 'e.g. ABC1234567', maxLen: 10 },
                    { key: 'pan', label: 'PAN Card', placeholder: 'e.g. ABCDE1234F', maxLen: 10 },
                    { key: 'drivingLic', label: 'Driving Licence', placeholder: 'e.g. DL01-2023-000123' },
                    { key: 'passport', label: 'Passport Number', placeholder: 'e.g. A1234567', maxLen: 8 },
                  ].map(({ key, label, placeholder, maxLen }) => (
                    <FormField key={key} label={label}>
                      <input
                        className={inputCls}
                        value={(form as any)[key]}
                        onChange={e => set(key, e.target.value)}
                        placeholder={placeholder}
                        maxLength={maxLen}
                      />
                    </FormField>
                  ))}
                  <div className="md:col-span-2 bg-[#FFF8F0] border border-[#FF9933]/20 rounded-xl p-4">
                    <p className="text-[#FF9933] text-xs" style={{ fontWeight: 600 }}>📋 Note: All identity documents are optional but help in better citizen identification. Aadhaar is the primary identity document.</p>
                  </div>
                </div>
              )}

              {/* Section 3: Address */}
              {active === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="House/Flat Number">
                    <input className={inputCls} value={form.houseNo} onChange={e => set('houseNo', e.target.value)} placeholder="e.g. 12A" />
                  </FormField>
                  <FormField label="Street/Colony">
                    <input className={inputCls} value={form.street} onChange={e => set('street', e.target.value)} placeholder="e.g. Gandhi Nagar" />
                  </FormField>
                  <FormField label="Village/Town/City">
                    <input className={inputCls} value={form.village} onChange={e => set('village', e.target.value)} placeholder="e.g. Lucknow" />
                  </FormField>
                  <FormField label="District" required>
                    <input className={inputCls} value={form.district} onChange={e => set('district', e.target.value)} placeholder="e.g. Lucknow" />
                  </FormField>
                  <FormField label="State" required>
                    <select className={selectCls} value={form.state} onChange={e => set('state', e.target.value)}>
                      <option value="">Select State</option>
                      {states.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </FormField>
                  <FormField label="PIN Code" required>
                    <input className={inputCls} value={form.pincode} onChange={e => set('pincode', e.target.value)} placeholder="6-digit PIN" maxLength={6} />
                  </FormField>
                </div>
              )}

              {/* Section 4: Photo */}
              {active === 4 && (
                <div className="flex flex-col items-center py-4">
                  <div className="w-32 h-36 rounded-2xl bg-[#F4F6FA] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center mb-6 relative overflow-hidden">
                    {form.photo ? (
                      <img src={URL.createObjectURL(form.photo)} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <>
                        <Camera size={28} className="text-gray-300 mb-2" />
                        <p className="text-xs text-gray-400 text-center px-2">Citizen Photo</p>
                      </>
                    )}
                  </div>
                  <label className="px-6 py-3 bg-[#0D1B4B] text-white text-sm rounded-xl cursor-pointer hover:bg-[#162254] transition-all shadow-sm" style={{ fontWeight: 500 }}>
                    <span className="flex items-center gap-2"><Camera size={15} /> Upload Photo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => set('photo', e.target.files?.[0] || null)} />
                  </label>
                  <p className="text-gray-400 text-xs mt-3">JPG, PNG up to 2MB. Clear face photo required.</p>

                  <div className="mt-8 bg-[#F0FDF4] border border-green-100 rounded-xl p-5 w-full max-w-sm text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Sparkles size={16} className="text-[#138808]" />
                      <p className="text-[#138808] text-sm" style={{ fontWeight: 600 }}>Ready to Register</p>
                    </div>
                    <p className="text-gray-500 text-xs">System will automatically generate a unique UID and QR code upon submission.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-[#F8F9FB]">
              <button
                onClick={() => setActive(a => Math.max(1, a - 1))}
                disabled={active === 1}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{ fontWeight: 500 }}
              >
                Previous
              </button>
              <div className="flex gap-1.5">
                {sections.map(s => (
                  <div key={s.id} className={`h-1.5 rounded-full transition-all ${s.id === active ? 'w-6 bg-[#FF9933]' : s.id < active ? 'w-4 bg-[#138808]' : 'w-4 bg-gray-200'}`} />
                ))}
              </div>
              {active < 4 ? (
                <button
                  onClick={() => setActive(a => Math.min(4, a + 1))}
                  className="px-5 py-2.5 rounded-xl bg-[#0D1B4B] text-white text-sm hover:bg-[#162254] transition-all shadow-sm flex items-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  Next <ChevronRight size={15} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-xl bg-[#138808] text-white text-sm hover:bg-green-700 transition-all shadow-sm flex items-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  <Check size={15} /> Register Citizen
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
