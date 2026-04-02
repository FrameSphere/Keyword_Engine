import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ analyses: 0, profiles: 0, keywords: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.history.list(5, 0),
      api.profiles.list(),
    ]).then(([hist, prof]) => {
      setRecent(hist.analyses || []);
      setStats({
        analyses: hist.total || 0,
        profiles: prof.profiles?.length || 0,
        keywords: (hist.analyses || []).reduce((s, a) => s + (a.keywords?.length || 0), 0),
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Analyses', value: stats.analyses, icon: '⬡', color: 'blue' },
    { label: 'Active Profiles', value: stats.profiles, icon: '◈', color: 'violet' },
    { label: 'Plan', value: user?.plan?.toUpperCase(), icon: '✦', color: 'magenta' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back, {user?.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="card">
            <p className="text-xs text-slate-500 mb-2">{c.label}</p>
            <p className="text-2xl font-bold text-white">{loading ? '—' : c.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Link to="/app/analyze" className="card-glow hover:border-blue-500/30 transition-all group block">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl text-blue-400 group-hover:bg-blue-500/20 transition-all">
              ⬡
            </div>
            <div>
              <p className="font-semibold text-white">New Analysis</p>
              <p className="text-xs text-slate-500">Extract keywords from any text</p>
            </div>
            <svg className="w-4 h-4 text-slate-600 ml-auto group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </Link>

        <Link to="/app/profiles" className="card hover:border-white/[0.15] transition-all group block">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xl text-violet-400 group-hover:bg-violet-500/20 transition-all">
              ◈
            </div>
            <div>
              <p className="font-semibold text-white">Manage Profiles</p>
              <p className="text-xs text-slate-500">Train and tune your keyword profiles</p>
            </div>
            <svg className="w-4 h-4 text-slate-600 ml-auto group-hover:text-violet-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </Link>

        <Link to="/docs" className="card hover:border-white/[0.15] transition-all group block">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
              📚
            </div>
            <div>
              <p className="font-semibold text-white">Documentation</p>
              <p className="text-xs text-slate-500">API-Referenz, Quickstart & Algorithmus</p>
            </div>
            <svg className="w-4 h-4 text-slate-600 ml-auto group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </Link>
      </div>

      {/* Recent analyses */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white text-sm">Recent Analyses</h2>
          <Link to="/app/history" className="text-xs text-blue-400 hover:text-blue-300">View all →</Link>
        </div>
        {loading && <div className="h-20 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>}
        {!loading && recent.length === 0 && (
          <p className="text-sm text-slate-600 text-center py-6">
            No analyses yet. <Link to="/app/analyze" className="text-blue-400">Start your first →</Link>
          </p>
        )}
        {!loading && recent.map(a => (
          <div key={a.id} className="flex items-start gap-3 py-3 border-t border-white/[0.05]">
            <div className={`mt-0.5 w-6 h-6 rounded flex items-center justify-center text-xs ${
              a.mode === 'ai' ? 'bg-fuchsia-500/10 text-fuchsia-400' : 'bg-blue-500/10 text-blue-400'
            }`}>
              {a.mode === 'ai' ? '✦' : '⬡'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{a.input_title || '(no title)'}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {a.keywords?.length} keywords · {a.longtail?.length} longtail · {a.language?.toUpperCase()}
              </p>
            </div>
            <p className="text-xs text-slate-600 whitespace-nowrap">
              {new Date(a.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
