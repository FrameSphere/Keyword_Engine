// ============================================================
// KeyLens – Core Algorithm Engine
// TF-IDF + Weighted Longtail + Meta Description
// Basiert auf dem privaten KeywordSystem + seo.js
// ============================================================

import { ALL_STOPWORDS, getStopwords } from './stopwords.js';

// ── Config Defaults ──────────────────────────────────────────

const DEFAULT_CONFIG = {
  minWordLength:    3,
  topN:             10,
  longtailTopN:     10,
  idfSmoothing:     1,
  titleWeight:      3,    // Titel wird N-fach wiederholt
  titleBonus:       6,
  positionBonus:    2,
  lengthBonus:      1,
  positionCutoff:   0.2,  // Erste 20% des Textes
  lengthThreshold:  6,
  minNgramScore:    0.03,
  weightThreshold:  0.05, // Minimaler Wort-Score aus Profil
};

// ── Tokenizer ────────────────────────────────────────────────

function tokenize(text, lang = 'de') {
  const stops = getStopwords(lang);
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[^\wäöüßàâéèêëîïôùûçáàóòúùñ\s]/gi, ' ')
    .split(/\s+/)
    .filter(w => w.length >= DEFAULT_CONFIG.minWordLength)
    .filter(w => !/^\d+$/.test(w))
    .filter(w => !stops.has(w));
}

// ── TF-IDF Analyse (für Profil-Training) ─────────────────────
// Gibt word-weights Map zurück: { word: normalizedScore }

export function analyzeCorpus(documents, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const N = documents.length;

  const tokenizedDocs = documents.map(doc => ({
    tokens: tokenize(doc.content, doc.lang || 'de'),
  }));

  const df       = {};
  const cf       = {};
  const tfPerDoc = {};

  tokenizedDocs.forEach((doc, idx) => {
    const wordCount = {};
    for (const word of doc.tokens) wordCount[word] = (wordCount[word] || 0) + 1;
    const docLen = doc.tokens.length || 1;
    for (const [word, count] of Object.entries(wordCount)) {
      cf[word] = (cf[word] || 0) + count;
      df[word] = (df[word] || 0) + 1;
      if (!tfPerDoc[word]) tfPerDoc[word] = {};
      tfPerDoc[word][idx] = count / docLen;
    }
  });

  const scores = {};
  for (const word of Object.keys(df)) {
    if (cf[word] < 1) continue;
    const idf    = N === 1
      ? Math.log(1 + cf[word])
      : Math.log((N + cfg.idfSmoothing) / (df[word] + cfg.idfSmoothing));
    const tfVals = Object.values(tfPerDoc[word]);
    const avgTf  = tfVals.reduce((s, v) => s + v, 0) / tfVals.length;
    const lenBonus = Math.min(word.length / 6, 1.5);
    scores[word] = idf * avgTf * lenBonus;
  }

  const sorted   = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, cfg.topN || 5000);
  const maxScore = sorted[0]?.[1] || 1;

  const weights = {};
  const weightRows = []; // für D1 Batch-Insert
  for (const [word, score] of sorted) {
    const normalized = Math.round((score / maxScore) * 1000) / 1000;
    weights[word] = normalized;
    weightRows.push({ word, score: normalized, df: df[word], cf: cf[word] });
  }

  return {
    weights,
    weightRows,
    stats: {
      documents:   N,
      totalTokens: tokenizedDocs.reduce((s, d) => s + d.tokens.length, 0),
      uniqueWords: sorted.length,
      topWords:    sorted.slice(0, 30).map(([w, s]) => ({
        word:  w,
        score: Math.round((s / maxScore) * 1000) / 1000,
        df:    df[w],
        cf:    cf[w],
      })),
    },
  };
}

// ── Single Text Analysis ──────────────────────────────────────
// Gibt Keywords + Longtail Keywords zurück

export function analyzeText({
  title    = '',
  content  = '',
  lang     = 'de',
  weights  = {},          // Profil-Gewichte { word: score }
  ignoreList = [],        // User-Ignore-Liste
  topN     = 10,
  longtailN = 10,
  config   = {},
}) {
  const cfg     = { ...DEFAULT_CONFIG, ...config };
  const normLang = lang.split('-')[0].toLowerCase();
  const ignoreSet = new Set(ignoreList.map(w => w.toLowerCase()));

  // Gewichte filtern
  const filteredWeights = {};
  for (const [w, s] of Object.entries(weights)) {
    if (typeof s === 'number' && s >= cfg.weightThreshold && !ignoreSet.has(w)) {
      filteredWeights[w] = s;
    }
  }

  // Titel mit Gewicht wiederholen
  const titleRepeat = `${title} `.repeat(cfg.titleWeight);
  const fullText    = `${titleRepeat}${content}`;
  const allTokens   = tokenize(fullText, normLang);
  const titleTokens = tokenize(title, normLang);

  // Ignore-Filter
  const filtered = allTokens.filter(w => !ignoreSet.has(w));

  if (filtered.length === 0) {
    return { keywords: [], longtailKeywords: [], metaDescription: title.slice(0, 160) };
  }

  // ── Score ─────────────────────────────────────────────────
  const stops    = getStopwords(normLang);
  const total    = filtered.length || 1;
  const titleSet = new Set(titleTokens.filter(t => !stops.has(t) && t.length >= 3));
  const earlySet = new Set(allTokens.slice(0, Math.ceil(allTokens.length * cfg.positionCutoff)));

  const freq = {};
  for (const word of filtered) freq[word] = (freq[word] || 0) + 1;

  const scores = {};
  for (const [word, count] of Object.entries(freq)) {
    const tf = (count / total) * 100;
    const w  = filteredWeights[word] ?? null;
    let score = w !== null ? tf * (1 + w * 3) : tf;

    if (titleSet.has(word))  score += cfg.titleBonus;
    if (earlySet.has(word))  score += cfg.positionBonus;
    if (word.length > cfg.lengthThreshold) score += cfg.lengthBonus;

    scores[word] = score;
  }

  const rawKeywords = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([w]) => w);

  // Deduplication (Plural/Flexion)
  const topKeywords = [];
  for (const word of rawKeywords) {
    if (ignoreSet.has(word)) continue;
    const isDupe = topKeywords.some(existing => {
      const diff = Math.abs(word.length - existing.length);
      if (diff > 3) return false;
      return existing.startsWith(word) || word.startsWith(existing);
    });
    if (!isDupe) topKeywords.push(word);
    if (topKeywords.length >= topN) break;
  }

  // ── Longtail (Bigrams + Trigrams) ─────────────────────────
  const bigrams  = buildWeightedNgrams(filtered, 2, normLang, filteredWeights, ignoreSet, cfg);
  const trigrams = buildWeightedNgrams(filtered, 3, normLang, filteredWeights, ignoreSet, cfg);

  const allPhrases  = [...trigrams.slice(0, 8), ...bigrams.slice(0, 12)];
  const longtailRaw = [];
  for (const phrase of allPhrases) {
    const words = phrase.split(' ');
    if (words.some(w => ignoreSet.has(w))) continue;
    const isDupe = longtailRaw.some(ex => {
      const exW = ex.split(' ');
      return exW.length === words.length && words.every(w => exW.includes(w));
    });
    if (!isDupe) longtailRaw.push(phrase);
    if (longtailRaw.length >= longtailN) break;
  }

  const metaDescription = buildMetaDescription(title, content, topKeywords);

  return {
    keywords:        topKeywords.slice(0, topN),
    longtailKeywords: longtailRaw.slice(0, longtailN),
    metaDescription,
  };
}

// ── Weighted N-Gram Builder ───────────────────────────────────

function buildWeightedNgrams(tokens, n, lang, weights, ignoreSet, cfg) {
  const stops   = getStopwords(lang);
  const phrases = {};

  for (let i = 0; i <= tokens.length - n; i++) {
    const gram = tokens.slice(i, i + n);
    if (stops.has(gram[0]) || stops.has(gram[gram.length - 1])) continue;
    if (gram.some(t => t.length < 3)) continue;
    if (gram.some(t => ignoreSet.has(t))) continue;

    const key = gram.join(' ');
    if (!phrases[key]) {
      const avgW = gram.reduce((s, w) => s + (weights[w] ?? 0.05), 0) / gram.length;
      phrases[key] = { count: 0, avgW };
    }
    phrases[key].count++;
  }

  return Object.entries(phrases)
    .map(([phrase, { count, avgW }]) => ({
      phrase,
      score: avgW * (1 + Math.log(count + 1)),
    }))
    .filter(x => x.score > cfg.minNgramScore)
    .sort((a, b) => b.score - a.score)
    .map(x => x.phrase);
}

// ── Meta Description Generator ───────────────────────────────

function buildMetaDescription(title, content, topKeywords) {
  const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const sentences = plainText.split(/(?<=[.!?])\s+/);
  const kws       = new Set(topKeywords.slice(0, 8));

  let best = null, bestScore = -1;
  for (const s of sentences) {
    const clean = s.trim();
    if (clean.length < 40 || clean.length > 300) continue;
    const words    = clean.toLowerCase().split(/\s+/);
    const kwHits   = words.filter(w => kws.has(w)).length;
    const lenBonus = clean.length >= 80 && clean.length <= 160 ? 3 : 0;
    const score    = kwHits * 2 + lenBonus;
    if (score > bestScore) { bestScore = score; best = clean; }
  }
  if (!best && sentences.length > 0) best = sentences[0].trim();
  if (best && best.length > 160) best = best.slice(0, 157).replace(/\s+\S*$/, '') + '…';
  return best || title;
}
