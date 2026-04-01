// ============================================================
// KeyLens – Word Weights Handler (Profil-Training)
// POST   /weights/train         → Texte hochladen & analysieren
// GET    /weights/:profileId    → Gewichte abrufen
// DELETE /weights/:profileId    → Gewichte zurücksetzen
// ============================================================

import { analyzeCorpus }       from './engine.js';
import { json, err, uuid }     from './utils.js';

export async function handleWeights(request, env, user, path) {
  const method = request.method;

  // ── POST /weights/train ───────────────────────────────────
  if (path === '/weights/train' && method === 'POST') {
    const body = await request.json().catch(() => null);
    if (!body) return err('Ungültiger Body');

    const { profile_id, documents, lang = 'de' } = body;
    if (!profile_id) return err('profile_id erforderlich');
    if (!Array.isArray(documents) || documents.length === 0) {
      return err('Mindestens ein Dokument erforderlich');
    }

    const maxDocs = user.plan === 'pro' ? 200 : 20;
    if (documents.length > maxDocs) {
      return err(`Maximum ${maxDocs} Dokumente für ${user.plan} Plan`);
    }

    // Profil-Ownership prüfen
    const profile = await env.DB.prepare(
      `SELECT id FROM profiles WHERE id = ? AND user_id = ? LIMIT 1`
    ).bind(profile_id, user.id).first();
    if (!profile) return err('Profil nicht gefunden', 404);

    // Dokumente validieren und normalisieren
    const docs = documents.map(d => ({
      content: typeof d === 'string' ? d : (d.content || ''),
      lang:    typeof d === 'object' ? (d.lang || lang) : lang,
    })).filter(d => d.content.trim().length > 20);

    if (docs.length === 0) return err('Keine gültigen Dokumente');

    // Analyse durchführen
    const { weightRows, stats } = analyzeCorpus(docs);

    // Alte Gewichte löschen und neue speichern
    await env.DB.prepare(
      `DELETE FROM word_weights WHERE profile_id = ?`
    ).bind(profile_id).run();

    // Batch-Insert (D1 max ~100 per batch)
    const BATCH_SIZE = 100;
    for (let i = 0; i < weightRows.length; i += BATCH_SIZE) {
      const batch = weightRows.slice(i, i + BATCH_SIZE);
      const stmts = batch.map(({ word, score, df, cf }) =>
        env.DB.prepare(`
          INSERT OR REPLACE INTO word_weights (profile_id, word, score, doc_freq, corpus_freq)
          VALUES (?, ?, ?, ?, ?)
        `).bind(profile_id, word, score, df, cf)
      );
      await env.DB.batch(stmts);
    }

    // Texte in Training-History speichern (optional)
    const textStmts = docs.slice(0, 50).map(d =>
      env.DB.prepare(`
        INSERT INTO training_texts (id, profile_id, user_id, content, lang)
        VALUES (?, ?, ?, ?, ?)
      `).bind(uuid(), profile_id, user.id, d.content.slice(0, 3000), d.lang)
    );
    if (textStmts.length) await env.DB.batch(textStmts);

    return json({
      ok: true,
      stats: {
        documentsProcessed: docs.length,
        uniqueWords:        weightRows.length,
        topWords:           stats.topWords.slice(0, 10),
      },
    });
  }

  // ── GET /weights/:profileId ───────────────────────────────
  const getMatch = path.match(/^\/weights\/([^/]+)$/);
  if (getMatch && method === 'GET') {
    const profileId = getMatch[1];

    // System-Profile sind öffentlich; User-Profile nur für den Besitzer
    const profile = await env.DB.prepare(
      `SELECT id, user_id FROM profiles WHERE id = ? AND (user_id = ? OR user_id = '__system__') LIMIT 1`
    ).bind(profileId, user.id).first();
    if (!profile) return err('Profil nicht gefunden', 404);

    const url    = new URL(request.url);
    const limit  = Math.min(parseInt(url.searchParams.get('limit')  || '500', 10), 2000);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const search = (url.searchParams.get('q') || '').trim().toLowerCase();

    let query, params;
    if (search) {
      query  = `SELECT word, score, doc_freq, corpus_freq
                FROM word_weights WHERE profile_id = ? AND word LIKE ?
                ORDER BY score DESC LIMIT ? OFFSET ?`;
      params = [profileId, `%${search}%`, limit, offset];
    } else {
      query  = `SELECT word, score, doc_freq, corpus_freq
                FROM word_weights WHERE profile_id = ?
                ORDER BY score DESC LIMIT ? OFFSET ?`;
      params = [profileId, limit, offset];
    }

    const [rows, countRow] = await Promise.all([
      env.DB.prepare(query).bind(...params).all(),
      env.DB.prepare(
        `SELECT COUNT(*) as total FROM word_weights WHERE profile_id = ?`
      ).bind(profileId).first(),
    ]);

    return json({
      profile_id: profileId,
      total:      countRow?.total ?? 0,
      limit,
      offset,
      words:      rows.results || [],
    });
  }

  // ── DELETE /weights/:profileId ────────────────────────────
  const delMatch = path.match(/^\/weights\/([^/]+)$/);
  if (delMatch && method === 'DELETE') {
    const profileId = delMatch[1];
    const profile = await env.DB.prepare(
      `SELECT id FROM profiles WHERE id = ? AND user_id = ? LIMIT 1`
    ).bind(profileId, user.id).first();
    if (!profile) return err('Profil nicht gefunden', 404);

    await env.DB.prepare(`DELETE FROM word_weights WHERE profile_id = ?`).bind(profileId).run();
    await env.DB.prepare(`DELETE FROM training_texts WHERE profile_id = ? AND user_id = ?`).bind(profileId, user.id).run();

    return json({ ok: true, message: 'Gewichte zurückgesetzt' });
  }

  return err('Not Found', 404);
}
