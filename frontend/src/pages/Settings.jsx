import { useState, useEffect } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

// ── Upgrade Modal ─────────────────────────────────────────────
function UpgradeModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');
    try {
      await api.account.upgrade();
      onSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const PRO_FEATURES = [
    { icon: '⬡', label: '500 Analysen / Tag', sub: 'statt 20' },
    { icon: '◈', label: '50 Profile', sub: 'statt 3' },
    { icon: '📄', label: '200 Training-Dokumente', sub: 'statt 20' },
    { icon: '✦', label: 'AI-Modus', sub: 'HuggingFace-Modelle' },
    { icon: '⚡', label: 'Priorität-Support', sub: 'schnellere Antworten' },
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
            <h2 className="text-xl font-bold text-white mt-2">Upgrade auf Pro</h2>
            <p className="text-sm text-slate-400 mt-1">
              Schalte alle Features frei und analysiere ohne Limits.
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
            €9<span className="text-base font-normal text-slate-400">/Monat</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Jederzeit kündbar · Keine Mindestlaufzeit</p>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 text-sm text-red-400">{error}</div>
        )}

        {/* Note: Demo-Upgrade */}
        <div className="mb-4 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
          ⚠ Demo-Modus: Dieses Upgrade ist kostenlos und aktiviert Pro direkt. Payment-Integration (Stripe) folgt.
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center" disabled={loading}>
            Abbrechen
          </button>
          <button onClick={handleUpgrade} disabled={loading} className="flex-1 justify-center
            inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
            bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white
            hover:from-fuchsia-500 hover:to-violet-500 transition-all shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Upgrading…</>
              : '✦ Jetzt upgraden'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Downgrade Confirm ─────────────────────────────────────────
function DowngradeModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleDowngrade = async () => {
    setLoading(true);
    setError('');
    try {
      await api.account.downgrade();
      onSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <div className="card w-full max-w-sm animate-slide-up">
        <h2 className="font-bold text-white mb-2">Auf Free downgraden?</h2>
        <p className="text-sm text-slate-400 mb-5">
          Du verlierst den Zugang zu AI-Modus, mehr als 3 Profile und erhöhte Limits.
        </p>
        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 text-sm text-red-400">{error}</div>
        )}
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center" disabled={loading}>Abbrechen</button>
          <button onClick={handleDowngrade} disabled={loading} className="btn-danger flex-1 justify-center">
            {loading ? 'Downgrading…' : 'Downgraden'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Settings Page ────────────────────────────────────────
export default function Settings() {
  const { user, refreshUser } = useAuth();
  const [apiKey,      setApiKey]      = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [genLoading,  setGenLoading]  = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [showUpgrade,   setShowUpgrade]   = useState(false);
  const [showDowngrade, setShowDowngrade] = useState(false);
  const [planMsg,     setPlanMsg]     = useState('');

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

  const onUpgradeSuccess = async () => {
    await refreshUser();
    setShowUpgrade(false);
    setPlanMsg('✓ Pro aktiviert! Alle Features sind jetzt freigeschaltet.');
    setTimeout(() => setPlanMsg(''), 5000);
  };

  const onDowngradeSuccess = async () => {
    await refreshUser();
    setShowDowngrade(false);
    setPlanMsg('Plan auf Free zurückgesetzt.');
    setTimeout(() => setPlanMsg(''), 5000);
  };

  const isPro = user?.plan === 'pro';

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Konto & API-Zugang verwalten</p>
      </div>

      {/* Plan message */}
      {planMsg && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">
          {planMsg}
        </div>
      )}

      {/* Account + Plan */}
      <div className="card mb-5">
        <h2 className="font-semibold text-white mb-4">Konto</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/[0.05]">
            <p className="text-sm text-slate-400">E-Mail</p>
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
                  ✦ Upgrade auf Pro
                </button>
              )}
              {isPro && (
                <button
                  onClick={() => setShowDowngrade(true)}
                  className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
                >
                  Downgraden
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pro Feature Overview */}
      {!isPro && (
        <div className="card mb-5 border-fuchsia-500/20 bg-fuchsia-500/[0.03]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white">Pro-Features</h2>
            <span className="badge-magenta text-xs">PRO</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-fuchsia-500">✓</span> 500 Analysen/Tag
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-fuchsia-500">✓</span> 50 Profile
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-fuchsia-500">✓</span> AI-Modus (HuggingFace)
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-fuchsia-500">✓</span> 200 Training-Docs
            </div>
          </div>
          <button
            onClick={() => setShowUpgrade(true)}
            className="w-full py-2.5 rounded-xl text-sm font-semibold justify-center
              bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white
              hover:from-fuchsia-500 hover:to-violet-500 transition-all flex items-center gap-2"
          >
            ✦ Jetzt upgraden – €9/Monat
          </button>
        </div>
      )}

      {/* API Key */}
      <div className="card mb-5">
        <h2 className="font-semibold text-white mb-2">API Key</h2>
        <p className="text-xs text-slate-500 mb-4">
          Für direkte API-Requests. Halte ihn geheim – er gewährt vollen Zugriff auf dein Konto.
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
                {copied ? '✓ Kopiert' : 'Kopieren'}
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={handleGenerate} disabled={genLoading} className="btn-secondary text-xs">
                {genLoading ? 'Regenerating…' : 'Neu generieren'}
              </button>
              <button onClick={handleRevoke} className="btn-danger text-xs">Widerrufen</button>
            </div>
          </div>
        ) : (
          <button onClick={handleGenerate} disabled={genLoading} className="btn-primary text-sm">
            {genLoading ? 'Generiere…' : 'API Key generieren'}
          </button>
        )}
      </div>

      {/* Rate Limits */}
      <div className="card">
        <h2 className="font-semibold text-white mb-3">Limits & Kontingente</h2>
        <div className="space-y-2 text-sm">
          {[
            ['Analysen / Tag',       isPro ? '500' : '20'],
            ['Max. Profile',         isPro ? '50' : '3'],
            ['Training-Dokumente',   isPro ? '200' : '20'],
            ['AI-Modus',             isPro ? '✓ Aktiv' : '✗ Pro only'],
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

      {/* Modals */}
      {showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} onSuccess={onUpgradeSuccess} />
      )}
      {showDowngrade && (
        <DowngradeModal onClose={() => setShowDowngrade(false)} onSuccess={onDowngradeSuccess} />
      )}
    </div>
  );
}
