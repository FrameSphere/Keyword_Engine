// ============================================================
// KeyLens – Profiles Handler
// GET    /profiles
// POST   /profiles
// PUT    /profiles/:id
// DELETE /profiles/:id
// ============================================================

import { json, err, uuid } from './utils.js';

export async function handleProfiles(request, env, user, path) {
  const method = request.method;
  const idMatch = path.match(/^\/profiles\/([^/]+)$/);
  const profileId = idMatch?.[1];

  // GET /profiles
  if (path === '/profiles' && method === 'GET') {
    // Eigene Profile des Users
    const userRows = await env.DB.prepare(
      `SELECT id, name, description, language, template_id, created_at, updated_at, 0 as is_system
       FROM profiles WHERE user_id = ? ORDER BY created_at DESC`
    ).bind(user.id).all();

    // Vortranierte System-Profile (user_id = '__system__')
    const sysRows = await env.DB.prepare(
      `SELECT id, name, description, language, template_id, created_at, updated_at, 1 as is_system
       FROM profiles WHERE user_id = '__system__' ORDER BY name ASC`
    ).all();

    const profiles = [
      ...(userRows.results || []),
      ...(sysRows.results || []),
    ];
    return json({ profiles });
  }

  // POST /profiles
  if (path === '/profiles' && method === 'POST') {
    const { name, description = '', language = 'de', template_id = null } = await request.json().catch(() => ({}));
    if (!name) return err('Name erforderlich');

    const count = await env.DB.prepare(
      `SELECT COUNT(*) as c FROM profiles WHERE user_id = ?`
    ).bind(user.id).first();
    const maxProfiles = user.plan === 'pro' ? 50 : 3;
    if ((count?.c || 0) >= maxProfiles) return err(`Maximum ${maxProfiles} Profile für ${user.plan} Plan`);

    const id = uuid();
    let config = '{}';

    if (template_id) {
      const { TEMPLATES } = await import('./templates.js');
      const tmpl = TEMPLATES[template_id];
      if (tmpl) config = JSON.stringify(tmpl.config || {});
    }

    await env.DB.prepare(`
      INSERT INTO profiles (id, user_id, name, description, language, template_id, config)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(id, user.id, name, description, language, template_id, config).run();

    if (template_id) {
      const { TEMPLATES } = await import('./templates.js');
      const tmpl = TEMPLATES[template_id];
      if (tmpl?.ignoreWords?.length) {
        const stmts = tmpl.ignoreWords.map(w =>
          env.DB.prepare(`
            INSERT OR IGNORE INTO ignore_words (id, user_id, profile_id, word)
            VALUES (?, ?, ?, ?)
          `).bind(uuid(), user.id, id, w)
        );
        await env.DB.batch(stmts);
      }
    }

    return json({ ok: true, profile: { id, name, description, language, template_id } }, 201);
  }

  // PUT /profiles/:id
  if (profileId && method === 'PUT') {
    const existing = await env.DB.prepare(
      `SELECT id FROM profiles WHERE id = ? AND user_id = ? LIMIT 1`
    ).bind(profileId, user.id).first();
    if (!existing) return err('Profil nicht gefunden', 404);

    const { name, description, language } = await request.json().catch(() => ({}));
    const updates = [];
    const values  = [];
    if (name)        { updates.push('name = ?');        values.push(name); }
    if (description) { updates.push('description = ?'); values.push(description); }
    if (language)    { updates.push('language = ?');    values.push(language); }
    if (!updates.length) return err('Keine Änderungen');

    updates.push("updated_at = datetime('now')");
    values.push(profileId, user.id);

    await env.DB.prepare(
      `UPDATE profiles SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`
    ).bind(...values).run();

    return json({ ok: true });
  }

  // DELETE /profiles/:id
  if (profileId && method === 'DELETE') {
    const existing = await env.DB.prepare(
      `SELECT id FROM profiles WHERE id = ? AND user_id = ? LIMIT 1`
    ).bind(profileId, user.id).first();
    if (!existing) return err('Profil nicht gefunden', 404);

    await env.DB.prepare(
      `DELETE FROM profiles WHERE id = ? AND user_id = ?`
    ).bind(profileId, user.id).run();

    return json({ ok: true });
  }

  return err('Not Found', 404);
}
