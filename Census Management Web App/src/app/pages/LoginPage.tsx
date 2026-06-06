import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

const DEMO_CREDENTIALS = [
  { role: 'Admin',      id: 'EMP00001', pass: 'Admin@123', color: '#0D1B4B', desc: 'Full access' },
  { role: 'Supervisor', id: 'SUP00001', pass: 'Super@123', color: '#7C3AED', desc: 'Zone access' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { login, staffRegistry } = useAuth();

  const [userId,   setUserId]   = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [stats, setStats] = useState([
    { value: '...', label: 'Citizens' },
    { value: '...', label: 'States' },
    { value: '...', label: 'Surveys' },
  ]);

  useEffect(() => {
    fetch('http://localhost/jansankhya-api/stats/summary.php')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStats([
            { value: data.citizens + '+', label: 'Citizens' },
            { value: data.states + '', label: 'States' },
            { value: data.census_records + '', label: 'Surveys' },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !password) {
      setError('Please enter both User ID and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const success = await login(userId.trim(), password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid User ID or password. Please try again.');
      }
    } catch {
      setError('Connection error. Make sure Apache & MySQL are running.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (id: string, pass: string) => {
    setUserId(id);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative overflow-hidden flex-col items-center justify-center">

        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/login_bg_1.jpg')" }} />
        <div className="absolute inset-0 bg-[#0D1B4B]/70" />

        <div className="absolute top-0 left-0 right-0 flex h-1.5 z-20">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-10 max-w-md">
          <h1 className="text-5xl mb-2 font-bold drop-shadow-lg">
            <span className="text-white">Jan</span><span className="text-[#FF9933]">Sankhya</span>
          </h1>

          <div className="flex gap-1 my-5 items-center">
            <div className="h-1 w-12 rounded-full bg-[#FF9933]" />
            <div className="h-1 w-6 rounded-full bg-white/70" />
            <div className="h-1 w-12 rounded-full bg-[#138808]" />
          </div>

          <p className="text-white/80 text-sm mb-1 drop-shadow">Census Management System</p>
          <p className="text-white/60 text-xs mb-10 drop-shadow">Digital India · QR-based Citizen Identification</p>

          <div className="grid grid-cols-3 gap-3 w-full">
            {stats.map(({ value, label }) => (
              <div key={label} className="bg-black/30 backdrop-blur border border-white/20 rounded-2xl py-4 px-3">
                <p className="text-white text-xl font-bold">{value}</p>
                <p className="text-white/60 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 z-10 text-white/30 text-xs">
          Utsav Patel · Nirma University
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 sm:px-12 lg:px-16 xl:px-20 py-8">
        <div className="w-full max-w-sm">

          <div className="mb-6">
            <p className="text-[#FF9933] text-xs uppercase tracking-[0.2em] mb-2 font-semibold">Government of India</p>
            <h2 className="text-[#0D1B4B] mb-1 text-3xl font-bold">Welcome back</h2>
            <p className="text-gray-400 text-sm">Sign in to your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-semibold">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                placeholder="Enter Admin or Supervisor ID"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/15"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-semibold">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/15"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Login</p>
              {[
                ...DEMO_CREDENTIALS,
                ...staffRegistry
                  .filter(s => s.role === 'supervisor' && !DEMO_CREDENTIALS.find(d => d.id === s.id))
                  .map(s => ({ role: 'Supervisor', id: s.id, pass: s.password, color: '#7C3AED', desc: s.area || 'Zone access' }))
              ].map(c => (
                <button key={c.id} type="button" onClick={() => fillDemo(c.id, c.pass)}
                  className="w-full p-3 rounded-xl border border-gray-100 text-left flex items-center gap-3 bg-gray-50 hover:bg-white transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: c.color }}>
                    {c.role[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">
                      {c.role}<span className="ml-2 text-gray-400 font-normal">· {c.desc}</span>
                    </p>
                    <p className="text-xs text-gray-400 font-mono">{c.id} / {c.pass}</p>
                  </div>
                </button>
              ))}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#0D1B4B] text-white text-sm flex items-center justify-center gap-2 hover:bg-[#162254] transition-all disabled:opacity-60">
              {loading ? 'Signing in…' : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}