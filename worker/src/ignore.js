// ============================================================
// KeyLens – Ignore List Handler
// GET    /ignore?profile_id=...
// POST   /ignore
// DELETE /ignore/:word
// ============================================================

import { json, err, uuid } from './utils.js';

export async function handleIgnore(request, env, user, path) {
  const method = request.method;
  const url    = new URL(request.url);

  // ── GET /ignore ───────────────────────────────────────────
  if (path === '/ignore' && method === 'GET') {
    const profileId = url.searchParams.get('profile_id');
    const rows = await env.DB.prepare(`
      SELECT id, word, profile_id, created_at
      FROM ignore_words
      WHERE user_id = ? AND (profile_id = ? OR profile_id IS NULL)
      ORDER BY word ASC
    `).bind(user.id, profileId || null).all();
    return json({ words: rows.results || [] });
  }

  // ── POST /ignore ──────────────────────────────────────────
  if (path === '/ignore' && method === 'POST') {
    const { words, profile_id = null } = await request.json().catch(() => ({}));
    if (!Array.isArray(words) || words.length === 0) return err('words Array erforderlich');

    const filtered = words.map(w => w.toLowerCase().trim()).filter(w => w.length > 1);
    if (filtered.length === 0) return err('Keine gültigen Wörter');

    const stmts = filtered.map(w =>
      env.DB.prepare(`
        INSERT OR IGNORE INTO ignore_words (id, user_id, profile_id, word)
        VALUES (?, ?, ?, ?)
      `).bind(uuid(), user.id, profile_id, w)
    );
    await env.DB.batch(stmts);

    return json({ ok: true, added: filtered });
  }

  // ── DELETE /ignore/:word ──────────────────────────────────
  const delMatch = path.match(/^\/ignore\/(.+)$/);
  if (delMatch && method === 'DELETE') {
    const word = decodeURIComponent(delMatch[1]).toLowerCase();
    const profileId = url.searchParams.get('profile_id');

    await env.DB.prepare(`
      DELETE FROM ignore_words
      WHERE user_id = ? AND word = ? AND (profile_id = ? OR profile_id IS NULL)
    `).bind(user.id, word, profileId || null).run();

    return json({ ok: true });
  }

  return err('Not Found', 404);
}
