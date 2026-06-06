import { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, QrCode, ClipboardList, BarChart3, User, MapPin, Wifi, Battery, Signal, Check, Eye, EyeOff, ArrowRight, Camera, Landmark, Users } from 'lucide-react';

const screens = [
  { id: 'welcome', label: 'Welcome', icon: Landmark },
  { id: 'login', label: 'Login', icon: User },
  { id: 'home', label: 'Home', icon: Home },
  { id: 'scanner', label: 'QR Scanner', icon: QrCode },
  { id: 'form', label: 'Census Form', icon: ClipboardList },
  { id: 'confirm', label: 'Confirmation', icon: Check },
];

// Ashoka Chakra
const ChakraSVG = ({ size = 32, color = '#FF9933' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="3" fill="none" />
    <circle cx="50" cy="50" r="8" fill={color} />
    {Array.from({ length: 24 }).map((_, i) => {
      const a = (i * 15 * Math.PI) / 180;
      return <line key={i} x1={50 + 10 * Math.cos(a)} y1={50 + 10 * Math.sin(a)} x2={50 + 42 * Math.cos(a)} y2={50 + 42 * Math.sin(a)} stroke={color} strokeWidth="1.5" />;
    })}
  </svg>
);

function PhoneStatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-3 pb-1">
      <span className="text-white text-xs" style={{ fontWeight: 600 }}>9:41</span>
      <div className="flex items-center gap-1">
        <Signal size={12} className="text-white" />
        <Wifi size={12} className="text-white" />
        <Battery size={12} className="text-white" />
      </div>
    </div>
  );
}

function WelcomeScreen() {
  return (
    <div className="flex-1 bg-[#0D1B4B] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      {/* Tricolor at top */}
      <div className="absolute top-0 left-0 right-0 flex h-1.5">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-5">
          <ChakraSVG size={40} color="#FF9933" />
        </div>
        <h1 className="text-white text-2xl mb-1" style={{ fontWeight: 800 }}>Census</h1>
        <h2 className="text-white text-xl mb-1" style={{ fontWeight: 700 }}>Management</h2>
        <h2 className="text-[#FF9933] text-xl mb-3" style={{ fontWeight: 700 }}>System</h2>
        <div className="flex gap-1 mb-4">
          <div className="h-1 w-8 rounded-full bg-[#FF9933]" />
          <div className="h-1 w-4 rounded-full bg-white/50" />
          <div className="h-1 w-8 rounded-full bg-[#138808]" />
        </div>
        <p className="text-white/60 text-xs mb-1">Digital India Initiative</p>
        <p className="text-white/40 text-xs mb-8">QR-based Citizen Identification</p>
        <button className="w-full py-3.5 rounded-2xl bg-[#FF9933] text-white text-sm" style={{ fontWeight: 700 }}>
          Get Started →
        </button>
        <p className="text-white/30 text-[10px] mt-4">Government of India · CMPICA · 2026</p>
      </div>
    </div>
  );
}

function LoginScreen() {
  const [show, setShow] = useState(false);
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="bg-[#0D1B4B] px-5 pb-8 pt-4">
        <p className="text-[#FF9933] text-xs mb-1" style={{ fontWeight: 600 }}>GOVERNMENT OF INDIA</p>
        <h2 className="text-white text-xl" style={{ fontWeight: 700 }}>Welcome back</h2>
        <p className="text-white/50 text-xs mt-0.5">Sign in with your employee ID</p>
      </div>
      <div className="flex-1 px-5 pt-6 space-y-4">
        <div>
          <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider" style={{ fontWeight: 600 }}>Employee ID</p>
          <div className="px-4 py-3 bg-[#F4F6FA] rounded-xl border border-transparent focus-within:border-[#FF9933]/50">
            <input className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none" placeholder="e.g. EMP00001" defaultValue="EMP00001" />
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider" style={{ fontWeight: 600 }}>Password</p>
          <div className="px-4 py-3 bg-[#F4F6FA] rounded-xl flex items-center gap-2">
            <input type={show ? 'text' : 'password'} className="flex-1 bg-transparent text-sm text-gray-700 outline-none" defaultValue="Admin@123" />
            <button onClick={() => setShow(!show)}>{show ? <EyeOff size={15} className="text-gray-400" /> : <Eye size={15} className="text-gray-400" />}</button>
          </div>
        </div>
        <div className="bg-[#FFF8F0] border border-[#FF9933]/20 rounded-xl p-3">
          <p className="text-[#FF9933] text-[10px]" style={{ fontWeight: 600 }}>OTP will be sent to registered mobile number for verification</p>
        </div>
        <button className="w-full py-3.5 rounded-2xl bg-[#0D1B4B] text-white text-sm flex items-center justify-center gap-2 mt-2" style={{ fontWeight: 700 }}>
          Sign In <ArrowRight size={15} />
        </button>
        <p className="text-center text-gray-400 text-[10px]">Census Management System v2.0</p>
      </div>
    </div>
  );
}

function HomeScreen() {
  return (
    <div className="flex-1 bg-[#F4F6FA] flex flex-col">
      <div className="bg-[#0D1B4B] px-5 pb-6 pt-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/60 text-xs">Good morning,</p>
            <p className="text-white text-base" style={{ fontWeight: 700 }}>Sunil Sharma 👋</p>
            <p className="text-white/40 text-[10px]">EMP00002 · Lucknow, UP</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FF9933] flex items-center justify-center text-white text-sm" style={{ fontWeight: 700 }}>S</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[{ v: '250', l: 'Assigned' }, { v: '230', l: 'Done' }, { v: '92%', l: 'Rate' }].map(({ v, l }) => (
            <div key={l} className="bg-white/10 rounded-xl py-2.5 text-center">
              <p className="text-white text-base" style={{ fontWeight: 700 }}>{v}</p>
              <p className="text-white/50 text-[10px]">{l}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 px-4 pt-4">
        <p className="text-gray-500 text-xs mb-3 uppercase tracking-wider" style={{ fontWeight: 600 }}>Quick Actions</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { icon: QrCode, label: 'Scan & Record', color: '#FF9933', desc: 'Scan QR code' },
            { icon: ClipboardList, label: 'My Records', color: '#0D1B4B', desc: '230 entries' },
            { icon: MapPin, label: 'Area Allocated', color: '#138808', desc: 'Lucknow Block A' },
            { icon: BarChart3, label: 'My Progress', color: '#9C27B0', desc: '92% complete' },
          ].map(({ icon: Icon, label, color, desc }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon size={17} style={{ color }} />
              </div>
              <p className="text-gray-800 text-xs" style={{ fontWeight: 600 }}>{label}</p>
              <p className="text-gray-400 text-[10px]">{desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-gray-700 text-xs mb-2" style={{ fontWeight: 600 }}>Today's Progress</p>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-gray-400">15 of 20 households</span>
            <span className="text-[10px] text-[#138808]" style={{ fontWeight: 600 }}>75%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full">
            <div className="h-full w-3/4 bg-[#138808] rounded-full" />
          </div>
        </div>
      </div>
      {/* Bottom Nav */}
      <div className="flex border-t border-gray-200 bg-white">
        {[{ icon: Home, label: 'Home', active: true }, { icon: QrCode, label: 'Scan' }, { icon: ClipboardList, label: 'Records' }, { icon: User, label: 'Profile' }].map(({ icon: Icon, label, active }) => (
          <button key={label} className={`flex-1 flex flex-col items-center gap-1 py-3 ${active ? 'text-[#FF9933]' : 'text-gray-400'}`}>
            <Icon size={16} />
            <span className="text-[9px]" style={{ fontWeight: active ? 600 : 400 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ScannerScreen() {
  return (
    <div className="flex-1 bg-[#0D1B4B] flex flex-col">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronLeft size={16} className="text-white" />
        </button>
        <div>
          <p className="text-white text-sm" style={{ fontWeight: 600 }}>QR Scanner</p>
          <p className="text-white/50 text-[10px]">Point camera at citizen's UID card</p>
        </div>
      </div>
      {/* Camera viewfinder */}
      <div className="relative flex-1 flex items-center justify-center px-8">
        <div className="w-full aspect-square relative">
          {/* Corner brackets */}
          {[['top-0 left-0', 'border-t-2 border-l-2'], ['top-0 right-0', 'border-t-2 border-r-2'], ['bottom-0 left-0', 'border-b-2 border-l-2'], ['bottom-0 right-0', 'border-b-2 border-r-2']].map(([pos, border], i) => (
            <div key={i} className={`absolute ${pos} w-8 h-8 border-[#FF9933] ${border}`} />
          ))}
          {/* Grid lines */}
          <div className="absolute inset-4 bg-white/5 rounded">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Camera size={24} className="text-white/30 mx-auto mb-2" />
                <p className="text-white/40 text-xs">Scanning...</p>
              </div>
            </div>
            {/* Scan line */}
            <div className="absolute left-0 right-0 h-0.5 bg-[#FF9933]/70 top-1/3" style={{ boxShadow: '0 0 8px #FF9933' }} />
          </div>
        </div>
      </div>
      {/* Detected card */}
      <div className="mx-4 mb-4 bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#138808] animate-pulse" />
          <p className="text-[#138808] text-xs" style={{ fontWeight: 600 }}>QR Code Detected</p>
        </div>
        <p className="text-white text-sm" style={{ fontWeight: 600 }}>Rajesh Kumar Singh</p>
        <p className="text-white/50 text-xs">CEN847291 · Uttar Pradesh</p>
        <button className="mt-3 w-full py-2.5 rounded-xl bg-[#FF9933] text-white text-xs" style={{ fontWeight: 700 }}>
          Load Census Form →
        </button>
      </div>
    </div>
  );
}

function FormScreen() {
  return (
    <div className="flex-1 bg-[#F4F6FA] flex flex-col">
      <div className="bg-[#0D1B4B] px-5 pt-2 pb-5">
        <div className="flex items-center gap-3 mb-3">
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <ChevronLeft size={16} className="text-white" />
          </button>
          <div>
            <p className="text-white text-sm" style={{ fontWeight: 600 }}>Census Form</p>
            <p className="text-white/50 text-[10px]">Rajesh Kumar Singh</p>
          </div>
          <span className="ml-auto text-[#FF9933] text-xs" style={{ fontWeight: 600 }}>Step 1/7</span>
        </div>
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i === 0 ? 'bg-[#FF9933]' : 'bg-white/20'}`} />
          ))}
        </div>
      </div>
      <div className="flex-1 px-4 pt-4 overflow-y-auto">
        <p className="text-gray-700 text-sm mb-4" style={{ fontWeight: 600 }}>Personal &amp; Education</p>
        <div className="space-y-3">
          {[
            { label: 'Education Level', val: 'Bachelor', type: 'select' },
            { label: 'Field of Study', val: 'Science', type: 'select' },
            { label: 'Blood Group', val: 'B+', type: 'select' },
            { label: 'Disability', val: 'None', type: 'select' },
          ].map(({ label, val }) => (
            <div key={label} className="bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-gray-400 text-[10px] mb-1 uppercase tracking-wider" style={{ fontWeight: 600 }}>{label}</p>
              <div className="flex items-center justify-between">
                <p className="text-gray-700 text-sm" style={{ fontWeight: 500 }}>{val}</p>
                <ChevronRight size={14} className="text-gray-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 pb-4">
        <button className="w-full py-3.5 rounded-2xl bg-[#0D1B4B] text-white text-sm flex items-center justify-center gap-2" style={{ fontWeight: 700 }}>
          Next Step <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

function ConfirmScreen() {
  return (
    <div className="flex-1 bg-[#F4F6FA] flex flex-col">
      <div className="bg-[#0D1B4B] px-5 pt-2 pb-5">
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <ChevronLeft size={16} className="text-white" />
          </button>
          <p className="text-white text-sm" style={{ fontWeight: 600 }}>Review &amp; Submit</p>
        </div>
      </div>
      <div className="flex-1 px-4 pt-4 overflow-y-auto">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF9933]/20 flex items-center justify-center text-[#0D1B4B] text-sm" style={{ fontWeight: 700 }}>RK</div>
            <div>
              <p className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>Rajesh Kumar Singh</p>
              <p className="text-gray-400 text-xs">CEN847291</p>
            </div>
          </div>
          {[
            ['Education', 'Bachelor'],
            ['Employment', 'Employed'],
            ['House Type', 'Pucca'],
            ['Family Type', 'Nuclear'],
            ['Vaccination', 'Both Doses'],
            ['Migration', 'Native'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-2 border-t border-gray-50">
              <span className="text-xs text-gray-400">{k}</span>
              <span className="text-xs text-gray-700" style={{ fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
        {/* Signature */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-4 mb-4 text-center">
          <p className="text-gray-400 text-xs mb-2">Digital Signature</p>
          <div className="h-16 flex items-center justify-center">
            <div className="text-gray-300 text-xs italic" style={{ fontFamily: 'cursive', fontSize: 22 }}>Rajesh Kumar</div>
          </div>
          <p className="text-gray-300 text-[10px]">Tap to sign</p>
        </div>
        <button className="w-full py-3.5 rounded-2xl bg-[#138808] text-white text-sm flex items-center justify-center gap-2" style={{ fontWeight: 700 }}>
          <Check size={15} /> Submit to Database
        </button>
      </div>
    </div>
  );
}

const screenComponents: Record<string, React.ReactNode> = {
  welcome: <WelcomeScreen />,
  login: <LoginScreen />,
  home: <HomeScreen />,
  scanner: <ScannerScreen />,
  form: <FormScreen />,
  confirm: <ConfirmScreen />,
};

export function AndroidPage() {
  const [activeScreen, setActiveScreen] = useState('welcome');
  const currentIdx = screens.findIndex(s => s.id === activeScreen);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <h1 className="text-gray-800 text-xl" style={{ fontWeight: 600 }}>Android App Preview</h1>
        <p className="text-gray-400 text-sm mt-0.5">6 screens of the mobile enumerator application</p>
      </div>

      <div className="p-4 md:p-8">
        <div className="flex flex-col xl:flex-row gap-8 items-center xl:items-start">
          {/* Screen selector */}
          <div className="w-full xl:w-56 flex-shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3" style={{ fontWeight: 600 }}>App Screens</p>
            <div className="space-y-1.5">
              {screens.map((s, i) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveScreen(s.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeScreen === s.id
                        ? 'bg-[#0D1B4B] text-white shadow-md'
                        : 'bg-white border border-gray-100 text-gray-500 hover:border-[#FF9933]/30 hover:text-[#FF9933]'
                    }`}
                  >
                    <Icon size={16} />
                    <div>
                      <span className="text-xs block" style={{ fontWeight: 600 }}>Screen {i + 1}</span>
                      <span className="text-[10px] opacity-60">{s.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-[#FFF8F0] rounded-2xl border border-[#FF9933]/20">
              <p className="text-[#FF9933] text-xs mb-2" style={{ fontWeight: 600 }}>🤖 Android App</p>
              <p className="text-gray-500 text-xs leading-relaxed">Built with Java/Kotlin in Android Studio. Supports Android 5.0+. Features QR scanning with ZXing library.</p>
            </div>
          </div>

          {/* Phone Frame */}
          <div className="flex-1 flex flex-col items-center">
            {/* Nav arrows */}
            <div className="flex items-center gap-4 mb-5">
              <button
                onClick={() => setActiveScreen(screens[Math.max(0, currentIdx - 1)].id)}
                disabled={currentIdx === 0}
                className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#FF9933]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-gray-400" style={{ fontWeight: 500 }}>
                {screens[currentIdx].label} ({currentIdx + 1}/{screens.length})
              </span>
              <button
                onClick={() => setActiveScreen(screens[Math.min(screens.length - 1, currentIdx + 1)].id)}
                disabled={currentIdx === screens.length - 1}
                className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#FF9933]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Phone mockup */}
            <div className="relative">
              {/* Phone outer frame */}
              <div className="w-[300px] bg-[#1a1a2e] rounded-[44px] p-3 shadow-2xl"
                style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05), inset 0 0 0 1px rgba(255,255,255,0.1)' }}>
                {/* Side buttons */}
                <div className="absolute -right-1.5 top-24 w-1.5 h-12 bg-[#2a2a3e] rounded-r-full" />
                <div className="absolute -left-1.5 top-20 w-1.5 h-8 bg-[#2a2a3e] rounded-l-full" />
                <div className="absolute -left-1.5 top-32 w-1.5 h-8 bg-[#2a2a3e] rounded-l-full" />

                {/* Screen bezel */}
                <div className="bg-black rounded-[36px] overflow-hidden">
                  {/* Notch */}
                  <div className="flex justify-center pt-2 pb-0.5 bg-black">
                    <div className="w-20 h-5 bg-black rounded-b-2xl flex items-center justify-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#333]" />
                      <div className="w-5 h-1.5 rounded-full bg-[#222]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#333]" />
                    </div>
                  </div>
                  {/* Status bar */}
                  <PhoneStatusBar />
                  {/* App Screen */}
                  <div className="h-[560px] flex flex-col overflow-hidden">
                    {screenComponents[activeScreen]}
                  </div>
                  {/* Home indicator */}
                  <div className="bg-[#0D1B4B] flex justify-center py-2">
                    <div className="w-24 h-1 bg-white/30 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Reflection */}
              <div className="absolute inset-0 rounded-[44px] bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
            </div>

            {/* Screen dots */}
            <div className="flex gap-2 mt-6">
              {screens.map(s => (
                <button key={s.id} onClick={() => setActiveScreen(s.id)}
                  className={`transition-all rounded-full ${activeScreen === s.id ? 'w-6 h-2 bg-[#FF9933]' : 'w-2 h-2 bg-gray-300'}`} />
              ))}
            </div>
          </div>

          {/* Screen info */}
          <div className="w-full xl:w-64 flex-shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3" style={{ fontWeight: 600 }}>Screen Details</p>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                {(() => {
                  const s = screens[currentIdx];
                  const Icon = s.icon;
                  return (
                    <>
                      <div className="w-8 h-8 rounded-xl bg-[#FF9933]/15 flex items-center justify-center">
                        <Icon size={15} className="text-[#FF9933]" />
                      </div>
                      <div>
                        <p className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{s.label}</p>
                        <p className="text-gray-400 text-xs">Screen {currentIdx + 1}</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {[
                { screen: 'welcome', desc: 'App introduction with Census branding, Digital India tagline, and Government of India identity. Full-screen onboarding.', features: ['App branding', 'India tricolor', 'Ashoka Chakra', 'Get Started CTA'] },
                { screen: 'login', desc: 'Secure login with Employee ID and password. OTP verification via SMS for added security.', features: ['Employee ID login', 'OTP verification', 'Password toggle', 'Secure session'] },
                { screen: 'home', desc: 'Dashboard showing enumerator stats, quick action buttons, and today\'s progress.', features: ['Personal stats', 'Quick actions', 'Progress tracker', 'Bottom navigation'] },
                { screen: 'scanner', desc: 'Live camera QR code scanner using ZXing library. Instantly fetches citizen details on scan.', features: ['Camera integration', 'ZXing QR scanner', 'Real-time detection', 'Citizen data fetch'] },
                { screen: 'form', desc: '7-step mobile-optimized census form with large inputs and clear navigation.', features: ['7-step wizard', 'Large touch targets', 'Progress indicator', 'Auto-save'] },
                { screen: 'confirm', desc: 'Review all entered data, capture digital signature, and submit to central database.', features: ['Data review', 'Digital signature', 'Final submission', 'Real-time sync'] },
              ].find(x => x.screen === activeScreen) && (() => {
                const info = [
                  { screen: 'welcome', desc: 'App introduction with Census branding and Government of India identity.', features: ['App branding', 'India tricolor', 'Ashoka Chakra', 'Get Started CTA'] },
                  { screen: 'login', desc: 'Secure login with Employee ID + OTP verification via SMS.', features: ['Employee ID login', 'OTP verification', 'Password toggle', 'Secure session'] },
                  { screen: 'home', desc: 'Dashboard showing enumerator stats, quick actions, and today\'s progress.', features: ['Personal stats', 'Quick actions', 'Progress tracker', 'Bottom nav'] },
                  { screen: 'scanner', desc: 'Live QR scanner using ZXing. Instantly fetches citizen data on scan.', features: ['Camera integration', 'ZXing QR scanner', 'Real-time detection', 'Data fetch'] },
                  { screen: 'form', desc: '7-step mobile census form with large inputs and clear navigation.', features: ['7-step wizard', 'Large touch targets', 'Progress bar', 'Auto-save'] },
                  { screen: 'confirm', desc: 'Review data, capture digital signature, and submit to database.', features: ['Data review', 'Digital signature', 'Final submit', 'Real-time sync'] },
                ].find(x => x.screen === activeScreen);
                if (!info) return null;
                return (
                  <>
                    <p className="text-gray-500 text-xs leading-relaxed mb-4">{info.desc}</p>
                    <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>Features</p>
                    <div className="space-y-1.5">
                      {info.features.map(f => (
                        <div key={f} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FF9933]" />
                          <span className="text-gray-500 text-xs">{f}</span>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Tech stack */}
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-gray-700 text-xs mb-3" style={{ fontWeight: 600 }}>Tech Stack</p>
              {[
                ['Language', 'Java / Kotlin'],
                ['IDE', 'Android Studio'],
                ['QR Scan', 'ZXing Library'],
                ['Min SDK', 'Android 5.0+'],
                ['Auth', 'JWT + OTP'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400 text-xs">{k}</span>
                  <span className="text-gray-600 text-xs" style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
