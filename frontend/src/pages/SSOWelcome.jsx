// ============================================================
// KeyScope – SSO Welcome Page
// Route: /sso-welcome
// Shown after successful FrameSphere SSO login
// ============================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';

// ── Inline SVG Icons (no lucide-react dependency) ────────────
const IconSearch = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconZap = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconLayers = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
);
const IconDatabase = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
);
const IconCheck = ({ size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconArrowRight = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const FEATURES = [
  {
    Icon:   IconSearch,
    title:  'TF-IDF Keyword Engine',
    desc:   'Domänenspezifische Gewichtungen — trainiert auf deinen eigenen Texten für maximale Relevanz.',
    color:  '#60a5fa',
    bg:     'rgba(96,165,250,0.08)',
    border: 'rgba(96,165,250,0.2)',
  },
  {
    Icon:   IconZap,
    title:  'AI-Powered Modus',
    desc:   'Semantische Keyword-Extraktion via fine-tuned HuggingFace-Modell — über reine Frequenzanalyse hinaus.',
    color:  '#a78bfa',
    bg:     'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.2)',
  },
  {
    Icon:   IconLayers,
    title:  'Longtail Phrases',
    desc:   'Gewichtetes Bigram & Trigram-System — jede Phrase gescored nach semantischer Relevanz.',
    color:  '#f472b6',
    bg:     'rgba(244,114,182,0.08)',
    border: 'rgba(244,114,182,0.2)',
  },
  {
    Icon:   IconDatabase,
    title:  'FrameSphere Connected',
    desc:   'Dein FrameSphere-Konto ist verknüpft — ein Account, alle Tools, ein Login.',
    color:  '#34d399',
    bg:     'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.2)',
  },
];

// ── KeyScope Logo ─────────────────────────────────────────────
function KeyScopeLogo({ visible }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0) scale(1)' : 'translateX(-60px) scale(0.8)',
      transition: `opacity 0.7s ${ease}, transform 0.7s ${ease}`,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 40px rgba(37,99,235,0.55), 0 8px 32px rgba(0,0,0,0.4)',
        position: 'relative',
      }}>
        <svg width="38" height="38" viewBox="0 0 64 64" fill="none">
          <circle cx="26" cy="32" r="13" stroke="white" strokeWidth="4" fill="none" opacity="0.95"/>
          <circle cx="26" cy="32" r="4.5" fill="white" opacity="0.85"/>
          <line x1="35" y1="32" x2="52" y2="32" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.9"/>
          <line x1="44" y1="32" x2="44" y2="39" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.9"/>
          <line x1="50" y1="32" x2="50" y2="37" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.9"/>
        </svg>
        <div style={{ position: 'absolute', inset: -1, borderRadius: 21, background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)', pointerEvents: 'none' }}/>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15 }}>KeyScope</div>
        <div style={{ color: '#475569', fontSize: 12, marginTop: 2 }}>SEO Keyword Engine</div>
      </div>
    </div>
  );
}

// ── FrameSphere Logo ──────────────────────────────────────────
function FrameSphereLogo({ visible }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0) scale(1)' : 'translateX(60px) scale(0.8)',
      transition: `opacity 0.7s ${ease} 0.15s, transform 0.7s ${ease} 0.15s`,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: 'linear-gradient(135deg, #6d28d9, #c026d3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 40px rgba(192,38,211,0.5), 0 8px 32px rgba(0,0,0,0.4)',
        position: 'relative',
      }}>
        <span style={{ color: 'white', fontWeight: 900, fontSize: 26, letterSpacing: '-1px' }}>FS</span>
        <div style={{ position: 'absolute', inset: -1, borderRadius: 21, background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)', pointerEvents: 'none' }}/>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15 }}>FrameSphere</div>
        <div style={{ color: '#475569', fontSize: 12, marginTop: 2 }}>Dein Account-Hub</div>
      </div>
    </div>
  );
}

// ── Connection Line ───────────────────────────────────────────
function ConnectionLine({ phase }) {
  const drawing = ['connecting', 'connected', 'features', 'cta'].includes(phase);
  const done    = ['connected',  'features',  'cta'].includes(phase);

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: 120 }}>
      <div style={{
        position: 'relative', width: '100%', height: 2,
        background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden',
      }}>
        {/* Fill bar */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 2,
          background: 'linear-gradient(90deg, #2563EB, #7C3AED)',
          transformOrigin: 'left center',
          transform: drawing ? 'scaleX(1)' : 'scaleX(0)',
          transition: drawing ? `transform 0.6s ${ease}` : 'none',
          boxShadow: drawing ? '0 0 10px rgba(124,58,237,0.8)' : 'none',
        }}/>
        {/* Travelling dot */}
        {drawing && !done && (
          <div style={{
            position: 'absolute', top: '50%',
            width: 8, height: 8, borderRadius: '50%',
            background: 'white', boxShadow: '0 0 12px rgba(255,255,255,0.9)',
            transform: 'translateY(-50%)',
            animation: 'travelDot 0.6s ease-out forwards',
          }}/>
        )}
      </div>
      {/* Check badge */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: 28, height: 28, borderRadius: '50%',
        background: done ? 'linear-gradient(135deg, #2563EB, #7C3AED)' : 'transparent',
        border: done ? 'none' : '2px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: done ? 1 : 0,
        transform: done
          ? 'translate(-50%, -50%) scale(1)'
          : 'translate(-50%, -50%) scale(0)',
        transition: `opacity 0.4s ${ease}, transform 0.5s ${ease}`,
        boxShadow: done ? '0 0 20px rgba(124,58,237,0.6)' : 'none',
      }}>
        <IconCheck size={14} color="white" />
      </div>
    </div>
  );
}

// ── Feature Card ──────────────────────────────────────────────
function FeatureCard({ Icon, title, desc, color, bg, border, delay, visible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '18px 20px', borderRadius: 16,
        background: hovered ? `linear-gradient(135deg, ${bg}, rgba(255,255,255,0.03))` : bg,
        border: `1px solid ${hovered ? color + '55' : border}`,
        backdropFilter: 'blur(12px)', cursor: 'default',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.95)',
        transition: `opacity 0.5s ${ease} ${delay}ms, transform 0.5s ${ease} ${delay}ms, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease`,
        boxShadow: hovered ? `0 8px 32px ${color}22` : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          transform: hovered ? 'scale(1.1) rotate(-4deg)' : 'scale(1)',
          transition: 'transform 0.25s ease',
        }}>
          <Icon size={18} color={color} />
        </div>
        <div>
          <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{title}</div>
          <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.5 }}>{desc}</div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function SSOWelcome() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('idle');
  const [btnHovered, setBtnHovered] = useState(false);

  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setPhase('logos'),      150));
    timers.push(setTimeout(() => setPhase('connecting'), 950));
    timers.push(setTimeout(() => setPhase('connected'),  1650));
    timers.push(setTimeout(() => setPhase('features'),   2250));
    timers.push(setTimeout(() => setPhase('cta'),        2950));
    return () => timers.forEach(clearTimeout);
  }, []);

  const showLogos    = phase !== 'idle';
  const showBadge    = ['connected', 'features', 'cta'].includes(phase);
  const showHeadline = ['features',  'cta'].includes(phase);
  const showFeatures = ['features',  'cta'].includes(phase);
  const showCta      = phase === 'cta';

  return (
    <>
      <style>{`
        @keyframes travelDot  { from { left: 0%; } to { left: 100%; } }
        @keyframes orbPulse   { 0%,100% { opacity:.35; transform:scale(1); } 50% { opacity:.65; transform:scale(1.07); } }
        @keyframes shimmerBtn { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
      `}</style>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, background: '#030712', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 700, height: 600, borderRadius: '50%', top: '-200px', left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)', animation: 'orbPulse 9s ease-in-out infinite' }}/>
        <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', bottom: '-100px', right: '10%', background: 'radial-gradient(circle, rgba(124,58,237,0.13) 0%, transparent 70%)', animation: 'orbPulse 12s ease-in-out infinite 1.5s' }}/>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)', backgroundSize: '60px 60px' }}/>
      </div>

      <main style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 16px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <div style={{ width: '100%', maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 48 }}>

          {/* ── Animation Block ── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>

            {/* Logos + Line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center' }}>
              <KeyScopeLogo visible={showLogos} />
              <ConnectionLine phase={phase} />
              <FrameSphereLogo visible={showLogos} />
            </div>

            {/* Success Badge */}
            <div style={{
              opacity: showBadge ? 1 : 0,
              transform: showBadge ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)',
              transition: `opacity 0.5s ${ease}, transform 0.5s ${ease}`,
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 20px', borderRadius: 100,
              background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(124,58,237,0.4)',
            }}>
              <IconCheck size={15} color="#818cf8" />
              <span style={{ color: '#818cf8', fontSize: 13, fontWeight: 600 }}>Erfolgreich verbunden</span>
            </div>

            {/* Headline */}
            <div style={{
              textAlign: 'center',
              opacity: showHeadline ? 1 : 0,
              transform: showHeadline ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.5s ${ease} 0.1s, transform 0.5s ${ease} 0.1s`,
            }}>
              <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: 12 }}>
                Dein FrameSphere-Konto<br />
                <span style={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  ist jetzt verknüpft.
                </span>
              </h1>
              <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6, maxWidth: 440, margin: '0 auto' }}>
                Melde dich ab sofort mit einem Klick über FrameSphere bei KeyScope an —
                kein separates Passwort nötig. Dein Account ist eingerichtet und bereit.
              </p>
            </div>
          </div>

          {/* ── Feature Cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 80} visible={showFeatures} />
            ))}
          </div>

          {/* ── CTA ── */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            opacity: showCta ? 1 : 0,
            transform: showCta ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.5s ${ease}, transform 0.5s ${ease}`,
          }}>
            <button
              onClick={() => navigate('/app')}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                padding: '16px 48px', borderRadius: 14, border: 'none', cursor: 'pointer',
                fontSize: 16, fontWeight: 700, color: 'white',
                background: 'linear-gradient(135deg, #2563EB, #7C3AED, #a21caf, #7C3AED, #2563EB)',
                backgroundSize: '300% 100%',
                animation: 'shimmerBtn 2.5s linear infinite',
                transform: btnHovered ? 'scale(1.04) translateY(-2px)' : 'scale(1) translateY(0)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: btnHovered ? '0 20px 50px rgba(124,58,237,0.45)' : '0 8px 30px rgba(37,99,235,0.3)',
                display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '-0.3px',
              }}
            >
              Zum Dashboard
              <span style={{
                display: 'inline-flex',
                transform: btnHovered ? 'translateX(3px)' : 'translateX(0)',
                transition: 'transform 0.2s ease',
              }}>
                <IconArrowRight size={18} color="white" />
              </span>
            </button>
            <p style={{ color: '#1e293b', fontSize: 13 }}>
              Deine Profile und API Keys findest du im Dashboard.
            </p>
          </div>

        </div>
      </main>
    </>
  );
}
