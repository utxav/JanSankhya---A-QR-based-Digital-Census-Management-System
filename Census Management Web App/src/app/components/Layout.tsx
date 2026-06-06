import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard, Users, UserPlus, ClipboardList, BadgeCheck, Shield,
  BarChart3, CreditCard, Settings, ChevronLeft,
  ChevronRight, LogOut, Bell, Search, Menu, MapPin, Database
} from 'lucide-react';
// ── FIX: AuthContext exports UserRole, not Role ───────────────────────────────
import { useAuth, UserRole } from '../Context/AuthContext';

// Pages each role can see
const NAV_BY_ROLE: Record<UserRole, { path: string; icon: any; label: string; section: string }[]> = {
  admin: [
    { path: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard',           section: 'Main' },
    { path: '/citizens',       icon: Users,           label: 'Citizens',             section: 'Main' },
    { path: '/register',       icon: UserPlus,        label: 'Register Citizen',     section: 'Main' },
    { path: '/register-staff', icon: Shield,          label: 'Register Supervisor',  section: 'Main' },
    { path: '/census-entry',   icon: ClipboardList,   label: 'Census Entry',         section: 'Main' },
    { path: '/enumerators',    icon: BadgeCheck,      label: 'Enumerators',          section: 'Main' },
    { path: '/supervisors',    icon: Shield,          label: 'Supervisors',          section: 'Main' },
    { path: '/uid-cards',      icon: CreditCard,      label: 'UID Cards',            section: 'Main' },
    { path: '/census-records', icon: ClipboardList, label: 'Census Records', section: 'Main' },
    { path: '/data-generator', icon: Database,        label: 'Data Generator',       section: 'Analytics' },
    { path: '/reports',        icon: BarChart3,       label: 'Reports & Export',     section: 'Analytics' },
    { path: '/billing',        icon: CreditCard,      label: 'Billing',              section: 'Analytics' },
    { path: '/settings',       icon: Settings,        label: 'Settings',             section: 'Account' },
  ],
  supervisor: [
    { path: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard',         section: 'Main' },
    { path: '/citizens',       icon: Users,           label: 'Citizens',          section: 'Main' },
    { path: '/census-entry',   icon: ClipboardList,   label: 'Census Entry',      section: 'Main' },
    { path: '/census-records', icon: ClipboardList, label: 'Census Records', section: 'Main' },
    { path: '/enumerators',    icon: BadgeCheck,      label: 'My Enumerators',    section: 'Main' },
    { path: '/register-staff', icon: UserPlus,        label: 'Add Enumerator',    section: 'Main' },
    { path: '/reports',        icon: BarChart3,       label: 'Reports',           section: 'Analytics' },
    { path: '/settings',       icon: Settings,        label: 'Settings',          section: 'Account' },
  ],
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin:      '#0D1B4B',
  supervisor: '#7C3AED',
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin:      'Administrator',
  supervisor: 'Supervisor',
};

const AshokaChakra = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.4"/>
    <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.6"/>
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 15 * Math.PI) / 180;
      const x1 = 50 + 10 * Math.cos(angle);
      const y1 = 50 + 10 * Math.sin(angle);
      const x2 = 50 + 42 * Math.cos(angle);
      const y2 = 50 + 42 * Math.sin(angle);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>;
    })}
  </svg>
);

export function Layout() {
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // ── FIX: cast to UserRole (not Role) ─────────────────────────────────────
  const role: UserRole    = (user?.role as UserRole) || 'admin';
  const navItems          = NAV_BY_ROLE[role];
  const roleColor         = ROLE_COLORS[role];

  const sections = navItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof navItems>);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Tricolor top bar */}
      <div className="flex h-1 flex-shrink-0">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-xl bg-[#FF9933]/20 border border-[#FF9933]/30 flex items-center justify-center flex-shrink-0 text-[#FF9933]">
          <div className="w-6 h-6"><AshokaChakra /></div>
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Census Portal</p>
            <p className="text-white/50 text-xs capitalize">{ROLE_LABELS[role]}</p>
          </div>
        )}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-xl border flex items-center gap-2"
          style={{ background: `${roleColor}20`, borderColor: `${roleColor}40` }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: roleColor }} />
          <span className="text-xs font-semibold" style={{ color: roleColor }}>{ROLE_LABELS[role]}</span>
          {user?.area && (
            <span className="ml-auto text-white/40 text-xs flex items-center gap-1">
              <MapPin size={10} /> {user.area.split(',')[0]}
            </span>
          )}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {Object.entries(sections).map(([section, items]) => (
          <div key={section}>
            {!collapsed && (
              <p className="text-white/30 text-xs uppercase tracking-widest px-3 mb-2 mt-3">{section}</p>
            )}
            {items.map(({ path, icon: Icon, label }) => (
              <NavLink key={path} to={path} onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'text-white/60 hover:bg-white/8 hover:text-white'
                  } ${collapsed ? 'justify-center' : ''}`
                }
                style={({ isActive }) => isActive ? { background: roleColor, boxShadow: `0 4px 12px ${roleColor}40` } : {}}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`} />
                    {!collapsed && <span className="text-sm truncate">{label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className={`px-3 py-4 border-t border-white/10 ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          <button onClick={handleLogout}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <LogOut size={18} />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
              style={{ background: roleColor }}>
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-white/40 text-xs">{user?.id}</p>
            </div>
            <button onClick={handleLogout} className="text-white/40 hover:text-white transition-colors p-1" title="Logout">
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F6FA]" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0D1B4B] transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col flex-shrink-0 bg-[#0D1B4B] transition-all duration-300 relative ${collapsed ? 'w-[72px]' : 'w-[240px]'}`}>
        <SidebarContent />
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm z-10 hover:bg-gray-50 transition-colors">
          {collapsed ? <ChevronRight size={12} className="text-gray-500" /> : <ChevronLeft size={12} className="text-gray-500" />}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0 shadow-sm">
          <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search citizens, UIDs…"
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#F4F6FA] rounded-xl border border-transparent focus:border-[#FF9933]/40 focus:outline-none focus:bg-white transition-all" />
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative w-9 h-9 rounded-xl bg-[#F4F6FA] flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:text-[#FF9933] transition-all">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF9933] rounded-full" />
            </button>
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-semibold"
                style={{ background: roleColor }}>
                {user?.name?.[0] || 'U'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-800 leading-tight">{user?.name}</p>
                <p className="text-xs capitalize" style={{ color: roleColor }}>{ROLE_LABELS[role]}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}