// seed-profiles.mjs
// Läuft lokal via: node seed-profiles.mjs
// Schreibt System-Profile in die Cloudflare D1 (lokal oder remote)

import fs from 'fs';
import { execSync } from 'child_process';

// Profile definieren — muss zum CSV-Output des local Scripts passen
const SYSTEM_PROFILES = [
  {
    id:          'sys-brawlstars',
    name:        'Brawl Stars DE',
    language:    'de',
    description: 'Vortrainiert auf Brawl Stars Content (Gaming)',
    template_id: 'gaming-de',
    csvPath:     '../KeywordSystem/output/brawlstars/word-weights.csv',
  },
  {
    id:          'sys-wordgames-de',
    name:        'Wortspiele Deutsch',
    language:    'de',
    description: 'Vortrainiert auf deutschsprachige Wortspiel-Apps',
    template_id: null,
    csvPath:     '../KeywordSystem/output/wordgames-de/word-weights.csv',
  },
  // weitere Profile hier eintragen...
];

for (const profile of SYSTEM_PROFILES) {
  // 1. Profil anlegen
  execSync(`npx wrangler d1 execute keylens-db --command "
    INSERT OR REPLACE INTO profiles 
      (id, user_id, name, description, language, template_id, config)
    VALUES 
      ('${profile.id}', '__system__', '${profile.name}', '${profile.description}', '${profile.language}', ${profile.template_id ? `'${profile.template_id}'` : 'NULL'}, '{}')
  "`);
  console.log(`✓ Profil angelegt: ${profile.name}`);

  // 2. Alte Weights löschen
  execSync(`npx wrangler d1 execute keylens-db --command "
    DELETE FROM word_weights WHERE profile_id = '${profile.id}'
  "`);

  // 3. CSV einlesen und als Batch einfügen
  if (!fs.existsSync(profile.csvPath)) {
    console.warn(`  ⚠ CSV nicht gefunden: ${profile.csvPath}`);
    continue;
  }

  const lines = fs.readFileSync(profile.csvPath, 'utf-8')
    .split('\n').slice(1).filter(Boolean); // Header überspringen

  // In Batches zu 100 Zeilen verarbeiten (D1-Limit)
  const BATCH = 100;
  for (let i = 0; i < lines.length; i += BATCH) {
    const chunk = lines.slice(i, i + BATCH);
    const values = chunk.map(line => {
      const [, word, score, df, cf] = line.split(',');
      const safeWord = word.replace(/'/g, "''"); // SQL-escape
      return `('${profile.id}', '${safeWord}', ${score}, ${df || 1}, ${cf || 1})`;
    }).join(',\n');

    execSync(`npx wrangler d1 execute keylens-db --command "
      INSERT OR REPLACE INTO word_weights (profile_id, word, score, doc_freq, corpus_freq)
      VALUES ${values}
    "`);

    process.stdout.write(`  → ${Math.min(i + BATCH, lines.length)}/${lines.length} Wörter\r`);
  }
  console.log(`  ✓ ${lines.length} Gewichte gespeichert`);
}
console.log('\n✅ Alle System-Profile geseed!');