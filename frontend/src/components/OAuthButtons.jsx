// ============================================================
// KeyScope – OAuthButtons
// Shared component for Google, GitHub, and FrameSphere sign-in/up buttons.
// Used in Login.jsx and Register.jsx.
// ============================================================

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function oauthUrl(provider) {
  return `${API_BASE}/auth/oauth/${provider}`;
}

// FrameSphere uses its own initiation endpoint (not the generic /oauth/ path)
const frameSphereUrl = `${API_BASE}/auth/framesphere`;

export default function OAuthButtons({ label = 'Continue' }) {
  const handleOAuth = (provider) => {
    sessionStorage.setItem('oauth_provider', provider);
    window.location.href = oauthUrl(provider);
  };

  const handleFrameSphere = () => {
    sessionStorage.setItem('oauth_provider', 'framesphere');
    window.location.href = frameSphereUrl;
  };

  return (
    <div className="space-y-2.5">
      {/* FrameSphere SSO */}
      <button
        type="button"
        onClick={handleFrameSphere}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl
                   border border-white/[0.15] bg-gradient-to-r from-blue-600/10 to-violet-600/10
                   text-white text-sm font-medium
                   hover:from-blue-600/20 hover:to-violet-600/20 hover:border-white/[0.25]
                   transition-all"
      >
        {/* FrameSphere FS logo */}
        <div className="w-[18px] h-[18px] rounded-[5px] bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-[9px] leading-none">FS</span>
        </div>
        {label} with FrameSphere
      </button>

      {/* Google */}
      <button
        type="button"
        onClick={() => handleOAuth('google')}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl
                   border border-white/[0.10] bg-white/[0.03] text-white text-sm font-medium
                   hover:bg-white/[0.07] hover:border-white/[0.18] transition-all"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
          <path d="M43.6 20.5H42V20H24v8h11.3C33.7 32.3 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 7.1 28.9 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.5-.2-2.9-.4-4.5z" fill="#FFC107"/>
          <path d="m6.3 14.7 6.6 4.8C14.5 16 19 13 24 13c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 7.1 28.9 5 24 5c-7.7 0-14.3 4.4-17.7 9.7z" fill="#FF3D00"/>
          <path d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.4 36.4 26.8 37 24 37c-5.3 0-9.7-2.8-11.3-6.8l-6.5 5C9.7 40.5 16.3 45 24 45z" fill="#4CAF50"/>
          <path d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C37 38.9 44 34 44 25c0-1.5-.2-2.9-.4-4.5z" fill="#1976D2"/>
        </svg>
        {label} with Google
      </button>

      {/* GitHub */}
      <button
        type="button"
        onClick={() => handleOAuth('github')}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl
                   border border-white/[0.10] bg-white/[0.03] text-white text-sm font-medium
                   hover:bg-white/[0.07] hover:border-white/[0.18] transition-all"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58
                   0-.28-.01-1.03-.02-2.03-3.34.73-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.75-1.33-1.75
                   -1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1
                   .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22
                   -.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0112 6.8c1.02.005
                   2.04.14 3.0.4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18
                   .77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22
                   0 1.6-.01 2.9-.01 3.29 0 .32.21.69.82.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        {label} with GitHub
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-white/[0.07]" />
        <span className="text-xs text-slate-600">or continue with email</span>
        <div className="flex-1 h-px bg-white/[0.07]" />
      </div>
    </div>
  );
}
