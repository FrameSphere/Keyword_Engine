// ============================================================
// KeyScope – Auth Handler
// POST /auth/register
// POST /auth/login
// POST /auth/logout
// GET  /auth/me
// GET  /auth/verify-email?token=xxx
// POST /auth/resend-verification
// GET  /auth/oauth/google   → redirect to Google
// GET  /auth/oauth/github   → redirect to GitHub
// POST /auth/oauth/exchange → exchange code for session
// ============================================================

import { json, err, uuid, hashPassword, verifyPassword, generateToken, sessionExpiry } from './utils.js';

const VERIFY_EXPIRY_HOURS = 24;

// ── Email via Resend ──────────────────────────────────────────
async function sendVerificationEmail(env, email, token) {
  const RESEND_KEY = env.RESEND_API_KEY;
  if (!RESEND_KEY) {
    console.warn('[Auth] RESEND_API_KEY not set – skipping verification email');
    return;
  }
  const link = `${env.FRONTEND_URL}/auth/verify-email?token=${token}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#0b0f1a;font-family:Inter,system-ui,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b0f1a;padding:40px 0;">
        <tr><td align="center">
          <table width="520" cellpadding="0" cellspacing="0"
                 style="background:#111827;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
            <!-- Header gradient bar -->
            <tr><td style="height:4px;background:linear-gradient(90deg,#2563EB,#7C3AED);"></td></tr>
            <!-- Logo -->
            <tr><td style="padding:32px 40px 0;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="display:inline-table;">
                <tr>
                  <td style="width:36px;height:36px;background:linear-gradient(135deg,#2563EB,#7C3AED);border-radius:10px;text-align:center;vertical-align:middle;">
                    <span style="color:white;font-weight:700;font-size:13px;">KS</span>
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="color:white;font-weight:700;font-size:18px;">Key<span style="background:linear-gradient(135deg,#2563EB,#7C3AED);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Scope</span></span>
                  </td>
                </tr>
              </table>
            </td></tr>
            <!-- Body -->
            <tr><td style="padding:28px 40px 12px;">
              <h1 style="color:white;font-size:22px;font-weight:700;margin:0 0 8px;">Confirm your email address</h1>
              <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 24px;">
                Thanks for signing up for KeyScope! Click the button below to verify your email and unlock full access.
              </p>
              <a href="${link}"
                 style="display:inline-block;background:linear-gradient(135deg,#2563EB,#7C3AED);color:white;
                        text-decoration:none;font-weight:600;font-size:14px;padding:13px 28px;
                        border-radius:10px;box-shadow:0 0 20px rgba(37,99,235,0.3);">
                Verify Email Address →
              </a>
              <p style="color:#475569;font-size:12px;margin:20px 0 0;">
                This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
              </p>
            </td></tr>
            <!-- Divider -->
            <tr><td style="padding:0 40px;">
              <div style="height:1px;background:rgba(255,255,255,0.06);margin:20px 0;"></div>
            </td></tr>
            <!-- Footer -->
            <tr><td style="padding:0 40px 28px;">
              <p style="color:#334155;font-size:11px;margin:0;line-height:1.6;">
                Or copy this link into your browser:<br>
                <span style="color:#475569;word-break:break-all;">${link}</span>
              </p>
            </td></tr>
          </table>
          <p style="color:#334155;font-size:11px;margin-top:20px;">© ${new Date().getFullYear()} KeyScope · All rights reserved</p>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'KeyScope <onboarding@resend.dev>',
      to:   [email],
      subject: 'Confirm your KeyScope email address',
      html,
    }),
  });
}

// ── Store a verification token ────────────────────────────────
async function createVerificationToken(env, userId) {
  // Invalidate old tokens for this user
  await env.DB.prepare(`DELETE FROM email_verifications WHERE user_id = ?`).bind(userId).run();

  const token     = generateToken(32);
  const expiresAt = new Date(Date.now() + VERIFY_EXPIRY_HOURS * 3600_000)
    .toISOString().replace('T', ' ').split('.')[0];

  await env.DB.prepare(`
    INSERT INTO email_verifications (id, user_id, token, expires_at)
    VALUES (?, ?, ?, ?)
  `).bind(uuid(), userId, token, expiresAt).run();

  return token;
}

// ── Upsert user from OAuth provider ──────────────────────────
async function upsertOAuthUser(env, { email, provider, providerId, name }) {
  // Check by oauth_id + provider first, then fall back to email
  let user = await env.DB.prepare(
    `SELECT id, email, plan FROM users WHERE oauth_provider = ? AND oauth_id = ? LIMIT 1`
  ).bind(provider, providerId).first();

  if (!user) {
    // Check if email already exists (might have registered with password)
    user = await env.DB.prepare(
      `SELECT id, email, plan FROM users WHERE email = ? LIMIT 1`
    ).bind(email.toLowerCase()).first();

    if (user) {
      // Link OAuth to existing account
      await env.DB.prepare(`
        UPDATE users SET oauth_provider = ?, oauth_id = ?, email_verified = 1 WHERE id = ?
      `).bind(provider, providerId, user.id).run();
    }
  }

  if (!user) {
    // New user via OAuth – auto-verified
    const userId    = uuid();
    const profileId = uuid();
    await env.DB.prepare(`
      INSERT INTO users (id, email, password, plan, email_verified, oauth_provider, oauth_id)
      VALUES (?, ?, NULL, 'free', 1, ?, ?)
    `).bind(userId, email.toLowerCase(), provider, providerId).run();

    await env.DB.prepare(`
      INSERT INTO profiles (id, user_id, name, language, config)
      VALUES (?, ?, 'My first profile', 'en', '{}')
    `).bind(profileId, userId).run();

    user = { id: userId, email: email.toLowerCase(), plan: 'free' };
  }

  // Create session
  const token = generateToken();
  await env.DB.prepare(`
    INSERT INTO sessions (id, user_id, token, expires_at)
    VALUES (?, ?, ?, ?)
  `).bind(uuid(), user.id, token, sessionExpiry(72)).run();

  // Fetch fresh user row (may have been just inserted)
  const fullUser = await env.DB.prepare(
    `SELECT id, email, plan, email_verified FROM users WHERE id = ? LIMIT 1`
  ).bind(user.id).first();

  return { token, user: fullUser };
}

// ── Main Route Handler ────────────────────────────────────────
export async function handleAuth(request, env, path) {
  const method = request.method;
  const FRONTEND = env.FRONTEND_URL || 'https://keyscope.pages.dev';

  // ── Register ───────────────────────────────────────────────
  if (path === '/auth/register' && method === 'POST') {
    const { email, password } = await request.json().catch(() => ({}));
    if (!email || !password) return err('Email and password are required');
    if (password.length < 8)  return err('Password must be at least 8 characters');

    const existing = await env.DB.prepare(
      `SELECT id FROM users WHERE email = ? LIMIT 1`
    ).bind(email.toLowerCase()).first();
    if (existing) return err('Email already registered', 409);

    const userId = uuid();
    const hash   = await hashPassword(password);
    await env.DB.prepare(`
      INSERT INTO users (id, email, password, plan, email_verified)
      VALUES (?, ?, ?, 'free', 0)
    `).bind(userId, email.toLowerCase(), hash).run();

    // Default profile
    await env.DB.prepare(`
      INSERT INTO profiles (id, user_id, name, language, config)
      VALUES (?, ?, 'My first profile', 'en', '{}')
    `).bind(uuid(), userId).run();

    // Session (user can use app while waiting for verification)
    const token = generateToken();
    await env.DB.prepare(`
      INSERT INTO sessions (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).bind(uuid(), userId, token, sessionExpiry(72)).run();

    // Send verification email (async, don't block)
    const verifyToken = await createVerificationToken(env, userId);
    ctx_sendEmail: {
      try {
        await sendVerificationEmail(env, email.toLowerCase(), verifyToken);
      } catch (e) {
        console.error('[Auth] Failed to send verification email:', e.message);
      }
    }

    return json({
      ok: true,
      token,
      user: { id: userId, email: email.toLowerCase(), plan: 'free', email_verified: false },
    }, 201);
  }

  // ── Login ──────────────────────────────────────────────────
  if (path === '/auth/login' && method === 'POST') {
    const { email, password } = await request.json().catch(() => ({}));
    if (!email || !password) return err('Email and password are required');

    const user = await env.DB.prepare(
      `SELECT id, email, password, plan, email_verified FROM users WHERE email = ? LIMIT 1`
    ).bind(email.toLowerCase()).first();

    if (!user) return err('Invalid credentials', 401);

    // OAuth-only accounts have no password
    if (!user.password) return err('This account uses Google or GitHub sign-in. Please use the OAuth button.', 400);

    if (!(await verifyPassword(password, user.password))) {
      return err('Invalid credentials', 401);
    }

    const token = generateToken();
    await env.DB.prepare(`
      INSERT INTO sessions (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).bind(uuid(), user.id, token, sessionExpiry(72)).run();

    return json({ ok: true, token, user: { id: user.id, email: user.email, plan: user.plan, email_verified: !!user.email_verified } });
  }

  // ── Logout ─────────────────────────────────────────────────
  if (path === '/auth/logout' && method === 'POST') {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (token) {
      await env.DB.prepare(`DELETE FROM sessions WHERE token = ?`).bind(token).run();
    }
    return json({ ok: true });
  }

  // ── Me ─────────────────────────────────────────────────────
  if (path === '/auth/me' && method === 'GET') {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return err('Not authenticated', 401);

    const session = await env.DB.prepare(`
      SELECT u.id, u.email, u.plan, u.email_verified
      FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token = ? AND s.expires_at > datetime('now')
      LIMIT 1
    `).bind(token).first();

    if (!session) return err('Session expired', 401);
    return json({ user: { ...session, email_verified: !!session.email_verified } });
  }

  // ── Verify Email ───────────────────────────────────────────
  if (path === '/auth/verify-email' && method === 'GET') {
    const url   = new URL(request.url);
    const token = url.searchParams.get('token');
    if (!token) return err('Missing token');

    const record = await env.DB.prepare(`
      SELECT user_id FROM email_verifications
      WHERE token = ? AND expires_at > datetime('now')
      LIMIT 1
    `).bind(token).first();

    if (!record) {
      // Redirect to frontend with error
      return Response.redirect(`${FRONTEND}/auth/verify-email?status=invalid`, 302);
    }

    await env.DB.prepare(`UPDATE users SET email_verified = 1 WHERE id = ?`).bind(record.user_id).run();
    await env.DB.prepare(`DELETE FROM email_verifications WHERE user_id = ?`).bind(record.user_id).run();

    return Response.redirect(`${FRONTEND}/auth/verify-email?status=success`, 302);
  }

  // ── Resend Verification Email ──────────────────────────────
  if (path === '/auth/resend-verification' && method === 'POST') {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return err('Not authenticated', 401);

    const session = await env.DB.prepare(`
      SELECT u.id, u.email, u.email_verified
      FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token = ? AND s.expires_at > datetime('now')
      LIMIT 1
    `).bind(token).first();

    if (!session) return err('Session expired', 401);
    if (session.email_verified) return json({ ok: true, message: 'Already verified' });

    const verifyToken = await createVerificationToken(env, session.id);
    try {
      await sendVerificationEmail(env, session.email, verifyToken);
    } catch (e) {
      return err('Failed to send email. Please try again.', 500);
    }

    return json({ ok: true, message: 'Verification email sent' });
  }

  // ── OAuth: Initiate Google ─────────────────────────────────
  if (path === '/auth/oauth/google' && method === 'GET') {
    const clientId    = env.GOOGLE_CLIENT_ID;
    const redirectUri = `${FRONTEND}/auth/callback`;
    const scope       = 'openid email profile';
    const state       = generateToken(16); // CSRF protection
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.set('client_id',     clientId);
    url.searchParams.set('redirect_uri',  redirectUri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope',         scope);
    url.searchParams.set('state',         state);
    url.searchParams.set('access_type',   'online');
    url.searchParams.set('prompt',        'select_account');
    return Response.redirect(url.toString(), 302);
  }

  // ── OAuth: Initiate GitHub ─────────────────────────────────
  if (path === '/auth/oauth/github' && method === 'GET') {
    const clientId    = env.GITHUB_CLIENT_ID;
    const redirectUri = `${FRONTEND}/auth/callback`;
    const state       = generateToken(16);
    const url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.set('client_id',    clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('scope',        'user:email');
    url.searchParams.set('state',        state);
    return Response.redirect(url.toString(), 302);
  }

  // ── OAuth: Exchange code for session ──────────────────────
  if (path === '/auth/oauth/exchange' && method === 'POST') {
    const { provider, code, redirect_uri } = await request.json().catch(() => ({}));
    if (!provider || !code) return err('Missing provider or code');

    try {
      let email, providerId;

      if (provider === 'google') {
        const clientId     = env.GOOGLE_CLIENT_ID;
        const clientSecret = env.GOOGLE_CLIENT_SECRET;
        if (!clientId || !clientSecret) return err('Google OAuth not configured', 500);

        // Exchange code → tokens
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code, client_id: clientId, client_secret: clientSecret,
            redirect_uri: redirect_uri || `${FRONTEND}/auth/callback`,
            grant_type: 'authorization_code',
          }).toString(),
        });
        const tokens = await tokenRes.json();
        if (!tokenRes.ok || tokens.error) throw new Error(tokens.error_description || 'Google token exchange failed');

        // Get user info
        const infoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        const info = await infoRes.json();
        email      = info.email;
        providerId = info.id;

      } else if (provider === 'github') {
        const clientId     = env.GITHUB_CLIENT_ID;
        const clientSecret = env.GITHUB_CLIENT_SECRET;
        if (!clientId || !clientSecret) return err('GitHub OAuth not configured', 500);

        // Exchange code → access token
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: new URLSearchParams({
            code, client_id: clientId, client_secret: clientSecret,
            redirect_uri: redirect_uri || `${FRONTEND}/auth/callback`,
          }).toString(),
        });
        const tokenData = await tokenRes.json();
        if (tokenData.error) throw new Error(tokenData.error_description || 'GitHub token exchange failed');

        // Get user info
        const infoRes = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            'User-Agent': 'KeyScope',
          },
        });
        const info = await infoRes.json();
        providerId = String(info.id);

        // GitHub may have private email – fetch it explicitly
        if (!info.email) {
          const emailsRes = await fetch('https://api.github.com/user/emails', {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              'User-Agent': 'KeyScope',
            },
          });
          const emails = await emailsRes.json();
          const primary = emails.find(e => e.primary && e.verified);
          email = primary?.email || emails[0]?.email;
        } else {
          email = info.email;
        }
      } else {
        return err('Unknown provider');
      }

      if (!email) return err('Could not retrieve email from OAuth provider');

      const result = await upsertOAuthUser(env, { email, provider, providerId });
      return json({ ok: true, ...result });

    } catch (e) {
      console.error('[OAuth] Exchange error:', e.message);
      return err(e.message || 'OAuth exchange failed', 500);
    }
  }

  return err('Not Found', 404);
}
