import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import OAuthButtons from '../components/OAuthButtons.jsx';

// Store provider before redirect so callback knows which one was used
function startOAuth(provider) {
  sessionStorage.setItem('oauth_provider', provider);
}

function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full opacity-15"
             style={{ background: 'radial-gradient(ellipse, #2563EB 0%, transparent 70%)' }} />
      </div>
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold">
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
            <span className="font-bold text-xl text-white tracking-tight">Key<span className="gradient-text">Scope</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-1">{title}</h1>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="card">{children}</div>
      </div>
    </div>
  );
}

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/app');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your KeyScope account">
      <OAuthButtons label="Sign in" />
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {error}
          </div>
        )}
        <div>
          <label className="label">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                 className="input" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                 className="input" placeholder="••••••••" required />
        </div>
        <button type="submit" disabled={loading}
                className="btn-primary w-full justify-center py-3 mt-2">
          {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> : 'Sign in'}
        </button>
      </form>
      <p className="text-center text-sm text-slate-500 mt-5">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">Sign up free</Link>
      </p>
    </AuthShell>
  );
}
