import { useState, useEffect } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

// ── Keyword Result Display ────────────────────────────────────
function ResultPanel({ result, onCopy }) {
  const [copied, setCopied] = useState('');
  const copyTo = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  if (!result) return null;

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Keywords */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white text-sm">Keywords</h3>
            <p className="text-xs text-slate-500">{result.keywords?.length} results</p>
          </div>
          <button onClick={() => copyTo(result.keywords?.join(', '), 'kw')}
                  className="btn-ghost text-xs">
            {copied === 'kw' ? '✓ Copied' : 'Copy all'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.keywords?.map((kw, i) => (
            <span key={i} onClick={() => copyTo(kw, kw)}
                  className="kw-chip cursor-pointer select-none"
                  title="Click to copy">
              <span className="text-xs text-blue-600 font-mono">{i+1}</span>
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Longtail */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white text-sm">Longtail Keywords</h3>
            <p className="text-xs text-slate-500">{result.longtailKeywords?.length} phrases</p>
          </div>
          <button onClick={() => copyTo(result.longtailKeywords?.join('\n'), 'lt')}
                  className="btn-ghost text-xs">
            {copied === 'lt' ? '✓ Copied' : 'Copy all'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.longtailKeywords?.map((lt, i) => (
            <span key={i} onClick={() => copyTo(lt, lt)} className="lt-chip cursor-pointer" title="Click to copy">
              {lt}
            </span>
          ))}
        </div>
      </div>

      {/* Meta Description */}
      {result.metaDescription && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white text-sm">Meta Description</h3>
            <span className={`text-xs font-mono ${result.metaDescription.length > 155 ? 'text-yellow-400' : 'text-emerald-400'}`}>
              {result.metaDescription.length}/160
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-violet-500/40 pl-3">
            "{result.metaDescription}"
          </p>
          <button onClick={() => copyTo(result.metaDescription, 'meta')}
                  className="btn-ghost text-xs mt-3">
            {copied === 'meta' ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      )}

      {/* Mode badge */}
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <span>Analyzed with</span>
        <span className={result.mode === 'ai' ? 'badge-magenta' : 'badge-blue'}>
          {result.mode === 'ai' ? '✦ AI Model' : '⬡ Algorithm'}
        </span>
        {result.profile_id && <span className="badge-gray">Profile active</span>}
      </div>
    </div>
  );
}

// ── Main Analyzer Page ────────────────────────────────────────
export default function Analyzer() {
  const { user } = useAuth();

  const [title,      setTitle]      = useState('');
  const [content,    setContent]    = useState('');
  const [lang,       setLang]       = useState('de');
  const [profileId,  setProfileId]  = useState('');
  const [mode,       setMode]       = useState('algorithmic');
  const [kwCount,    setKwCount]    = useState(10);
  const [ltCount,    setLtCount]    = useState(10);

  const [profiles,   setProfiles]   = useState([]);
  const [result,     setResult]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  useEffect(() => {
    api.profiles.list().then(d => setProfiles(d.profiles || [])).catch(() => {});
  }, []);

  const handleAnalyze = async () => {
    if (!content.trim() || content.trim().length < 50) {
      setError('Please enter at least 50 characters of content.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.analyze({
        title, content, lang,
        profile_id:     profileId || null,
        mode,
        keyword_count:  kwCount,
        longtail_count: ltCount,
      });
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const charCount = content.length;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analyzer</h1>
        <p className="text-sm text-slate-500 mt-1">Extract keywords and longtail phrases from any text</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* ── Left: Input ───────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Title */}
          <div>
            <label className="label">Title (optional but recommended)</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                   className="input" placeholder="Your article or page title..." />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">Content</label>
              <span className={`text-xs font-mono ${charCount < 50 ? 'text-red-400' : 'text-slate-500'}`}>
                {charCount} chars
              </span>
            </div>
            <textarea value={content} onChange={e => setContent(e.target.value)}
                      className="textarea min-h-[220px]"
                      placeholder="Paste your article, product description, or any text here..." />
          </div>

          {/* Options row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
              <label className="label">Profile</label>
              <select value={profileId} onChange={e => setProfileId(e.target.value)} className="input">
                <option value="">No profile</option>
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Keywords</label>
              <input type="number" min={1} max={50} value={kwCount}
                     onChange={e => setKwCount(Number(e.target.value))} className="input" />
            </div>
            <div>
              <label className="label">Longtail</label>
              <input type="number" min={1} max={50} value={ltCount}
                     onChange={e => setLtCount(Number(e.target.value))} className="input" />
            </div>
          </div>

          {/* Mode */}
          <div>
            <label className="label">Extraction Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setMode('algorithmic')}
                      className={`p-3 rounded-xl border text-sm text-left transition-all ${
                        mode === 'algorithmic'
                          ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                          : 'bg-white/[0.04] border-white/[0.07] text-slate-400 hover:border-white/20'
                      }`}>
                <div className="font-semibold mb-0.5">⬡ Algorithmic</div>
                <div className="text-xs opacity-70">TF-IDF · Free</div>
              </button>
              <button onClick={() => user?.plan === 'pro' ? setMode('ai') : null}
                      className={`p-3 rounded-xl border text-sm text-left transition-all relative ${
                        mode === 'ai'
                          ? 'bg-fuchsia-500/15 border-fuchsia-500/40 text-fuchsia-300'
                          : 'bg-white/[0.04] border-white/[0.07] text-slate-400'
                      } ${user?.plan !== 'pro' ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/20 cursor-pointer'}`}>
                <div className="font-semibold mb-0.5">✦ AI Model</div>
                <div className="text-xs opacity-70">HuggingFace · Pro only</div>
                {user?.plan !== 'pro' && (
                  <span className="absolute top-2 right-2 badge-magenta text-[9px]">PRO</span>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}

          <button onClick={handleAnalyze} disabled={loading}
                  className="btn-primary w-full justify-center py-3 text-base shadow-glow-blue">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Analyzing...</>
              : <>⬡ Analyze Keywords</>}
          </button>
        </div>

        {/* ── Right: Result ─────────────────────────────────── */}
        <div className="lg:col-span-2">
          {loading && (
            <div className="card flex items-center justify-center h-48 animate-pulse-slow">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-500">Processing text...</p>
              </div>
            </div>
          )}
          {!loading && result && <ResultPanel result={result} />}
          {!loading && !result && (
            <div className="card flex items-center justify-center h-48 text-center">
              <div>
                <div className="text-3xl mb-3 opacity-20">⬡</div>
                <p className="text-sm text-slate-600">Results will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
