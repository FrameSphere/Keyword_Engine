// ============================================================
// KeyScope – System Profile Seeder
// Läuft lokal: node seed-system-profiles.mjs [--remote]
//
// Was es macht:
//   1. Für jede CSV-Datei in ../seed/weights/<template-id>.csv
//   2. Legt ein System-Profil in der D1-DB an (user_id = '__system__')
//   3. Füllt word_weights mit den Gewichten aus der CSV
//
// Aufruf (lokal gegen wrangler dev DB):
//   node seed-system-profiles.mjs
//
// Aufruf (gegen produktive Cloudflare D1):
//   node seed-system-profiles.mjs --remote
// ============================================================

import fs   from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REMOTE    = process.argv.includes('--remote');
const DB_NAME   = 'keyscope-db';          // muss mit wrangler.toml übereinstimmen
const WEIGHTS_DIR = path.resolve(__dirname, '../seed/weights');
const BATCH_SIZE  = 80;                   // D1 Limit: sicher unterhalb von 100

// ── Alle Template-Metadaten ────────────────────────────────────
// Muss zu templates.js passen (id = slug-lang, user_id = '__system__')
const SYSTEM_PROFILES = {
  'general-de':   { name: 'General Deutsch',          language: 'de', template_id: null },
  'general-en':   { name: 'General English',           language: 'en', template_id: null },
  'general-fr':   { name: 'Général Français',          language: 'fr', template_id: null },
  'general-es':   { name: 'General Español',           language: 'es', template_id: null },
  'general-it':   { name: 'Generale Italiano',         language: 'it', template_id: null },
  'blog-de':      { name: 'Blog Deutsch',              language: 'de', template_id: 'blog-de' },
  'blog-en':      { name: 'Blog English',              language: 'en', template_id: 'blog-en' },
  'blog-fr':      { name: 'Blog Français',             language: 'fr', template_id: 'blog-fr' },
  'ecommerce-de': { name: 'E-Commerce Deutsch',        language: 'de', template_id: 'ecommerce-de' },
  'ecommerce-en': { name: 'E-Commerce English',        language: 'en', template_id: 'ecommerce-en' },
  'tech-de':      { name: 'Tech & Software DE',        language: 'de', template_id: 'tech-de' },
  'tech-en':      { name: 'Tech & Software EN',        language: 'en', template_id: 'tech-en' },
  'gaming-de':    { name: 'Gaming Deutsch',            language: 'de', template_id: 'gaming-de' },
  'gaming-en':    { name: 'Gaming English',            language: 'en', template_id: 'gaming-en' },
  'news-de':      { name: 'News & Journalismus DE',    language: 'de', template_id: 'news-de' },
  'news-en':      { name: 'News & Journalism EN',      language: 'en', template_id: 'news-en' },
  'health-de':    { name: 'Gesundheit & Fitness DE',   language: 'de', template_id: 'health-de' },
  'health-en':    { name: 'Health & Fitness EN',       language: 'en', template_id: 'health-en' },
  'travel-de':    { name: 'Reise & Tourismus DE',      language: 'de', template_id: 'travel-de' },
  'travel-en':    { name: 'Travel & Tourism EN',       language: 'en', template_id: 'travel-en' },
  'food-de':      { name: 'Essen & Rezepte DE',        language: 'de', template_id: 'food-de' },
  'food-en':      { name: 'Food & Recipes EN',         language: 'en', template_id: 'food-en' },
  'social-de':    { name: 'Social Media & YouTube DE', language: 'de', template_id: 'social-de' },
  'social-en':    { name: 'Social Media & YouTube EN', language: 'en', template_id: 'social-en' },
  'legal-de':     { name: 'Recht & Business DE',       language: 'de', template_id: 'legal-de' },
  'legal-en':     { name: 'Legal & Business EN',       language: 'en', template_id: 'legal-en' },
};

// ── Helper: wrangler d1 execute ────────────────────────────────
function d1(sql) {
  const remoteFlag = REMOTE ? '--remote' : '--local';
  // SQL-Anführungszeichen escapen für Shell
  const escaped = sql.replace(/"/g, '\\"');
  try {
    execSync(
      `npx wrangler d1 execute ${DB_NAME} ${remoteFlag} --command "${escaped}"`,
      { stdio: 'pipe', cwd: __dirname }
    );
  } catch (e) {
    const out = e.stdout?.toString() || e.stderr?.toString() || e.message;
    throw new Error(`D1 error:\n${out}\nSQL: ${sql.slice(0, 200)}`);
  }
}

// ── Helper: CSV einlesen ───────────────────────────────────────
function readCSV(csvPath) {
  const raw   = fs.readFileSync(csvPath, 'utf-8');
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  const header = lines[0].toLowerCase().split(',');
  const wordIdx  = header.indexOf('word');
  const scoreIdx = header.indexOf('score');
  const dfIdx    = header.indexOf('doc_freq');
  const cfIdx    = header.indexOf('corpus_freq');

  if (wordIdx === -1 || scoreIdx === -1) {
    throw new Error(`CSV ${csvPath}: needs at least 'word' and 'score' columns`);
  }

  return lines.slice(1).map(line => {
    const cols = line.split(',');
    return {
      word:  cols[wordIdx]?.replace(/^"|"$/g, '').trim(),
      score: parseFloat(cols[scoreIdx]) || 0,
      df:    parseInt(cols[dfIdx]) || 1,
      cf:    parseInt(cols[cfIdx]) || 1,
    };
  }).filter(r => r.word && r.score > 0);
}

// ── Main ───────────────────────────────────────────────────────
async function main() {
  console.log(`\n🔑 KeyScope System Profile Seeder`);
  console.log(`   Mode:     ${REMOTE ? '☁️  REMOTE (Cloudflare D1)' : '💻 LOCAL (wrangler dev)'}`);
  console.log(`   DB:       ${DB_NAME}`);
  console.log(`   Weights:  ${WEIGHTS_DIR}\n`);

  // Alle vorhandenen CSV-Dateien finden
  const csvFiles = fs.readdirSync(WEIGHTS_DIR)
    .filter(f => f.endsWith('.csv') && !f.startsWith('_'))
    .map(f => ({ templateId: f.replace('.csv', ''), file: path.join(WEIGHTS_DIR, f) }));

  if (csvFiles.length === 0) {
    console.log('⚠  Keine CSV-Dateien in seed/weights/ gefunden.');
    console.log('   Lege dort Dateien ab: <template-id>.csv');
    console.log('   Beispiel: blog-de.csv, gaming-en.csv\n');
    process.exit(0);
  }

  console.log(`📋 ${csvFiles.length} CSV-Datei(en) gefunden:\n`);
  csvFiles.forEach(({ templateId }) => {
    const meta = SYSTEM_PROFILES[templateId];
    if (meta) {
      console.log(`   ✓ ${templateId.padEnd(15)} → "${meta.name}"`);
    } else {
      console.log(`   ⚠ ${templateId.padEnd(15)} → unbekannte Template-ID (wird übersprungen)`);
    }
  });
  console.log('');

  let seeded = 0;

  for (const { templateId, file } of csvFiles) {
    const meta = SYSTEM_PROFILES[templateId];
    if (!meta) continue;

    console.log(`⬡  Seeding "${meta.name}" (${templateId})...`);

    try {
      // 1. Profil anlegen / updaten
      const tmplVal = meta.template_id ? `'${meta.template_id}'` : 'NULL';
      d1(`INSERT OR REPLACE INTO profiles (id, user_id, name, description, language, template_id, config, created_at, updated_at) VALUES ('sys-${templateId}', '__system__', '${meta.name.replace(/'/g, "''")}', 'System-Profil: ${meta.name.replace(/'/g, "''")}', '${meta.language}', ${tmplVal}, '{}', datetime('now'), datetime('now'))`);
      console.log(`   ✓ Profil angelegt`);

      // 2. Alte Gewichte löschen
      d1(`DELETE FROM word_weights WHERE profile_id = 'sys-${templateId}'`);

      // 3. CSV einlesen
      const rows = readCSV(file);
      console.log(`   → ${rows.length} Wörter geladen`);

      // 4. Batch-Insert
      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const chunk  = rows.slice(i, i + BATCH_SIZE);
        const values = chunk
          .map(r => `('sys-${templateId}', '${r.word.replace(/'/g, "''")}', ${r.score}, ${r.df}, ${r.cf})`)
          .join(', ');
        d1(`INSERT OR REPLACE INTO word_weights (profile_id, word, score, doc_freq, corpus_freq) VALUES ${values}`);
        process.stdout.write(`   → ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length} Gewichte\r`);
      }
      console.log(`   ✅ ${rows.length} Gewichte gespeichert\n`);
      seeded++;

    } catch (err) {
      console.error(`   ❌ Fehler bei ${templateId}:`, err.message, '\n');
    }
  }

  console.log(`✅ Fertig! ${seeded}/${csvFiles.length} Profile geseed.\n`);
  if (!REMOTE) {
    console.log('💡 Für Produktion nochmal mit --remote ausführen:\n');
    console.log('   node seed-system-profiles.mjs --remote\n');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
