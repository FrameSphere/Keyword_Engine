// ============================================================
// KeyScope – EmailVerificationBanner
// Shown in Dashboard when user.email_verified === false
// ============================================================

import { useState } from 'react';
import { api } from '../api.js';

export default function EmailVerificationBanner() {
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [hidden,  setHidden]  = useState(false);

  if (hidden) return null;

  const handleResend = async () => {
    setLoading(true);
    try {
      await api.auth.resendVerification();
      setSent(true);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
      style={{
        background: 'rgba(234,179,8,0.08)',
        border: '1px solid rgba(234,179,8,0.22)',
      }}
    >
      <span className="text-yellow-400 flex-shrink-0 text-base">✉</span>
      <p className="text-yellow-200 flex-1">
        {sent
          ? 'Verification email sent! Check your inbox (and spam folder).'
          : 'Please verify your email address to keep full access to your account.'}
      </p>
      {!sent && (
        <button
          onClick={handleResend}
          disabled={loading}
          className="flex-shrink-0 text-xs font-semibold text-yellow-300 hover:text-yellow-100 transition-colors disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Resend email'}
        </button>
      )}
      <button
        onClick={() => setHidden(true)}
        className="flex-shrink-0 text-yellow-600 hover:text-yellow-400 transition-colors ml-1"
        title="Dismiss"
      >✕</button>
    </div>
  );
}
