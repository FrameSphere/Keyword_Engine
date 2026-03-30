// ============================================================
// KeyLens – History + API Key Handler
// ============================================================

import { json, err, generateToken, uuid } from './utils.js';

// ── GET /history ──────────────────────────────────────────────
export async function handleHistory(request, env, user, path) {
  const url    = new URL(request.url);
  const limit  = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
  const offset = parseInt(url.searchParams.get('offset') || '0');

  const rows = await env.DB.prepare(`
    SELECT id, profile_id, mode, input_title, language,
           keywords, longtail, meta_description, keyword_count, longtail_count, created_at
    FROM analyses
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).bind(user.id, limit, offset).all();

  const total = await env.DB.prepare(
    `SELECT COUNT(*) as c FROM analyses WHERE user_id = ?`
  ).bind(user.id).first();

  const results = (rows.results || []).map(r => ({
    ...r,
    keywords: tryParse(r.keywords, []),
    longtail: tryParse(r.longtail, []),
  }));

  return json({ analyses: results, total: total?.c || 0, limit, offset });
}

// ── API Key Handler ───────────────────────────────────────────
export async function handleApiKey(request, env, user, path) {
  const method = request.method;

  // GET /apikey – aktuellen Key anzeigen
  if (path === '/apikey' && method === 'GET') {
    const u = await env.DB.prepare(
      `SELECT api_key FROM users WHERE id = ? LIMIT 1`
    ).bind(user.id).first();
    return json({ api_key: u?.api_key || null });
  }

  // POST /apikey – neuen Key generieren
  if (path === '/apikey' && method === 'POST') {
    const newKey = 'kl_' + generateToken(32);
    await env.DB.prepare(
      `UPDATE users SET api_key = ? WHERE id = ?`
    ).bind(newKey, user.id).run();
    return json({ ok: true, api_key: newKey });
  }

  // DELETE /apikey – Key widerrufen
  if (path === '/apikey' && method === 'DELETE') {
    await env.DB.prepare(
      `UPDATE users SET api_key = NULL WHERE id = ?`
    ).bind(user.id).run();
    return json({ ok: true });
  }

  return err('Not Found', 404);
}

function tryParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}
