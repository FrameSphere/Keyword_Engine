import { useState, useEffect } from 'react';

// ── Animationszeiten ──────────────────────────────────────────
// 0ms    : Modal erscheint, Kreis beginnt sich zu füllen
// 900ms  : Kreis komplett + Haken erscheint
// 1600ms : Features-Panel faded rein

const FEATURES = [
  { icon: '⬡', label: '500 Analysen / Tag',       sub: 'statt 20' },
  { icon: '◈', label: '50 Profile',                sub: 'statt 3' },
  { icon: '📄', label: '200 Training-Dokumente',   sub: 'statt 20' },
  { icon: '✦', label: 'AI-Modus (HuggingFace)',    sub: 'jetzt aktiv' },
  { icon: '⚡', label: 'Priorität-Support',         sub: 'schnellere Antworten' },
];

export default function ProSuccessModal({ onClose }) {
  const [phase, setPhase] = useState('check'); // 'check' | 'features'

  useEffect(() => {
    const t = setTimeout(() => setPhase('features'), 1700);
    return () => clearTimeout(t);
  }, []);

  // Kreis-Parameter
  const R = 54;
  const CIRC = 2 * Math.PI * R; // ≈ 339.3

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
         style={{ animation: 'fadeIn 0.25s ease' }}>
      <div className="card w-full max-w-md relative overflow-hidden"
           style={{ animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>

        {/* Schließen-Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors text-lg z-10"
        >
          ✕
        </button>

        {/* ── Phase 1: Checkmark-Animation ── */}
        <div
          style={{
            transition: 'opacity 0.5s ease, max-height 0.6s ease',
            opacity: phase === 'check' ? 1 : 0,
            maxHeight: phase === 'check' ? '260px' : '0px',
            overflow: 'hidden',
          }}
        >
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <svg width="128" height="128" viewBox="0 0 128 128">
              {/* Hintergrund-Kreis */}
              <circle
                cx="64" cy="64" r={R}
                fill="none"
                stroke="rgba(139,92,246,0.15)"
                strokeWidth="6"
              />
              {/* Animierter Kreis */}
              <circle
                cx="64" cy="64" r={R}
                fill="none"
                stroke="url(#proGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC}
                transform="rotate(-90 64 64)"
                style={{
                  animation: 'drawCircle 0.85s cubic-bezier(0.4,0,0.2,1) 0.1s forwards',
                }}
              />
              {/* Haken */}
              <polyline
                points="38,66 56,84 90,46"
                fill="none"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="80"
                strokeDashoffset="80"
                style={{
                  animation: 'drawCheck 0.35s ease 0.95s forwards',
                }}
              />
              <defs>
                <linearGradient id="proGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#c026d3" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-center"
                 style={{ animation: 'fadeIn 0.4s ease 1.0s both' }}>
              <p className="text-white font-bold text-xl">Pro aktiviert!</p>
              <p className="text-slate-400 text-sm mt-1">Dein Upgrade war erfolgreich.</p>
            </div>
          </div>
        </div>

        {/* ── Phase 2: Features ── */}
        <div
          style={{
            transition: 'opacity 0.55s ease 0.05s, max-height 0.55s ease',
            opacity: phase === 'features' ? 1 : 0,
            maxHeight: phase === 'features' ? '600px' : '0px',
            overflow: 'hidden',
          }}
        >
          <div className="pt-6 pb-2 px-1">
            {/* Kleines Checkmark-Icon oben */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                   style={{ background: 'linear-gradient(135deg,#c026d3,#7c3aed)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <polyline points="4,12 10,18 20,7" stroke="white" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">Willkommen bei Pro</p>
                <p className="text-slate-400 text-xs">Diese Features sind jetzt freigeschaltet</p>
              </div>
            </div>

            {/* Feature-Liste */}
            <div className="space-y-2 mb-6">
              {FEATURES.map((f, i) => (
                <div
                  key={f.label}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border"
                  style={{
                    background: 'rgba(139,92,246,0.06)',
                    borderColor: 'rgba(139,92,246,0.18)',
                    animation: `slideInFeature 0.35s cubic-bezier(0.34,1.2,0.64,1) ${i * 80}ms both`,
                  }}
                >
                  <span className="text-base w-6 text-center flex-shrink-0">{f.icon}</span>
                  <span className="text-sm text-white font-medium flex-1">{f.label}</span>
                  <span className="text-xs text-fuchsia-400 font-medium">{f.sub}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
              style={{
                background: 'linear-gradient(135deg,#c026d3,#7c3aed)',
                boxShadow: '0 0 24px rgba(192,38,211,0.3)',
              }}
            >
              Jetzt loslegen →
            </button>
          </div>
        </div>
      </div>

      {/* ── Keyframes als Inline-Style-Tag ── */}
      <style>{`
        @keyframes drawCircle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes slideInFeature {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
