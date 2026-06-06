import { useState } from 'react';
import { User, Shield, Bell, Globe, Eye, EyeOff, Check, ChevronRight } from 'lucide-react';

const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'preferences', label: 'Preferences', icon: Globe },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    newRegistration: true, censusUpdate: true, systemAlert: false, dailyReport: true,
  });

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF9933]/60 focus:ring-2 focus:ring-[#FF9933]/10 bg-white transition-all";

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <h1 className="text-gray-800 text-xl" style={{ fontWeight: 600 }}>Settings</h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-[#F4F6FA] p-1 rounded-2xl w-fit">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${activeTab === t.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  style={{ fontWeight: activeTab === t.id ? 600 : 400 }}>
                  <Icon size={14} />
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF9933] to-[#E8841A] flex items-center justify-center text-white text-xl" style={{ fontWeight: 700 }}>A</div>
                  <div>
                    <h3 className="text-gray-800 text-base" style={{ fontWeight: 600 }}>Admin User</h3>
                    <p className="text-gray-400 text-sm">EMP00001 · Administrator</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
                      <span className="text-[#138808] text-xs" style={{ fontWeight: 500 }}>Active</span>
                    </div>
                  </div>
                  <button className="ml-auto px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-500 hover:border-[#FF9933]/40 hover:text-[#FF9933] transition-all">
                    Change Photo
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'First Name', val: 'Admin', placeholder: 'First name' },
                    { label: 'Last Name', val: 'User', placeholder: 'Last name' },
                    { label: 'Employee ID', val: 'EMP00001', placeholder: '', disabled: true },
                    { label: 'Role', val: 'Administrator', placeholder: '', disabled: true },
                    { label: 'Email', val: 'admin@census.gov.in', placeholder: 'Email address' },
                    { label: 'Mobile', val: '9876543210', placeholder: 'Mobile number' },
                  ].map(({ label, val, placeholder, disabled }) => (
                    <div key={label}>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5" style={{ fontWeight: 600 }}>{label}</label>
                      <input defaultValue={val} placeholder={placeholder} disabled={disabled}
                        className={`${inputCls} ${disabled ? 'bg-[#F8F9FB] text-gray-400 cursor-not-allowed' : ''}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-gray-800 text-sm mb-4" style={{ fontWeight: 600 }}>Assigned Region</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5" style={{ fontWeight: 600 }}>State</label>
                    <div className="px-4 py-2.5 bg-[#F8F9FB] rounded-xl text-sm text-gray-600">All States</div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5" style={{ fontWeight: 600 }}>District</label>
                    <div className="px-4 py-2.5 bg-[#F8F9FB] rounded-xl text-sm text-gray-600">All Districts</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-gray-800 text-sm mb-5" style={{ fontWeight: 600 }}>Change Password</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Current Password', show: showOld, toggle: () => setShowOld(!showOld) },
                    { label: 'New Password', show: showNew, toggle: () => setShowNew(!showNew) },
                    { label: 'Confirm New Password', show: showNew, toggle: () => setShowNew(!showNew) },
                  ].map(({ label, show, toggle }) => (
                    <div key={label}>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5" style={{ fontWeight: 600 }}>{label}</label>
                      <div className="relative">
                        <input type={show ? 'text' : 'password'} className={inputCls} placeholder="••••••••" />
                        <button onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                          {show ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-gray-800 text-sm mb-4" style={{ fontWeight: 600 }}>Two-Factor Authentication</h3>
                <div className="space-y-3">
                  {[
                    { label: 'SMS OTP', desc: 'Receive OTP on +91-9876543210', enabled: true },
                    { label: 'Email OTP', desc: 'Receive OTP on admin@census.gov.in', enabled: false },
                  ].map(({ label, desc, enabled }) => (
                    <div key={label} className="flex items-center justify-between p-4 bg-[#F8F9FB] rounded-xl">
                      <div>
                        <p className="text-gray-700 text-sm" style={{ fontWeight: 500 }}>{label}</p>
                        <p className="text-gray-400 text-xs">{desc}</p>
                      </div>
                      <div className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${enabled ? 'bg-[#138808]' : 'bg-gray-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'left-7' : 'left-1'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-gray-800 text-sm mb-5" style={{ fontWeight: 600 }}>Notification Preferences</h3>
              <div className="space-y-3">
                {[
                  { key: 'newRegistration', label: 'New Citizen Registration', desc: 'When a new citizen is registered' },
                  { key: 'censusUpdate', label: 'Census Entry Updates', desc: 'When census data is submitted' },
                  { key: 'systemAlert', label: 'System Alerts', desc: 'Critical system notifications' },
                  { key: 'dailyReport', label: 'Daily Summary Report', desc: 'End of day census statistics' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-[#F8F9FB] rounded-xl hover:bg-[#F0F2F7] transition-colors">
                    <div>
                      <p className="text-gray-700 text-sm" style={{ fontWeight: 500 }}>{label}</p>
                      <p className="text-gray-400 text-xs">{desc}</p>
                    </div>
                    <div
                      onClick={() => setNotifications(n => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                      className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${notifications[key as keyof typeof notifications] ? 'bg-[#FF9933]' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifications[key as keyof typeof notifications] ? 'left-7' : 'left-1'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-gray-800 text-sm mb-4" style={{ fontWeight: 600 }}>System Preferences</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Language', options: ['English', 'हिन्दी', 'ગુજરાતી', 'తెలుగు', 'தமிழ்'], current: 'English' },
                    { label: 'Date Format', options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'], current: 'DD/MM/YYYY' },
                    { label: 'Currency', options: ['₹ INR', '$ USD'], current: '₹ INR' },
                    { label: 'Time Zone', options: ['Asia/Kolkata (IST +5:30)', 'UTC'], current: 'Asia/Kolkata (IST +5:30)' },
                  ].map(({ label, options, current }) => (
                    <div key={label}>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5" style={{ fontWeight: 600 }}>{label}</label>
                      <select className={inputCls} defaultValue={current}>
                        {options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-gray-800 text-sm mb-4" style={{ fontWeight: 600 }}>About System</h3>
                {[
                  ['System', 'Census Management System'],
                  ['Version', 'v2.0.0'],
                  ['Build', '2026.02.27'],
                  ['Organization', 'CMPICA, CHARUSAT'],
                  ['Guide', 'Dr. Ankit Faldu'],
                  ['Database', 'MySQL 8.0'],
                  ['Backend', 'Node.js + Express'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-2.5 border-b border-gray-50">
                    <span className="text-xs text-gray-400">{k}</span>
                    <span className="text-xs text-gray-600" style={{ fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button onClick={handleSave}
              className={`px-8 py-3 rounded-xl text-sm flex items-center gap-2 transition-all shadow-sm ${saved ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-[#0D1B4B] text-white hover:bg-[#162254]'}`}
              style={{ fontWeight: 600 }}>
              {saved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
