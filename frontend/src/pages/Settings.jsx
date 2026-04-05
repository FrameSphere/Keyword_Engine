import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ProSuccessModal from '../components/ProSuccessModal.jsx';

// ── Upgrade Modal → leitet zu Stripe Checkout weiter ──────────
function UpgradeModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');
    try {
      const { url } = await api.stripe.checkout();
      window.location.href = url; // Weiterleitung zu Stripe
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  const PRO_FEATURES = [
    { icon: '⬡', label: '500 Analyses / Day',      sub: 'instead of 20' },
    { icon: '◈', label: '50 Profiles',               sub: 'instead of 3' },
    { icon: '📄', label: '200 Training Documents',  sub: 'instead of 20' },
    { icon: '✦', label: 'AI Mode',                 sub: 'HuggingFace Models' },
    { icon: '⚡', label: 'Priority Support',        sub: 'faster responses' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <div className="card w-full max-w-md animate-slide-up">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-magenta text-sm px-3 py-1">PRO</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2">Upgrade to Pro</h2>
            <p className="text-sm text-slate-400 mt-1">
              Unlock all features and analyze without limits.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-lg ml-4">✕</button>
        </div>

        {/* Feature list */}
        <div className="space-y-2 mb-6">
          {PRO_FEATURES.map(f => (
            <div key={f.label}
                 className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-lg w-6 text-center flex-shrink-0">{f.icon}</span>
              <div className="flex-1">
                <span className="text-sm text-white font-medium">{f.label}</span>
              </div>
              <span className="text-xs text-slate-500">{f.sub}</span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="text-center mb-5 py-4 rounded-2xl bg-fuchsia-500/5 border border-fuchsia-500/20">
          <p className="text-3xl font-bold text-white">
            €9<span className="text-base font-normal text-slate-400">/Month</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Cancelable at any time · No minimum commitment</p>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 text-sm text-red-400">{error}</div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center" disabled={loading}>
            Cancel
          </button>
          <button onClick={handleUpgrade} disabled={loading} className="flex-1 justify-center
            inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
            bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white
            hover:from-fuchsia-500 hover:to-violet-500 transition-all shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Redirecting…</>
              : '✦ Upgrade now → Stripe'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Billing-Portal-Button (für Pro-User: Abo verwalten/kündigen) ──
function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handlePortal = async () => {
    setLoading(true);
    setError('');
    try {
      const { url } = await api.stripe.portal();
      window.location.href = url;
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handlePortal}
        disabled={loading}
        className="text-xs px-3 py-1.5 rounded-lg font-medium btn-secondary disabled:opacity-50"
      >
        {loading ? 'Redirecting...' : '⚙️ Manage Subscription'}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ── Main Settings Page ────────────────────────────────────────
export default function Settings() {
  const { user, refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [apiKey,     setApiKey]     = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [genLoading, setGenLoading] = useState(false);
  const [copied,     setCopied]     = useState(false);
  const [showUpgrade,     setShowUpgrade]     = useState(false);
  const [showProSuccess,  setShowProSuccess]  = useState(false);
  const [planMsg,         setPlanMsg]         = useState('');

  // ?upgraded=1 nach Stripe-Redirect → Plan refreshen & Erfolgs-Modal zeigen
  useEffect(() => {
    if (searchParams.get('upgraded') === '1') {
      setSearchParams({}, { replace: true });
      refreshUser().then(() => setShowProSuccess(true));
    }
  }, []);

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

  const isPro = user?.plan === 'pro';

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage Account & API Access</p>
      </div>

      {/* Plan message */}
      {planMsg && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">
          {planMsg}
        </div>
      )}

      {/* Account + Plan */}
      <div className="card mb-5">
        <h2 className="font-semibold text-white mb-4">Account</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/[0.05]">
            <p className="text-sm text-slate-400">Email</p>
            <p className="text-sm text-white">{user?.email}</p>
          </div>
          <div className="flex items-center justify-between py-2">
            <p className="text-sm text-slate-400">Plan</p>
            <div className="flex items-center gap-3">
              <span className={isPro ? 'badge-magenta' : 'badge-blue'}>
                {user?.plan?.toUpperCase()}
              </span>
              {!isPro && (
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold
                    bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white
                    hover:from-fuchsia-500 hover:to-violet-500 transition-all"
                >
                  ✦ Upgrade to Pro
                </button>
              )}
              {isPro && <ManageBillingButton />}
            </div>
          </div>
        </div>
      </div>

      {/* Pro Feature Overview (nur für Free-User) */}
      {!isPro && (
        <div className="card mb-5 border-fuchsia-500/20 bg-fuchsia-500/[0.03]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white">Pro-Features</h2>
            <span className="badge-magenta text-xs">PRO</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-fuchsia-500">✓</span> 500 Analyses / Day
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-fuchsia-500">✓</span> 50 Profiles
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-fuchsia-500">✓</span> AI-Mode (HuggingFace)
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-fuchsia-500">✓</span> 200 Training-Documents
            </div>
          </div>
          <button
            onClick={() => setShowUpgrade(true)}
            className="w-full py-2.5 rounded-xl text-sm font-semibold justify-center
              bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white
              hover:from-fuchsia-500 hover:to-violet-500 transition-all flex items-center gap-2"
          >
            ✦ Upgrade now – €9/month
          </button>
        </div>
      )}

      {/* API Key */}
      <div className="card mb-5">
        <h2 className="font-semibold text-white mb-2">API Key</h2>
        <p className="text-xs text-slate-500 mb-4">
          For direct API requests. Keep it secret – it grants full access to your account.
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
                {genLoading ? 'Regenerating…' : 'Generate New'}
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

      {/* Rate Limits */}
      <div className="card">
        <h2 className="font-semibold text-white mb-3">Limits & quotas</h2>
        <div className="space-y-2 text-sm">
          {[
            ['Analyses / Day',       isPro ? '500' : '20'],
            ['Max. Profiles',         isPro ? '50'  : '3'],
            ['Training-Documents',   isPro ? '200' : '20'],
            ['AI-Mode',             isPro ? '✓ Active' : '✗ Pro only'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-1.5 border-b border-white/[0.04] last:border-0">
              <span className="text-slate-400">{label}</span>
              <span className={
                value.startsWith('✓') ? 'text-emerald-400' :
                value.startsWith('✗') ? 'text-slate-600' :
                'text-white'
              }>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} />
      )}

      {/* Pro-Success Modal nach Stripe-Redirect */}
      {showProSuccess && (
        <ProSuccessModal onClose={() => setShowProSuccess(false)} />
      )}
    </div>
  );
}
