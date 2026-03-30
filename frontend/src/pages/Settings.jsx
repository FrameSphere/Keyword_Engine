import { useState, useEffect } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Settings() {
  const { user } = useAuth();
  const [apiKey,    setApiKey]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [genLoading, setGenLoading] = useState(false);
  const [copied,    setCopied]    = useState(false);

  useEffect(() => {
    api.apikey.get().then(d => setApiKey(d.api_key)).finally(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    if (!confirm('This will invalidate your current API key. Continue?')) return;
    setGenLoading(true);
    try {
      const d = await api.apikey.generate();
      setApiKey(d.api_key);
    } finally {
      setGenLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!confirm('Revoke API key? All integrations using this key will stop working.')) return;
    await api.apikey.revoke();
    setApiKey(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account and API access</p>
      </div>

      {/* Account */}
      <div className="card mb-5">
        <h2 className="font-semibold text-white mb-4">Account</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/[0.05]">
            <p className="text-sm text-slate-400">Email</p>
            <p className="text-sm text-white">{user?.email}</p>
          </div>
          <div className="flex items-center justify-between py-2">
            <p className="text-sm text-slate-400">Plan</p>
            <span className={user?.plan === 'pro' ? 'badge-magenta' : 'badge-blue'}>
              {user?.plan?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* API Key */}
      <div className="card mb-5">
        <h2 className="font-semibold text-white mb-2">API Key</h2>
        <p className="text-xs text-slate-500 mb-4">
          Use this key to authenticate API requests. Keep it secret — it grants full access to your account.
        </p>

        {loading ? (
          <div className="h-10 flex items-center">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : apiKey ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-xs font-mono text-blue-300 truncate">
                {apiKey}
              </code>
              <button onClick={handleCopy} className="btn-secondary text-xs px-3 py-2 whitespace-nowrap">
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={handleGenerate} disabled={genLoading} className="btn-secondary text-xs">
                {genLoading ? 'Regenerating…' : 'Regenerate'}
              </button>
              <button onClick={handleRevoke} className="btn-danger text-xs">Revoke</button>
            </div>
          </div>
        ) : (
          <button onClick={handleGenerate} disabled={genLoading} className="btn-primary text-sm">
            {genLoading ? 'Generating…' : 'Generate API Key'}
          </button>
        )}
      </div>

      {/* API Usage */}
      <div className="card">
        <h2 className="font-semibold text-white mb-2">Rate Limits</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Analyses / day</span>
            <span className="text-white">{user?.plan === 'pro' ? '500' : '20'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Max profiles</span>
            <span className="text-white">{user?.plan === 'pro' ? '50' : '3'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Training documents</span>
            <span className="text-white">{user?.plan === 'pro' ? '200' : '20'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">AI mode</span>
            <span className={user?.plan === 'pro' ? 'text-emerald-400' : 'text-slate-600'}>
              {user?.plan === 'pro' ? 'Enabled' : 'Pro only'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
