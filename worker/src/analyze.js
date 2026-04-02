// ============================================================
// KeyLens – /analyze Handler
// POST /analyze
// ============================================================

import { analyzeText }         from './engine.js';
import { json, err, uuid, checkRateLimit } from './utils.js';

// Rate limits per Plan und Tag
const RATE_LIMITS = {
  free: 20,
  pro:  500,
};

export async function handleAnalyze(request, env, user) {
  // Rate Limit prüfen
  const limit = RATE_LIMITS[user.plan] || 20;
  const allowed = await checkRateLimit(env, user.id, 'analyze', limit);
  if (!allowed) {
    return err(`Rate Limit erreicht (${limit}/Tag für ${user.plan} Plan)`, 429);
  }

  const body = await request.json().catch(() => null);
  if (!body) return err('Ungültiger Request Body');

  const {
    title        = '',
    content      = '',
    lang         = 'de',
    profile_id   = null,
    mode         = 'algorithmic',
    keyword_count   = 10,
    longtail_count  = 10,
  } = body;

  if (!content || content.trim().length < 50) {
    return err('Inhalt muss mindestens 50 Zeichen haben');
  }

  // Pro-Plan Pflicht für AI-Modus
  if (mode === 'ai' && user.plan !== 'pro') {
    return err('AI-Modus erfordert Pro-Plan', 403);
  }

  // ── Profil-Gewichte & Ignore-Liste laden ──────────────────
  let weights    = {};
  let ignoreList = [];

  if (profile_id) {
    // User-eigene Profile ODER System-Profile ('__system__') erlaubt
    const profile = await env.DB.prepare(
      `SELECT id, language FROM profiles
       WHERE id = ? AND (user_id = ? OR user_id = '__system__') LIMIT 1`
    ).bind(profile_id, user.id).first();

    if (!profile) return err('Profil nicht gefunden', 404);

    // Word Weights laden
    const weightRows = await env.DB.prepare(
      `SELECT word, score FROM word_weights WHERE profile_id = ?`
    ).bind(profile_id).all();
    for (const row of weightRows.results || []) {
      weights[row.word] = row.score;
    }

    // Ignore-Liste laden (nur für eigene Profile; System-Profile haben keine User-Ignores)
    const ignoreRows = await env.DB.prepare(`
      SELECT word FROM ignore_words
      WHERE user_id = ? AND (profile_id = ? OR profile_id IS NULL)
    `).bind(user.id, profile_id).all();
    ignoreList = (ignoreRows.results || []).map(r => r.word);
  }

  // ── AI Modus ──────────────────────────────────────────────
  if (mode === 'ai') {
    const hfUrl = env.HF_SPACES_URL;
    if (!hfUrl) return err('AI-Endpunkt nicht konfiguriert', 503);

    const hfRes = await fetch(`${hfUrl}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, lang, keyword_count, longtail_count }),
    }).catch(() => null);

    if (!hfRes || !hfRes.ok) return err('AI-Service nicht erreichbar', 502);

    const aiResult = await hfRes.json();

    await saveAnalysis(env, user.id, profile_id, mode, title, content, lang,
      aiResult.keywords, aiResult.longtail, aiResult.meta_description,
      keyword_count, longtail_count);

    return json({ ok: true, mode: 'ai', ...aiResult });
  }

  // ── Algorithmischer Modus ────────────────────────────────
  const result = analyzeText({
    title,
    content,
    lang,
    weights,
    ignoreList,
    topN:      Math.min(Math.max(parseInt(keyword_count) || 10, 1), 50),
    longtailN: Math.min(Math.max(parseInt(longtail_count) || 10, 1), 50),
  });

  await saveAnalysis(env, user.id, profile_id, 'algorithmic', title, content, lang,
    result.keywords, result.longtailKeywords, result.metaDescription,
    keyword_count, longtail_count);

  return json({
    ok:              true,
    mode:            'algorithmic',
    keywords:        result.keywords,
    longtailKeywords: result.longtailKeywords,
    metaDescription: result.metaDescription,
    profile_id,
    lang,
  });
}

async function saveAnalysis(env, userId, profileId, mode, title, content, lang,
  keywords, longtail, metaDesc, kwCount, ltCount) {
  try {
    await env.DB.prepare(`
      INSERT INTO analyses
        (id, user_id, profile_id, mode, input_text, input_title, language,
         keywords, longtail, meta_description, keyword_count, longtail_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(), userId, profileId, mode,
      content.slice(0, 5000), title, lang,
      JSON.stringify(keywords), JSON.stringify(longtail), metaDesc,
      kwCount, ltCount
    ).run();
  } catch (e) {
    console.error('saveAnalysis error:', e);
  }
}
