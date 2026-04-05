// ============================================================
// KeyScope – WelcomeModal
// Shown after new user registration.
// Phase 1 → animated greeting + logo pulse
// Phase 2 → free plan feature overview + Pro teaser
// Phase 3 → tutorial choice (yes/no)
// Phase 4 (if yes) → step-by-step guide
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Free plan highlights ──────────────────────────────────────
const FREE_FEATURES = [
  { icon: '⬡', label: '20 analyses / day',       color: '#3b82f6' },
  { icon: '◈', label: '3 keyword profiles',        color: '#8b5cf6' },
  { icon: '🌐', label: '5 languages supported',    color: '#06b6d4' },
  { icon: '⚡', label: 'REST API access',           color: '#10b981' },
  { icon: '📄', label: 'Pre-built templates',       color: '#f59e0b' },
];

// ── Tutorial steps ────────────────────────────────────────────
const TUTORIAL_STEPS = [
  {
    icon: '◈',
    title: 'Create a Profile',
    desc: 'Go to Profiles → create one for your niche (e.g. "Tech Blog EN"). It acts as your analysis context.',
    action: '/app/profiles',
    actionLabel: 'Open Profiles →',
    color: '#8b5cf6',
  },
  {
    icon: '⬡',
    title: 'Run an Analysis',
    desc: 'Head to the Analyzer, paste your text, pick a profile and language — then hit Analyze.',
    action: '/app/analyze',
    actionLabel: 'Open Analyzer →',
    color: '#3b82f6',
  },
  {
    icon: '📊',
    title: 'Review Keywords',
    desc: 'Your results show keywords ranked by TF-IDF score plus longtail phrases. Use them in your content.',
    action: null,
    actionLabel: null,
    color: '#06b6d4',
  },
  {
    icon: '🚀',
    title: 'Scale with Pro',
    desc: '500 analyses/day, AI mode, full history & more. Upgrade when you\'re ready — cancel anytime.',
    action: '/pricing',
    actionLabel: 'View Pro →',
    color: '#c026d3',
  },
];

export default function WelcomeModal({ onClose }) {
  const navigate = useNavigate();
  // phase: 'greeting' | 'features' | 'tutorial-choice' | 'tutorial'
  const [phase,     setPhase]     = useState('greeting');
  const [tutStep,   setTutStep]   = useState(0);
  const [logoAnim,  setLogoAnim]  = useState(false);

  // Sequence: greeting → features after 1.6 s
  useEffect(() => {
    setLogoAnim(true);
    const t = setTimeout(() => setPhase('features'), 1700);
    return () => clearTimeout(t);
  }, []);

  const handleTutorialYes = () => { setPhase('tutorial'); setTutStep(0); };
  const handleTutorialNo  = () => { onClose(); navigate('/app'); };

  const handleStepAction = (action) => {
    if (!action) return;
    onClose();
    navigate(action);
  };

  const handleFinish = () => { onClose(); navigate('/app'); };

  // ── Shared close + backdrop ───────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(12px)', animation: 'ks-fadeIn 0.3s ease' }}
    >
      <div
        className="relative w-full max-w-md overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0d1321 0%, #111827 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          boxShadow: '0 0 80px rgba(37,99,235,0.12), 0 32px 64px rgba(0,0,0,0.5)',
          animation: 'ks-slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Ambient glow top */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '300px', height: '120px',
          background: 'radial-gradient(ellipse, rgba(37,99,235,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Close button – always visible */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-slate-500 hover:text-white transition-colors text-lg"
        >✕</button>

        {/* ════════════════════════════════════════════════════
            PHASE 1 – GREETING
        ════════════════════════════════════════════════════ */}
        <div style={{
          transition: 'opacity 0.45s ease, max-height 0.5s ease',
          opacity: phase === 'greeting' ? 1 : 0,
          maxHeight: phase === 'greeting' ? '360px' : '0px',
          overflow: 'hidden',
        }}>
          <div className="flex flex-col items-center justify-center py-12 px-6 gap-5">
            {/* Animated logo */}
            <div style={{
              width: '80px', height: '80px', borderRadius: '20px',
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: logoAnim ? '0 0 40px rgba(37,99,235,0.5), 0 0 80px rgba(124,58,237,0.25)' : 'none',
              transition: 'box-shadow 0.6s ease',
              animation: 'ks-logoPop 0.55s cubic-bezier(0.34,1.56,0.64,1)',
            }}>
              <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
                <circle cx="26" cy="32" r="12" stroke="white" strokeWidth="3.5" fill="none" opacity="0.95"/>
                <circle cx="26" cy="32" r="4" fill="white" opacity="0.9"/>
                <line x1="35" y1="32" x2="52" y2="32" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
                <line x1="44" y1="32" x2="44" y2="38" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
                <line x1="49" y1="32" x2="49" y2="36" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
              </svg>
            </div>

            <div className="text-center" style={{ animation: 'ks-fadeIn 0.5s ease 0.35s both' }}>
              <p className="text-white font-bold text-2xl mb-1">Welcome to KeyScope</p>
              <p className="text-slate-400 text-sm">Your account is ready. Let's get you started.</p>
            </div>

            {/* Animated dots */}
            <div className="flex gap-2" style={{ animation: 'ks-fadeIn 0.4s ease 0.7s both' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'rgba(37,99,235,0.7)',
                  animation: `ks-bounce 1.0s ease ${i * 0.15}s infinite`,
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            PHASE 2 – FREE FEATURES
        ════════════════════════════════════════════════════ */}
        <div style={{
          transition: 'opacity 0.5s ease, max-height 0.55s ease',
          opacity: phase === 'features' ? 1 : 0,
          maxHeight: phase === 'features' ? '600px' : '0px',
          overflow: 'hidden',
        }}>
          <div className="px-6 pt-8 pb-6">
            {/* Header */}
            <div className="text-center mb-6" style={{ animation: 'ks-slideDown 0.4s ease both' }}>
              <span style={{
                display: 'inline-block', fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em',
                color: '#3b82f6', background: 'rgba(37,99,235,0.1)',
                padding: '3px 10px', borderRadius: '999px', border: '1px solid rgba(37,99,235,0.25)',
                marginBottom: '10px',
              }}>FREE PLAN</span>
              <p className="text-white font-bold text-xl">You're in. Here's what you have.</p>
              <p className="text-slate-500 text-sm mt-1">Everything you need to explore keyword extraction.</p>
            </div>

            {/* Feature list */}
            <div className="space-y-2 mb-5">
              {FREE_FEATURES.map((f, i) => (
                <div
                  key={f.label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 14px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    animation: `ks-slideIn 0.35s cubic-bezier(0.34,1.2,0.64,1) ${i * 70}ms both`,
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                    background: f.color + '18',
                    border: `1px solid ${f.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '15px',
                  }}>{f.icon}</div>
                  <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500' }}>{f.label}</span>
                  <span style={{
                    marginLeft: 'auto', color: '#22c55e', fontSize: '13px',
                    background: 'rgba(34,197,94,0.08)', padding: '2px 8px', borderRadius: '999px',
                    border: '1px solid rgba(34,197,94,0.2)',
                  }}>✓ Included</span>
                </div>
              ))}
            </div>

            {/* Pro teaser */}
            <div style={{
              padding: '12px 14px', borderRadius: '14px', marginBottom: '18px',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(192,38,211,0.08))',
              border: '1px solid rgba(124,58,237,0.2)',
              animation: 'ks-fadeIn 0.5s ease 0.45s both',
            }}>
              <p style={{ fontSize: '12px', color: '#c084fc', fontWeight: '600', marginBottom: '4px' }}>
                ✦ Unlock more with Pro
              </p>
              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                500 analyses/day · AI mode · 50 profiles · Full history · Priority support — from €7.49/mo
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => setPhase('tutorial-choice')}
              style={{
                width: '100%', padding: '13px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                color: 'white', fontWeight: '600', fontSize: '14px',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 0 24px rgba(37,99,235,0.3)',
                animation: 'ks-fadeIn 0.4s ease 0.55s both',
                transition: 'opacity 0.2s',
              }}
            >
              Continue →
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            PHASE 3 – TUTORIAL CHOICE
        ════════════════════════════════════════════════════ */}
        <div style={{
          transition: 'opacity 0.45s ease, max-height 0.5s ease',
          opacity: phase === 'tutorial-choice' ? 1 : 0,
          maxHeight: phase === 'tutorial-choice' ? '420px' : '0px',
          overflow: 'hidden',
        }}>
          <div className="px-6 py-8">
            <div className="text-center mb-8" style={{ animation: 'ks-slideDown 0.4s ease both' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 16px',
                background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
              }}>🧭</div>
              <p className="text-white font-bold text-xl mb-2">Would you like a quick tour?</p>
              <p className="text-slate-500 text-sm">We'll show you the 4 steps to your first keyword analysis.</p>
            </div>

            <div className="space-y-3" style={{ animation: 'ks-fadeIn 0.4s ease 0.15s both' }}>
              <button
                onClick={handleTutorialYes}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '14px', display: 'flex',
                  alignItems: 'center', gap: '12px',
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.12))',
                  border: '1px solid rgba(37,99,235,0.3)',
                  color: 'white', cursor: 'pointer', textAlign: 'left',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(37,99,235,0.6)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)'}
              >
                <span style={{ fontSize: '22px' }}>🗺️</span>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>Yes, show me the tour</p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>~2 minutes · 4 steps</p>
                </div>
                <span style={{ marginLeft: 'auto', color: '#3b82f6', fontSize: '16px' }}>→</span>
              </button>

              <button
                onClick={handleTutorialNo}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '14px', display: 'flex',
                  alignItems: 'center', gap: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: '#94a3b8', cursor: 'pointer', textAlign: 'left',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#e2e8f0'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#94a3b8'; }}
              >
                <span style={{ fontSize: '22px' }}>⚡</span>
                <div>
                  <p style={{ fontWeight: '500', fontSize: '14px', marginBottom: '2px' }}>Skip — go to Dashboard</p>
                  <p style={{ fontSize: '12px', color: '#475569' }}>You can explore on your own</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            PHASE 4 – TUTORIAL STEPS
        ════════════════════════════════════════════════════ */}
        <div style={{
          transition: 'opacity 0.45s ease, max-height 0.55s ease',
          opacity: phase === 'tutorial' ? 1 : 0,
          maxHeight: phase === 'tutorial' ? '520px' : '0px',
          overflow: 'hidden',
        }}>
          <div className="px-6 pt-6 pb-6">
            {/* Step indicator */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', justifyContent: 'center' }}>
              {TUTORIAL_STEPS.map((_, i) => (
                <div key={i} style={{
                  height: '3px', flex: '1', maxWidth: '48px', borderRadius: '999px',
                  background: i <= tutStep ? '#3b82f6' : 'rgba(255,255,255,0.08)',
                  transition: 'background 0.4s ease',
                }} />
              ))}
            </div>

            {TUTORIAL_STEPS.map((step, i) => (
              <div
                key={i}
                style={{
                  display: tutStep === i ? 'block' : 'none',
                  animation: tutStep === i ? 'ks-slideIn 0.35s cubic-bezier(0.34,1.2,0.64,1) both' : 'none',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '64px', height: '64px', borderRadius: '18px', margin: '0 auto 16px',
                  background: step.color + '18', border: `1px solid ${step.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px',
                }}>
                  {step.icon}
                </div>

                <div className="text-center mb-6">
                  <p style={{ fontSize: '11px', color: step.color, fontWeight: '600', letterSpacing: '0.08em', marginBottom: '8px' }}>
                    STEP {i + 1} OF {TUTORIAL_STEPS.length}
                  </p>
                  <p className="text-white font-bold text-xl mb-2">{step.title}</p>
                  <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>{step.desc}</p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {step.action && (
                    <button
                      onClick={() => handleStepAction(step.action)}
                      style={{
                        flex: '1', padding: '11px', borderRadius: '11px',
                        background: step.color + '18', border: `1px solid ${step.color}40`,
                        color: step.color, fontSize: '13px', fontWeight: '600',
                        cursor: 'pointer', transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = step.color + '28'}
                      onMouseLeave={e => e.currentTarget.style.background = step.color + '18'}
                    >
                      {step.actionLabel}
                    </button>
                  )}

                  {i < TUTORIAL_STEPS.length - 1 ? (
                    <button
                      onClick={() => setTutStep(s => s + 1)}
                      style={{
                        flex: step.action ? '1' : '2', padding: '11px', borderRadius: '11px',
                        background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                        color: 'white', fontSize: '13px', fontWeight: '600',
                        border: 'none', cursor: 'pointer',
                        boxShadow: '0 0 18px rgba(37,99,235,0.25)',
                      }}
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      onClick={handleFinish}
                      style={{
                        flex: step.action ? '1' : '2', padding: '11px', borderRadius: '11px',
                        background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                        color: 'white', fontSize: '13px', fontWeight: '600',
                        border: 'none', cursor: 'pointer',
                        boxShadow: '0 0 18px rgba(37,99,235,0.25)',
                      }}
                    >
                      Go to Dashboard 🚀
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Keyframes ───────────────────────────────────────── */}
      <style>{`
        @keyframes ks-fadeIn   { from { opacity:0 }  to { opacity:1 } }
        @keyframes ks-slideUp  {
          from { opacity:0; transform: translateY(28px) scale(0.97); }
          to   { opacity:1; transform: translateY(0)    scale(1); }
        }
        @keyframes ks-slideDown {
          from { opacity:0; transform: translateY(-10px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes ks-slideIn  {
          from { opacity:0; transform: translateX(-16px); }
          to   { opacity:1; transform: translateX(0); }
        }
        @keyframes ks-logoPop  {
          from { opacity:0; transform: scale(0.6) rotate(-8deg); }
          to   { opacity:1; transform: scale(1)   rotate(0deg); }
        }
        @keyframes ks-bounce {
          0%, 100% { transform: translateY(0);    opacity:0.5; }
          50%       { transform: translateY(-6px); opacity:1; }
        }
      `}</style>
    </div>
  );
}
