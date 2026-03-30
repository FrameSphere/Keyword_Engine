import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                 style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>KL</div>
            <span className="font-bold text-xl text-white tracking-tight">Key<span className="gradient-text">Lens</span></span>
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
    <AuthShell title="Welcome back" subtitle="Sign in to your KeyLens account">
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
