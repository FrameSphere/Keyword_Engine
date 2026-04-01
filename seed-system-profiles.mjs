#!/usr/bin/env node
// ============================================================
// KeyScope – System Profile Seeder
// Liest CSV-Dateien aus seed/weights/ und schreibt sie
// als System-Profile in D1 (lokal oder remote via wrangler).
//
// Usage:
//   node seed-system-profiles.mjs             → lokal (wrangler dev)
//   node seed-system-profiles.mjs --remote    → Cloudflare D1 Remote
//   node seed-system-profiles.mjs --remote --file tech-de  → nur eine Datei
//   node seed-system-profiles.mjs --remote --file=tech-de  → alternativ
// ============================================================

import { execSync }                            from 'child_process';
import { readFileSync, readdirSync,
         writeFileSync, unlinkSync }            from 'fs';
import { join, basename, dirname }              from 'path';
import { fileURLToPath }                        from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── CLI Args ─────────────────────────────────────────────────
const args = process.argv.slice(2);
const REMOTE = args.includes('--remote');
const fileArgIdx = args.indexOf('--file');
const fileArg =
  args.find(a => a.startsWith('--file='))?.split('=')[1] ??
  (fileArgIdx !== -1 ? args[fileArgIdx + 1] : null);

// ── Config ────────────────────────────────────────────────────
const DB_NAME   = 'keyscope-db';
const SEEDS_DIR = join(__dirname, 'seed', 'weights');
const BATCH_SIZE = 80; // sicher unter D1-Limits

// ── Profile-Metadaten ─────────────────────────────────────────
const PROFILE_META = {
  'tech-de':      { name: 'Tech & Software DE',    description: 'Vortraniert auf Tech/SaaS/KI-Content (Deutsch)' },
  'tech-en':      { name: 'Tech & Software EN',    description: 'Pre-trained on tech/SaaS/AI content (English)' },
  'blog-de':      { name: 'Blog Deutsch',           description: 'Vortraniert auf deutschen Blog-Artikeln' },
  'blog-en':      { name: 'Blog English',           description: 'Pre-trained on English blog posts' },
  'ecommerce-de': { name: 'E-Commerce DE',          description: 'Vortraniert auf Produktseiten & Online-Shops (DE)' },
  'ecommerce-en': { name: 'E-Commerce EN',          description: 'Pre-trained on product pages & online stores (EN)' },
  'news-de':      { name: 'News & Journalismus DE', description: 'Vortraniert auf deutschen Nachrichtenartikeln' },
  'gaming-de':    { name: 'Gaming DE',              description: 'Vortraniert auf Gaming-Content & Reviews (DE)' },
};

function langFromId(id) {
  if (id.endsWith('-de')) return 'de';
  if (id.endsWith('-en')) return 'en';
  if (id.endsWith('-fr')) return 'fr';
  if (id.endsWith('-es')) return 'es';
  return 'de';
}

// ── CSV Parser ────────────────────────────────────────────────
function parseCsv(content) {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];

  const header  = lines[0].split(',').map(h => h.trim().toLowerCase());
  const wordIdx = header.indexOf('word');
  const scoreIdx= header.indexOf('score');
  const dfIdx   = header.indexOf('doc_freq');
  const cfIdx   = header.indexOf('corpus_freq');

  if (wordIdx === -1 || scoreIdx === -1) {
    throw new Error(
      `CSV-Header ungültig. Erwartet: word,score  Gefunden: ${lines[0]}`
    );
  }

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols  = line.split(',');
    const word  = cols[wordIdx]?.trim();
    const score = parseFloat(cols[scoreIdx]);
    const df    = dfIdx  !== -1 ? parseInt(cols[dfIdx],  10) : 1;
    const cf    = cfIdx  !== -1 ? parseInt(cols[cfIdx],  10) : 1;
    if (!word || isNaN(score)) continue;
    rows.push({ word, score, df: isNaN(df) ? 1 : df, cf: isNaN(cf) ? 1 : cf });
  }
  return rows;
}

// ── SQL-Escape ────────────────────────────────────────────────
function esc(s) { return String(s).replace(/'/g, "''"); }

// ── Wrangler D1 via temp-file ─────────────────────────────────
const TMP_SQL = join(__dirname, '.seed-tmp.sql');

function d1exec(sql, remote) {
  writeFileSync(TMP_SQL, sql, 'utf8');
  const remoteFlag = remote ? '--remote' : '--local';
  const cmd = `wrangler d1 execute ${DB_NAME} ${remoteFlag} --file="${TMP_SQL}"`;
  try {
    const out = execSync(cmd, {
      cwd:      join(__dirname, 'worker'),
      stdio:    ['pipe', 'pipe', 'pipe'],
      encoding: 'utf8',
    });
    return out;
  } catch (e) {
    const msg = (e.stderr || e.stdout || e.message || '').trim();
    throw new Error(msg || 'wrangler exited with error (no output)');
  } finally {
    try { unlinkSync(TMP_SQL); } catch { /* ignore */ }
  }
}

// ── Seed one profile ──────────────────────────────────────────
async function seedProfile(csvPath, remote) {
  const fileId    = basename(csvPath, '.csv');
  const meta      = PROFILE_META[fileId] ?? {
    name: fileId, description: `System-Profil (${fileId})`,
  };
  const lang      = langFromId(fileId);
  const profileId = `sys-${fileId}`;

  const content = readFileSync(csvPath, 'utf8');
  const rows    = parseCsv(content);
  if (rows.length === 0) throw new Error('Keine gültigen Zeilen in der CSV');
  console.log(`   Wörter in CSV: ${rows.length}`);

  // 1. System-User sicherstellen (wird von FK-Constraint benötigt)
  d1exec(`
INSERT INTO users (id, email, password, plan)
VALUES ('__system__', 'system@keyscope.internal', 'n/a', 'pro')
ON CONFLICT(id) DO NOTHING;
  `.trim(), remote);

  // 2. Profil upserten
  d1exec(`
INSERT INTO profiles (id, user_id, name, description, language, config)
VALUES ('${esc(profileId)}', '__system__', '${esc(meta.name)}',
        '${esc(meta.description)}', '${esc(lang)}', '{}')
ON CONFLICT(id) DO UPDATE SET
  name        = excluded.name,
  description = excluded.description,
  language    = excluded.language,
  updated_at  = datetime('now');
  `.trim(), remote);

  // 3. Alte Gewichte löschen
  d1exec(
    `DELETE FROM word_weights WHERE profile_id = '${esc(profileId)}';`,
    remote
  );

  // 4. Gewichte in Batches schreiben
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch  = rows.slice(i, i + BATCH_SIZE);
    const values = batch
      .map(r => `('${esc(profileId)}','${esc(r.word)}',${r.score},${r.df},${r.cf})`)
      .join(',\n');

    d1exec(
      `INSERT OR REPLACE INTO word_weights (profile_id, word, score, doc_freq, corpus_freq)\nVALUES ${values};`,
      remote
    );
    inserted += batch.length;
    process.stdout.write(`\r   Eingefügt: ${inserted}/${rows.length}   `);
  }
  console.log(`\r   ✅ ${inserted} Gewichte gespeichert für "${meta.name}".`);
  return { profileId, words: inserted };
}

// ── Main ──────────────────────────────────────────────────────
async function main() {
  console.log('\n🔑 KeyScope System Profile Seeder');
  console.log(`   Mode:    ${REMOTE ? '☁️  REMOTE (Cloudflare D1)' : '💻 LOCAL (wrangler dev)'}`);
  console.log(`   DB:      ${DB_NAME}`);
  console.log(`   Weights: ${SEEDS_DIR}\n`);

  let csvFiles;
  try {
    const all = readdirSync(SEEDS_DIR).filter(f => f.endsWith('.csv'));
    if (fileArg) {
      const target = fileArg.endsWith('.csv') ? fileArg : `${fileArg}.csv`;
      csvFiles     = all.filter(f => f === target);
      if (csvFiles.length === 0) {
        throw new Error(
          `Datei "${target}" nicht gefunden. Verfügbar: ${all.join(', ')}`
        );
      }
    } else {
      csvFiles = all;
    }
  } catch (e) {
    console.error(`❌ ${e.message}`);
    process.exit(1);
  }

  if (csvFiles.length === 0) {
    console.log('⚠️  Keine CSV-Dateien gefunden in seed/weights/');
    process.exit(0);
  }

  console.log(`📋 ${csvFiles.length} CSV-Datei(en) gefunden:`);
  for (const f of csvFiles) {
    const id   = basename(f, '.csv');
    const meta = PROFILE_META[id];
    console.log(`   ✓ ${id.padEnd(16)} → "${meta?.name ?? id}"`);
  }
  console.log('');

  let ok = 0;
  for (const file of csvFiles) {
    const id = basename(file, '.csv');
    console.log(`⬡  Seeding "${PROFILE_META[id]?.name ?? id}" (${id})...`);
    try {
      await seedProfile(join(SEEDS_DIR, file), REMOTE);
      ok++;
    } catch (e) {
      console.error(`   ❌ Fehler bei ${id}:`);
      // Ausführliche Fehlerausgabe
      const lines = e.message.split('\n').slice(0, 10);
      for (const l of lines) console.error(`      ${l}`);
    }
    console.log('');
  }

  console.log(`✅ Fertig! ${ok}/${csvFiles.length} Profile geseed.`);
  if (ok < csvFiles.length) process.exit(1);
}

main().catch(e => { console.error('Unerwarteter Fehler:', e); process.exit(1); });
