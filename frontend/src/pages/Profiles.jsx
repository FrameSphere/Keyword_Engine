import { useState, useEffect } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

// ── Create Profile Modal ──────────────────────────────────────
function CreateModal({ onClose, onCreate }) {
  const [name,       setName]       = useState('');
  const [desc,       setDesc]       = useState('');
  const [lang,       setLang]       = useState('de');
  const [templateId, setTemplateId] = useState('');
  const [templates,  setTemplates]  = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  useEffect(() => { api.templates().then(setTemplates); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) { setError('Name is required'); return; }
    setLoading(true);
    try {
      const res = await api.profiles.create({ name, description: desc, language: lang, template_id: templateId || null });
      onCreate(res.profile);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white">New Profile</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-lg">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="px-3 py-2 rounded-lg bg-red-500/10 text-sm text-red-400">{error}</div>}
          <div>
            <label className="label">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="input" placeholder="e.g. My Blog DE" required />
          </div>
          <div>
            <label className="label">Description</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} className="input" placeholder="Optional..." />
          </div>
          <div>
            <label className="label">Language</label>
            <select value={lang} onChange={e => setLang(e.target.value)} className="input">
              <option value="de">🇩🇪 German</option>
              <option value="en">🇬🇧 English</option>
              <option value="fr">🇫🇷 French</option>
              <option value="es">🇪🇸 Spanish</option>
              <option value="it">🇮🇹 Italian</option>
            </select>
          </div>
          <div>
            <label className="label">Start from template (optional)</label>
            <select value={templateId} onChange={e => setTemplateId(e.target.value)} className="input">
              <option value="">Blank profile</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name} — {t.description}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Train Modal ───────────────────────────────────────────────
function TrainModal({ profile, onClose }) {
  const [texts,   setTexts]   = useState('');
  const [lang,    setLang]    = useState(profile.language || 'de');
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');

  const handleTrain = async () => {
    const docs = texts.split('\n---\n').map(t => t.trim()).filter(t => t.length > 20);
    if (docs.length === 0) { setError('Add at least one text (min. 20 chars)'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.weights.train(profile.id, docs, lang);
      setResult(res.stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-white">Train Profile</h2>
            <p className="text-xs text-slate-500 mt-0.5">{profile.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-lg">✕</button>
        </div>

        {!result ? (
          <>
            <p className="text-sm text-slate-400 mb-4">
              Paste your training texts below. Separate multiple texts with <code className="text-blue-400 bg-blue-500/10 px-1 rounded">---</code> on its own line.
            </p>
            <textarea value={texts} onChange={e => setTexts(e.target.value)}
                      className="textarea min-h-[200px] font-mono text-xs mb-4"
                      placeholder={"Your first training text...\n---\nYour second training text..."} />
            <div className="flex items-center gap-3 mb-4">
              <select value={lang} onChange={e => setLang(e.target.value)} className="input max-w-[160px]">
                <option value="de">🇩🇪 German</option>
                <option value="en">🇬🇧 English</option>
                <option value="fr">🇫🇷 French</option>
                <option value="es">🇪🇸 Spanish</option>
                <option value="it">🇮🇹 Italian</option>
              </select>
              <span className="text-xs text-slate-500">{texts.split('\n---\n').filter(t => t.trim().length > 20).length} document(s)</span>
            </div>
            {error && <div className="px-3 py-2 rounded-lg bg-red-500/10 text-sm text-red-400 mb-4">{error}</div>}
            <div className="flex gap-3">
              <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleTrain} disabled={loading} className="btn-primary flex-1 justify-center">
                {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Training...</> : '⬡ Train Algorithm'}
              </button>
            </div>
          </>
        ) : (
          <div className="animate-slide-up">
            <div className="card bg-emerald-500/5 border-emerald-500/20 mb-4">
              <p className="text-emerald-400 font-semibold mb-3">✓ Training complete!</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="text-xl font-bold text-white">{result.documentsProcessed}</p><p className="text-xs text-slate-500">Documents</p></div>
                <div><p className="text-xl font-bold text-white">{result.uniqueWords}</p><p className="text-xs text-slate-500">Word weights</p></div>
                <div><p className="text-xl font-bold text-white">{result.topWords?.length}</p><p className="text-xs text-slate-500">Top words</p></div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-2">Top weighted words:</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {result.topWords?.map(w => (
                <span key={w.word} className="kw-chip text-xs">
                  {w.word} <span className="text-blue-600">{w.score}</span>
                </span>
              ))}
            </div>
            <button onClick={onClose} className="btn-primary w-full justify-center">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Profiles Page ────────────────────────────────────────
export default function Profiles() {
  const { user }  = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [trainProfile, setTrainProfile] = useState(null);

  const load = () => {
    setLoading(true);
    api.profiles.list().then(d => setProfiles(d.profiles || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this profile?')) return;
    await api.profiles.delete(id).catch(() => {});
    setProfiles(p => p.filter(x => x.id !== id));
  };

  const maxProfiles = user?.plan === 'pro' ? 50 : 3;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Profiles</h1>
          <p className="text-sm text-slate-500 mt-1">{profiles.length} / {maxProfiles} profiles</p>
        </div>
        <button onClick={() => setShowCreate(true)}
                className="btn-primary"
                disabled={profiles.length >= maxProfiles}>
          + New Profile
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && profiles.length === 0 && (
        <div className="card text-center py-14">
          <div className="text-4xl mb-4 opacity-20">◈</div>
          <p className="text-white font-medium mb-2">No profiles yet</p>
          <p className="text-sm text-slate-500 mb-6">Create a profile to train the algorithm with your own texts</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary mx-auto">Create first profile</button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {profiles.map(p => (
          <div key={p.id} className="card hover:border-white/[0.12] transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-white">{p.name}</h3>
                {p.description && <p className="text-xs text-slate-500 mt-0.5">{p.description}</p>}
              </div>
              <span className="badge-gray uppercase">{p.language}</span>
            </div>
            {p.template_id && (
              <p className="text-xs text-slate-600 mb-3">Template: {p.template_id}</p>
            )}
            <p className="text-xs text-slate-600 mb-4">
              Created {new Date(p.created_at).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setTrainProfile(p)} className="btn-secondary text-xs px-3 py-1.5 flex-1 justify-center">
                ⬡ Train
              </button>
              <button onClick={() => handleDelete(p.id)} className="btn-danger text-xs px-3 py-1.5">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreate={p => setProfiles(prev => [p, ...prev])}
        />
      )}
      {trainProfile && (
        <TrainModal profile={trainProfile} onClose={() => { setTrainProfile(null); load(); }} />
      )}
    </div>
  );
}
