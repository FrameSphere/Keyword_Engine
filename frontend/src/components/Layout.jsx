import { Link, NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useState, useEffect } from 'react';

// ── Canonical URL ─────────────────────────────────────────
const SITE = 'https://keyscope.pages.dev';
function useCanonical() {
  const { pathname } = useLocation();
  useEffect(() => {
    const canonical = pathname === '/' ? SITE + '/' : SITE + pathname;
    let tag = document.querySelector('link[rel="canonical"]');
    if (!tag) {
      tag = document.createElement('link');
      tag.setAttribute('rel', 'canonical');
      document.head.appendChild(tag);
    }
    tag.setAttribute('href', canonical);
  }, [pathname]);
}

// ── Logo ─────────────────────────────────────────────────────
function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="a" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2563EB"/>
              <stop offset="100%" stop-color="#7C3AED"/>
            </linearGradient>
            <linearGradient id="b" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#D946EF"/>
              <stop offset="100%" stop-color="#7C3AED"/>
            </linearGradient>
          </defs>
          <rect width="64" height="64" rx="14" fill="url(#a)"/>
          <circle cx="26" cy="32" r="12" stroke="white" stroke-width="3.5" fill="none" opacity="0.95"/>
          <circle cx="26" cy="32" r="4" fill="url(#b)" opacity="0.9"/>
          <line x1="35" y1="32" x2="52" y2="32" stroke="white" stroke-width="3" stroke-linecap="round" opacity="0.9"/>
          <line x1="44" y1="32" x2="44" y2="38" stroke="white" stroke-width="3" stroke-linecap="round" opacity="0.9"/>
          <line x1="49" y1="32" x2="49" y2="36" stroke="white" stroke-width="3" stroke-linecap="round" opacity="0.9"/>
        </svg>
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
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Legal</p>
            <nav className="space-y-2">
              <Link to="/privacy" className="block text-sm text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms"   className="block text-sm text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/legal"   className="block text-sm text-slate-500 hover:text-white transition-colors">Legal Notice</Link>
            </nav>
          </div>
        </div>
        <div className="border-t border-white/[0.06] pt-6 flex items-center justify-between">
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} KeyScope powered by 
            <a href="https://frame-sphere.vercel.app" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-blue-400"> FrameSphere </a>
             All rights reserved.</p>
          <span className="badge-blue text-[10px]">v1.0</span>
        </div>
      </div>
    </footer>
  );
}

// ── Layout Wrapper ────────────────────────────────────────────
export default function Layout({ children, app }) {
  useCanonical();

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
