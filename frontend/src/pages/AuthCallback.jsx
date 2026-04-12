// ============================================================
// KeyScope – OAuth Callback Page
// Route: /auth/callback
// Handles the code exchange after Google / GitHub / FrameSphere redirect.
// Also handles: /auth/verify-email?status=success|invalid
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';
import WelcomeModal from '../components/WelcomeModal.jsx';

function Spinner() {
  return (
    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  );
}

// ── Verify Email success/error ────────────────────────────────
function VerifyEmailResult({ status }) {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    if (status === 'success') refreshUser();
  }, [status]);

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center"
             style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="4 12 10 18 20 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Email verified!</h1>
        <p className="text-slate-400 text-sm mb-6">Your email has been confirmed. You're all set.</p>
        <button onClick={() => navigate('/app')}
                className="btn-primary px-8 py-3">
          Go to Dashboard →
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center"
           style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Link expired or invalid</h1>
      <p className="text-slate-400 text-sm mb-6">
        This verification link has expired or already been used.
        <br />Sign in and request a new one from your dashboard.
      </p>
      <Link to="/login" className="btn-primary px-8 py-3">Sign in</Link>
    </div>
  );
}

// ── OAuth Callback ────────────────────────────────────────────
export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const { loginWithToken } = useAuth();
  const done = useRef(false);

  const [status,       setStatus]       = useState('loading');
  const [errorMsg,     setErrorMsg]     = useState('');
  const [showWelcome,  setShowWelcome]  = useState(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    const verifyStatus = searchParams.get('status');

    // ── Email verification redirect ───────────────────────────
    if (verifyStatus) {
      setStatus(verifyStatus === 'success' ? 'verify-success' : 'verify-invalid');
      return;
    }

    // ── OAuth code exchange ───────────────────────────────────
    const code  = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setErrorMsg('OAuth sign-in was cancelled or failed.');
      return;
    }

    if (!code) {
      setStatus('error');
      setErrorMsg('No authorization code received.');
      return;
    }

    // Provider stored in sessionStorage before the redirect
    const provider = sessionStorage.getItem('oauth_provider') || 'google';
    sessionStorage.removeItem('oauth_provider');

    const redirectUri = `${window.location.origin}/auth/callback`;

    api.auth.oauthExchange(provider, code, redirectUri)
      .then(data => {
        loginWithToken(data.token, data.user);
        setStatus('success');

        // FrameSphere SSO → always show the dedicated SSO Welcome animation
        if (provider === 'framesphere') {
          navigate('/sso-welcome', { replace: true });
          return;
        }

        // Google / GitHub → show WelcomeModal only for brand-new users
        const isFirst = !localStorage.getItem(`ks_welcomed_${data.user.id}`);
        if (isFirst) {
          localStorage.setItem(`ks_welcomed_${data.user.id}`, '1');
          setShowWelcome(true);
        } else {
          navigate('/app', { replace: true });
        }
      })
      .catch(e => {
        setStatus('error');
        setErrorMsg(e.message || 'Authentication failed. Please try again.');
      });
  }, []);

  // ── Verify email result pages ─────────────────────────────
  if (status === 'verify-success') {
    return <Shell><VerifyEmailResult status="success" /></Shell>;
  }
  if (status === 'verify-invalid') {
    return <Shell><VerifyEmailResult status="invalid" /></Shell>;
  }

  // ── Welcome modal for new Google/GitHub users ──────────────
  if (showWelcome) {
    return <WelcomeModal onClose={() => { setShowWelcome(false); navigate('/app'); }} />;
  }

  // ── Loading ────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <Shell>
        <Spinner />
        <p className="text-slate-400 text-sm mt-4">Signing you in…</p>
      </Shell>
    );
  }

  // ── Error ──────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <Shell>
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
               style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Sign-in failed</h2>
          <p className="text-slate-400 text-sm mb-6">{errorMsg}</p>
          <Link to="/login" className="btn-primary px-8 py-3">Back to Sign in</Link>
        </div>
      </Shell>
    );
  }

  // status === 'success' → navigate happens in useEffect
  return <Shell><Spinner /></Shell>;
}

function Shell({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      {children}
    </div>
  );
}
