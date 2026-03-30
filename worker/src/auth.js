// ============================================================
// KeyLens – Auth Handler
// POST /auth/register
// POST /auth/login
// POST /auth/logout
// GET  /auth/me
// ============================================================

import { json, err, uuid, hashPassword, verifyPassword, generateToken, sessionExpiry } from './utils.js';

export async function handleAuth(request, env, path) {
  const method = request.method;

  // ── Register ─────────────────────────────────────────────
  if (path === '/auth/register' && method === 'POST') {
    const { email, password } = await request.json().catch(() => ({}));
    if (!email || !password) return err('Email und Passwort erforderlich');
    if (password.length < 8)  return err('Passwort muss mindestens 8 Zeichen haben');

    const existing = await env.DB.prepare(
      `SELECT id FROM users WHERE email = ? LIMIT 1`
    ).bind(email.toLowerCase()).first();
    if (existing) return err('Email bereits registriert', 409);

    const userId = uuid();
    const hash   = await hashPassword(password);
    await env.DB.prepare(`
      INSERT INTO users (id, email, password, plan) VALUES (?, ?, ?, 'free')
    `).bind(userId, email.toLowerCase(), hash).run();

    // Default-Profil anlegen
    const profileId = uuid();
    await env.DB.prepare(`
      INSERT INTO profiles (id, user_id, name, language, config)
      VALUES (?, ?, 'Mein erstes Profil', 'de', '{}')
    `).bind(profileId, userId).run();

    const token = generateToken();
    await env.DB.prepare(`
      INSERT INTO sessions (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).bind(uuid(), userId, token, sessionExpiry(72)).run();

    return json({ ok: true, token, user: { id: userId, email: email.toLowerCase(), plan: 'free' } }, 201);
  }

  // ── Login ─────────────────────────────────────────────────
  if (path === '/auth/login' && method === 'POST') {
    const { email, password } = await request.json().catch(() => ({}));
    if (!email || !password) return err('Email und Passwort erforderlich');

    const user = await env.DB.prepare(
      `SELECT id, email, password, plan FROM users WHERE email = ? LIMIT 1`
    ).bind(email.toLowerCase()).first();

    if (!user || !(await verifyPassword(password, user.password))) {
      return err('Ungültige Anmeldedaten', 401);
    }

    const token = generateToken();
    await env.DB.prepare(`
      INSERT INTO sessions (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).bind(uuid(), user.id, token, sessionExpiry(72)).run();

    return json({ ok: true, token, user: { id: user.id, email: user.email, plan: user.plan } });
  }

  // ── Logout ────────────────────────────────────────────────
  if (path === '/auth/logout' && method === 'POST') {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (token) {
      await env.DB.prepare(`DELETE FROM sessions WHERE token = ?`).bind(token).run();
    }
    return json({ ok: true });
  }

  // ── Me ────────────────────────────────────────────────────
  if (path === '/auth/me' && method === 'GET') {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return err('Nicht angemeldet', 401);

    const session = await env.DB.prepare(`
      SELECT u.id, u.email, u.plan
      FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token = ? AND s.expires_at > datetime('now')
      LIMIT 1
    `).bind(token).first();

    if (!session) return err('Session abgelaufen', 401);
    return json({ user: session });
  }

  return err('Not Found', 404);
}
