import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';

// ── Logo ─────────────────────────────────────────────────────
function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm"
           style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
        KS
      </div>
      <span className="font-bold text-lg text-white tracking-tight">
        Key<span className="gradient-text">Scope</span>
      </span>
    </Link>
  );
}

// ── Public Header ─────────────────────────────────────────────
function PublicHeader() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]"
            style={{ background: 'rgba(11,15,26,0.85)', backdropFilter: 'blur(16px)' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/pricing" className={({isActive}) => isActive ? 'nav-link-active' : 'nav-link'}>Pricing</NavLink>
          <NavLink to="/docs"    className={({isActive}) => isActive ? 'nav-link-active' : 'nav-link'}>Docs</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link to="/app" className="btn-primary text-sm px-4 py-2">Dashboard</Link>
          ) : (
            <>
              <Link to="/login"    className="btn-ghost">Sign in</Link>
              <Link to="/register" className="btn-primary">Get Started Free</Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button onClick={() => setOpen(o => !o)}
                className="md:hidden p-2 text-slate-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2 border-t border-white/[0.06] pt-4">
          <Link to="/pricing" className="nav-link" onClick={() => setOpen(false)}>Pricing</Link>
          <Link to="/docs"    className="nav-link" onClick={() => setOpen(false)}>Docs</Link>
          {user
            ? <Link to="/app"      className="btn-primary mt-2 justify-center" onClick={() => setOpen(false)}>Dashboard</Link>
            : <Link to="/register" className="btn-primary mt-2 justify-center" onClick={() => setOpen(false)}>Get Started Free</Link>}
        </div>
      )}
    </header>
  );
}

// ── App Sidebar ───────────────────────────────────────────────
function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/app',          label: 'Dashboard', icon: '◈' },
    { to: '/app/analyze',  label: 'Analyzer',  icon: '⬡' },
    { to: '/app/profiles', label: 'Profiles',  icon: '⊞' },
    { to: '/app/history',  label: 'History',   icon: '◷' },
    { to: '/app/settings', label: 'Settings',  icon: '⚙' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 border-r border-white/[0.06] flex flex-col z-40"
           style={{ background: 'rgba(11,15,26,0.97)' }}>
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/[0.06]">
        <Logo />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/app'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-blue-500/15 text-blue-400 font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }>
            <span className="text-base leading-none">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 space-y-2">
        {user?.plan === 'free' && (
          <Link to="/pricing"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs
                       bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10
                       border border-violet-500/20 text-violet-300 hover:border-violet-500/40 transition-all">
            <span>✦</span> Upgrade to Pro
          </Link>
        )}
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-gradient-btn flex items-center justify-center text-xs font-bold text-white">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white truncate">{user?.email}</p>
            <p className="text-[10px] text-slate-500 capitalize">{user?.plan} plan</p>
          </div>
          <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors" title="Logout">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <Logo />
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              AI-powered keyword extraction for SEO professionals and content creators.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Product</p>
            <nav className="space-y-2">
              <Link to="/pricing" className="block text-sm text-slate-500 hover:text-white transition-colors">Pricing</Link>
              <Link to="/docs"    className="block text-sm text-slate-500 hover:text-white transition-colors">Docs</Link>
              <Link to="/docs/api" className="block text-sm text-slate-500 hover:text-white transition-colors">API</Link>
            </nav>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Resources</p>
            <nav className="space-y-2">
              <Link to="/docs/quickstart"  className="block text-sm text-slate-500 hover:text-white transition-colors">Quickstart</Link>
              <Link to="/docs/algorithm"   className="block text-sm text-slate-500 hover:text-white transition-colors">How it works</Link>
              <Link to="/docs/templates"   className="block text-sm text-slate-500 hover:text-white transition-colors">Templates</Link>
            </nav>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Company</p>
            <nav className="space-y-2">
              <a href="#" className="block text-sm text-slate-500 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="block text-sm text-slate-500 hover:text-white transition-colors">Terms</a>
            </nav>
          </div>
        </div>
        <div className="border-t border-white/[0.06] pt-6 flex items-center justify-between">
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} KeyScope powered by 
            <a href="https://frame-sphere.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">FrameSphere</a>
             All rights reserved.</p>
          <span className="badge-blue text-[10px]">v1.0</span>
        </div>
      </div>
    </footer>
  );
}

// ── Layout Wrapper ────────────────────────────────────────────
export default function Layout({ children, app }) {
  if (app) {
    return (
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 ml-56 min-h-screen">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
