import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

// ── Supported file extensions ─────────────────────────────────
const TEXT_EXTENSIONS = [
  'txt','md','html','htm','csv','json','js','jsx','ts','tsx',
  'py','php','rb','java','c','cpp','cs','go','rs','swift',
  'xml','yaml','yml','ini','toml','sql','sh','bash','log',
  'tex','rst','adoc','rtf',
];

function getExt(name) {
  return name.split('.').pop().toLowerCase();
}

function isTextFile(name) {
  return TEXT_EXTENSIONS.includes(getExt(name));
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = () => reject(new Error(`Cannot read ${file.name}`));
    reader.readAsText(file, 'UTF-8');
  });
}

async function collectFromEntry(entry, collected = []) {
  if (entry.isFile) {
    const file = await new Promise((res, rej) => entry.file(res, rej));
    if (isTextFile(file.name)) collected.push(file);
  } else if (entry.isDirectory) {
    const reader = entry.createReader();
    let batch;
    do {
      batch = await new Promise((res, rej) => reader.readEntries(res, rej));
      for (const child of batch) await collectFromEntry(child, collected);
    } while (batch.length > 0);
  }
  return collected;
}

// ── Score bar (for word weights) ──────────────────────────────
function ScoreBar({ score }) {
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500/60 rounded-full transition-all"
          style={{ width: `${Math.round(score * 100)}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-slate-600 w-10 text-right">
        {score.toFixed(3)}
      </span>
    </div>
  );
}

// ── Profile Detail Modal ──────────────────────────────────────
function ProfileDetailModal({ profile, onClose, onTrain, onDelete }) {
  const [words,    setWords]    = useState([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [offset,   setOffset]   = useState(0);
  const [searching, setSearching] = useState(false);
  const LIMIT = 200;

  const load = useCallback(async (q = '', off = 0) => {
    if (off === 0) setLoading(true);
    else setSearching(true);
    try {
      const res = await api.weights.get(profile.id, { limit: LIMIT, offset: off, q });
      setTotal(res.total ?? 0);
      if (off === 0) {
        setWords(res.words || []);
      } else {
        setWords(prev => [...prev, ...(res.words || [])]);
      }
    } catch {
      // no weights trained yet
      setWords([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [profile.id]);

  useEffect(() => { load('', 0); }, [load]);

  // Debounce search
  useEffect(() => {
    if (search === '') { load('', 0); setOffset(0); return; }
    const t = setTimeout(() => { load(search, 0); setOffset(0); }, 300);
    return () => clearTimeout(t);
  }, [search, load]);

  const loadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    load(search, newOffset);
  };

  const hasMore = words.length < total;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-2xl animate-slide-up flex flex-col"
           style={{ maxHeight: '90vh' }}>

        {/* Header */}
        <div className="flex items-start justify-between mb-4 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white">{profile.name}</h2>
              {profile.is_system && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20">
                  System
                </span>
              )}
              <span className="badge-gray uppercase">{profile.language}</span>
            </div>
            {profile.description && (
              <p className="text-xs text-slate-500 mt-0.5">{profile.description}</p>
            )}
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-lg flex-shrink-0 ml-4">✕</button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4 flex-shrink-0">
          <div className="card bg-white/[0.02] text-center py-3">
            <p className="text-xl font-bold text-white">{total.toLocaleString()}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Word Weights</p>
          </div>
          <div className="card bg-white/[0.02] text-center py-3">
            <p className="text-xl font-bold text-white uppercase">{profile.language}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Sprache</p>
          </div>
          <div className="card bg-white/[0.02] text-center py-3">
            <p className="text-xl font-bold text-white">
              {profile.created_at ? new Date(profile.created_at).toLocaleDateString('de') : '–'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Erstellt</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3 flex-shrink-0">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-8 text-sm"
            placeholder="Wort suchen…"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white text-sm"
            >✕</button>
          )}
        </div>

        {/* Word list */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-1">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : words.length === 0 ? (
            <div className="text-center py-10 text-slate-600">
              {total === 0
                ? 'Noch keine Gewichte – Profil trainieren!'
                : 'Kein Wort gefunden.'}
            </div>
          ) : (
            <>
              <div className="space-y-0.5">
                {words.map((w, i) => (
                  <div key={w.word} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-white/[0.03] group">
                    <span className="text-[10px] text-slate-700 w-6 text-right flex-shrink-0">{offset + i + 1}</span>
                    <span className="text-sm text-slate-200 w-32 flex-shrink-0 font-mono truncate">{w.word}</span>
                    <ScoreBar score={w.score} />
                    <div className="flex gap-3 text-[10px] text-slate-700 flex-shrink-0 opacity-0 group-hover:opacity-100">
                      <span title="Dokument-Frequenz">df:{w.doc_freq}</span>
                      <span title="Corpus-Frequenz">cf:{w.corpus_freq}</span>
                    </div>
                  </div>
                ))}
              </div>

              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={searching}
                  className="w-full mt-3 py-2 text-xs text-slate-500 hover:text-white border border-white/[0.07]
                             hover:border-white/[0.15] rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {searching
                    ? <><span className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin"/>Laden…</>
                    : `Weitere laden (${total - words.length} übrig)`}
                </button>
              )}
              <p className="text-center text-[11px] text-slate-700 mt-2 pb-2">
                {words.length} / {total.toLocaleString()} Wörter angezeigt
              </p>
            </>
          )}
        </div>

        {/* Footer actions */}
        {!profile.is_system && (
          <div className="flex gap-2 pt-4 mt-2 border-t border-white/[0.07] flex-shrink-0">
            <button onClick={onTrain}
                    className="btn-secondary text-xs flex-1 justify-center">
              ⬡ Trainieren
            </button>
            <button onClick={onDelete}
                    className="btn-danger text-xs px-4">
              Löschen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Drop Zone ─────────────────────────────────────────────────
function DropZone({ onFilesAdded, disabled }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const processItems = useCallback(async (items) => {
    const collected = [];
    for (const item of items) {
      const entry = item.webkitGetAsEntry?.();
      if (entry) {
        await collectFromEntry(entry, collected);
      } else if (item.kind === 'file') {
        const f = item.getAsFile();
        if (f && isTextFile(f.name)) collected.push(f);
      }
    }
    if (collected.length) onFilesAdded(collected);
  }, [onFilesAdded]);

  const processFileList = useCallback((fileList) => {
    const files = Array.from(fileList).filter(f => isTextFile(f.name));
    if (files.length) onFilesAdded(files);
  }, [onFilesAdded]);

  const onDrop = useCallback(async (e) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    if (e.dataTransfer.items?.length) {
      await processItems(Array.from(e.dataTransfer.items));
    } else {
      processFileList(e.dataTransfer.files);
    }
  }, [disabled, processItems, processFileList]);

  const onDragOver  = (e) => { e.preventDefault(); if (!disabled) setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onInputChange = (e) => processFileList(e.target.files);

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`
        relative flex flex-col items-center justify-center gap-3
        rounded-2xl border-2 border-dashed cursor-pointer
        transition-all duration-200 py-10 px-6 text-center select-none
        ${dragging
          ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
          : 'border-white/[0.12] bg-white/[0.02] hover:border-blue-500/50 hover:bg-blue-500/5'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
      `}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all
        ${dragging ? 'bg-blue-500/20' : 'bg-white/[0.05]'}`}>
        <svg className={`w-7 h-7 transition-colors ${dragging ? 'text-blue-400' : 'text-slate-500'}`}
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
        </svg>
      </div>
      <div>
        <p className={`font-medium text-sm transition-colors ${dragging ? 'text-blue-300' : 'text-slate-300'}`}>
          {dragging ? 'Drop files or folders here' : 'Drag & drop files or folders'}
        </p>
        <p className="text-xs text-slate-600 mt-1">
          or <span className="text-blue-400 underline underline-offset-2">click to browse</span>
        </p>
        <p className="text-[11px] text-slate-700 mt-2">
          .txt · .md · .html · .csv · .js · .py · .json and more
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={TEXT_EXTENSIONS.map(e => `.${e}`).join(',')}
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
}

// ── File Badge ────────────────────────────────────────────────
function FileBadge({ file, onRemove }) {
  const ext  = getExt(file.name);
  const size = file.size < 1024
    ? `${file.size} B`
    : file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(1)} KB`
      : `${(file.size / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] group">
      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 uppercase">
        {ext}
      </span>
      <span className="text-xs text-slate-300 truncate flex-1 max-w-[180px]" title={file.name}>{file.name}</span>
      <span className="text-[10px] text-slate-600">{size}</span>
      <button
        onClick={onRemove}
        className="text-slate-600 hover:text-red-400 transition-colors ml-1 opacity-0 group-hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}

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
      const res = await api.profiles.create({
        name, description: desc, language: lang, template_id: templateId || null,
      });
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
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Train Modal ───────────────────────────────────────────────
function TrainModal({ profile, onClose }) {
  const [files,       setFiles]       = useState([]);
  const [reading,     setReading]     = useState(false);
  const [manualText,  setManualText]  = useState('');
  const [lang,        setLang]        = useState(profile.language || 'de');
  const [loading,     setLoading]     = useState(false);
  const [result,      setResult]      = useState(null);
  const [error,       setError]       = useState('');
  const [readErrors,  setReadErrors]  = useState([]);

  const manualDocs = manualText.split('\n---\n').map(t => t.trim()).filter(t => t.length > 20);
  const totalDocs  = files.length + manualDocs.length;

  const handleFilesAdded = useCallback((newFiles) => {
    setFiles(prev => {
      const existing = new Set(prev.map(f => `${f.name}:${f.size}`));
      const unique   = newFiles.filter(f => !existing.has(`${f.name}:${f.size}`));
      return [...prev, ...unique];
    });
  }, []);

  const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx));
  const clearAll   = () => { setFiles([]); setManualText(''); setReadErrors([]); };

  const handleTrain = async () => {
    if (totalDocs === 0) { setError('Add at least one document'); return; }
    setLoading(true); setReading(true); setError(''); setReadErrors([]);

    try {
      const docs = [];
      const errs = [];

      for (const file of files) {
        try {
          const text = await readFileAsText(file);
          if (text.trim().length > 20) docs.push({ content: text, lang });
        } catch {
          errs.push(file.name);
        }
      }

      for (const block of manualDocs) {
        docs.push({ content: block, lang });
      }

      setReading(false);
      if (errs.length) setReadErrors(errs);
      if (docs.length === 0) { setError('No readable content found'); setLoading(false); return; }

      const res = await api.weights.train(profile.id, docs, lang);
      setResult(res.stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setReading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-2xl animate-slide-up"
           style={{ maxHeight: '92vh', overflowY: 'auto' }}>

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-white">Train Profile</h2>
            <p className="text-xs text-slate-500 mt-0.5">{profile.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-lg">✕</button>
        </div>

        {!result ? (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">Files & Folders</label>
                {files.length > 0 && (
                  <button onClick={clearAll} className="text-[11px] text-slate-600 hover:text-red-400 transition-colors">
                    Clear all
                  </button>
                )}
              </div>
              <DropZone onFilesAdded={handleFilesAdded} disabled={loading} />
            </div>

            {files.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-2">{files.length} file{files.length !== 1 ? 's' : ''} loaded</p>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                  {files.map((f, i) => (
                    <FileBadge key={`${f.name}:${i}`} file={f} onRemove={() => removeFile(i)} />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-white/[0.07]" />
              <span className="text-xs text-slate-600">or add text manually</span>
              <div className="flex-1 border-t border-white/[0.07]" />
            </div>

            <div>
              <label className="label">Paste text directly</label>
              <textarea
                value={manualText}
                onChange={e => setManualText(e.target.value)}
                className="textarea min-h-[120px] font-mono text-xs"
                placeholder={'Your first training text...\n---\nYour second training text...'}
                disabled={loading}
              />
              <p className="text-[11px] text-slate-600 mt-1">
                Separate multiple texts with <code className="text-blue-400">---</code> on its own line
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select value={lang} onChange={e => setLang(e.target.value)} className="input max-w-[160px]" disabled={loading}>
                <option value="de">🇩🇪 German</option>
                <option value="en">🇬🇧 English</option>
                <option value="fr">🇫🇷 French</option>
                <option value="es">🇪🇸 Spanish</option>
                <option value="it">🇮🇹 Italian</option>
              </select>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${totalDocs > 0 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                <span className="text-xs text-slate-500">
                  {totalDocs} document{totalDocs !== 1 ? 's' : ''} ready
                </span>
              </div>
            </div>

            {readErrors.length > 0 && (
              <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-400 font-medium mb-1">Could not read {readErrors.length} file(s):</p>
                <p className="text-xs text-amber-600">{readErrors.join(', ')}</p>
              </div>
            )}

            {error && (
              <div className="px-3 py-2 rounded-lg bg-red-500/10 text-sm text-red-400">{error}</div>
            )}

            <div className="flex gap-3 pt-1">
              <button onClick={onClose} className="btn-secondary flex-1 justify-center" disabled={loading}>Cancel</button>
              <button onClick={handleTrain} disabled={loading || totalDocs === 0} className="btn-primary flex-1 justify-center">
                {loading
                  ? <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                      {reading ? 'Reading files…' : 'Training…'}
                    </>
                  : `⬡ Train on ${totalDocs} document${totalDocs !== 1 ? 's' : ''}`
                }
              </button>
            </div>
          </div>

        ) : (
          <div className="animate-slide-up space-y-4">
            <div className="card bg-emerald-500/5 border-emerald-500/20">
              <p className="text-emerald-400 font-semibold mb-4">✓ Training complete!</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">{result.documentsProcessed}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Documents</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{result.uniqueWords?.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Word weights</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{result.topWords?.length ?? 0}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Top words</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-2">Top weighted words:</p>
              <div className="flex flex-wrap gap-2">
                {result.topWords?.map(w => (
                  <span key={w.word} className="kw-chip text-xs">
                    {w.word}
                    <span className="text-blue-600 font-mono text-[10px] ml-1">{w.score}</span>
                  </span>
                ))}
              </div>
            </div>

            {readErrors.length > 0 && (
              <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500">
                ⚠ {readErrors.length} file(s) could not be read and were skipped.
              </div>
            )}

            <button onClick={onClose} className="btn-primary w-full justify-center">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Profile Card ──────────────────────────────────────────────
function ProfileCard({ profile, onClick, onTrain, onDelete }) {
  return (
    <div
      className="card hover:border-white/[0.15] transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
              {profile.name}
            </h3>
            {profile.is_system && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20 flex-shrink-0">
                System
              </span>
            )}
          </div>
          {profile.description && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">{profile.description}</p>
          )}
        </div>
        <span className="badge-gray uppercase flex-shrink-0 ml-2">{profile.language}</span>
      </div>

      {profile.template_id && (
        <p className="text-xs text-slate-600 mb-2">Template: {profile.template_id}</p>
      )}
      <p className="text-xs text-slate-600 mb-4">
        Erstellt {new Date(profile.created_at).toLocaleDateString('de')}
      </p>

      {/* Click hint */}
      <p className="text-[11px] text-slate-700 mb-3 group-hover:text-slate-500 transition-colors">
        ↗ Klicken für Details & Word Weights
      </p>

      {!profile.is_system && (
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          <button
            onClick={onTrain}
            className="btn-secondary text-xs px-3 py-1.5 flex-1 justify-center"
          >
            ⬡ Train
          </button>
          <button
            onClick={onDelete}
            className="btn-danger text-xs px-3 py-1.5"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Profiles Page ────────────────────────────────────────
export default function Profiles() {
  const { user }   = useAuth();
  const [profiles,      setProfiles]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [showCreate,    setShowCreate]    = useState(false);
  const [trainProfile,  setTrainProfile]  = useState(null);
  const [detailProfile, setDetailProfile] = useState(null);

  const load = () => {
    setLoading(true);
    api.profiles.list()
      .then(d => setProfiles(d.profiles || []))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this profile?')) return;
    await api.profiles.delete(id).catch(() => {});
    setProfiles(p => p.filter(x => x.id !== id));
    if (detailProfile?.id === id) setDetailProfile(null);
  };

  const maxProfiles = user?.plan === 'pro' ? 50 : 3;
  const userProfiles   = profiles.filter(p => !p.is_system);
  const systemProfiles = profiles.filter(p =>  p.is_system);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Profiles</h1>
          <p className="text-sm text-slate-500 mt-1">
            {userProfiles.length} / {maxProfiles} eigene Profile
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary"
          disabled={userProfiles.length >= maxProfiles}
        >
          + New Profile
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
        </div>
      )}

      {/* Empty state */}
      {!loading && profiles.length === 0 && (
        <div className="card text-center py-14">
          <div className="text-4xl mb-4 opacity-20">◈</div>
          <p className="text-white font-medium mb-2">Noch keine Profile</p>
          <p className="text-sm text-slate-500 mb-6">Erstelle ein Profil und trainiere es mit deinen Texten</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary mx-auto">
            Erstes Profil erstellen
          </button>
        </div>
      )}

      {/* System Profiles */}
      {!loading && systemProfiles.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-medium text-slate-400">Vortranierte System-Profile</h2>
            <div className="flex-1 border-t border-white/[0.07]" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {systemProfiles.map(p => (
              <ProfileCard
                key={p.id}
                profile={p}
                onClick={() => setDetailProfile(p)}
                onTrain={null}
                onDelete={null}
              />
            ))}
          </div>
        </div>
      )}

      {/* User Profiles */}
      {!loading && userProfiles.length > 0 && (
        <div>
          {systemProfiles.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-medium text-slate-400">Meine Profile</h2>
              <div className="flex-1 border-t border-white/[0.07]" />
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            {userProfiles.map(p => (
              <ProfileCard
                key={p.id}
                profile={p}
                onClick={() => setDetailProfile(p)}
                onTrain={() => setTrainProfile(p)}
                onDelete={() => handleDelete(p.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreate={p => setProfiles(prev => [p, ...prev])}
        />
      )}

      {trainProfile && (
        <TrainModal
          profile={trainProfile}
          onClose={() => { setTrainProfile(null); load(); }}
        />
      )}

      {detailProfile && (
        <ProfileDetailModal
          profile={detailProfile}
          onClose={() => setDetailProfile(null)}
          onTrain={() => { setDetailProfile(null); setTrainProfile(detailProfile); }}
          onDelete={() => handleDelete(detailProfile.id)}
        />
      )}
    </div>
  );
}
