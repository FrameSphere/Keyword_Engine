import { useState, useEffect } from 'react';
import { api } from '../api.js';

export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [offset,   setOffset]   = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState(null);
  const LIMIT = 20;

  const load = (off = 0) => {
    setLoading(true);
    api.history.list(LIMIT, off)
      .then(d => { setAnalyses(d.analyses || []); setTotal(d.total || 0); setOffset(off); })
      .finally(() => setLoading(false));
  };
  useEffect(() => load(), []);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">History</h1>
        <p className="text-sm text-slate-500 mt-1">{total} total analyses</p>
      </div>

      {loading && <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>}

      {!loading && analyses.length === 0 && (
        <div className="card text-center py-14">
          <div className="text-4xl mb-4 opacity-20">◷</div>
          <p className="text-slate-500">No analyses yet</p>
        </div>
      )}

      <div className="space-y-3">
        {analyses.map(a => (
          <div key={a.id} className="card cursor-pointer hover:border-white/[0.12] transition-all"
               onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
            <div className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded flex items-center justify-center text-sm flex-shrink-0 ${
                a.mode === 'ai' ? 'bg-fuchsia-500/10 text-fuchsia-400' : 'bg-blue-500/10 text-blue-400'
              }`}>
                {a.mode === 'ai' ? '✦' : '⬡'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate font-medium">{a.input_title || '(no title)'}</p>
                <p className="text-xs text-slate-500">{a.keywords?.length} kw · {a.longtail?.length} lt · {a.language?.toUpperCase()}</p>
              </div>
              <p className="text-xs text-slate-600 whitespace-nowrap">{new Date(a.created_at).toLocaleDateString()}</p>
              <svg className={`w-4 h-4 text-slate-600 transition-transform ${expanded === a.id ? 'rotate-180' : ''}`}
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </div>

            {expanded === a.id && (
              <div className="mt-4 pt-4 border-t border-white/[0.07] space-y-3 animate-slide-up">
                {a.keywords?.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {a.keywords.map((kw, i) => <span key={i} className="kw-chip text-xs">{kw}</span>)}
                    </div>
                  </div>
                )}
                {a.longtail?.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Longtail</p>
                    <div className="flex flex-wrap gap-1.5">
                      {a.longtail.map((lt, i) => <span key={i} className="lt-chip text-xs">{lt}</span>)}
                    </div>
                  </div>
                )}
                {a.meta_description && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Meta Description</p>
                    <p className="text-xs text-slate-400 italic">"{a.meta_description}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {total > LIMIT && (
        <div className="flex justify-center gap-3 mt-8">
          <button disabled={offset === 0} onClick={() => load(offset - LIMIT)} className="btn-secondary disabled:opacity-40">
            ← Previous
          </button>
          <span className="text-sm text-slate-500 self-center">
            {offset + 1}–{Math.min(offset + LIMIT, total)} of {total}
          </span>
          <button disabled={offset + LIMIT >= total} onClick={() => load(offset + LIMIT)} className="btn-secondary disabled:opacity-40">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
