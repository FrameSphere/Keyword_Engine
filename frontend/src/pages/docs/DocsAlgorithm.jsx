function CodeBlock({ code, lang = 'js' }) {
  return (
    <div className="relative rounded-xl overflow-hidden border border-white/[0.08] my-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border-b border-white/[0.08]">
        <span className="text-[11px] text-slate-500 font-mono uppercase tracking-wider">{lang}</span>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-slate-300 font-mono leading-relaxed bg-black/20">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function FormulaBox({ label, formula, desc }) {
  return (
    <div className="card my-3">
      {label && <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-2">{label}</p>}
      <p className="font-mono text-blue-300 text-sm mb-2">{formula}</p>
      {desc && <p className="text-xs text-slate-500">{desc}</p>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-white/[0.08]">{title}</h2>
      {children}
    </section>
  );
}

export default function DocsAlgorithm() {
  return (
    <div className="space-y-2">
      <div className="mb-8">
        <span className="badge-blue mb-3 inline-block">Algorithm</span>
        <h1 className="text-3xl font-bold text-white mb-3">How KeyLens works</h1>
        <p className="text-slate-400 leading-relaxed">
          KeyLens combines <strong className="text-white">TF-IDF scoring</strong> with
          {' '}<strong className="text-white">profile-based word weights</strong>, positional bonuses, and
          weighted n-gram extraction to deliver relevant, niche-aware keywords from any text.
        </p>
      </div>

      {/* Pipeline Overview */}
      <Section title="Processing pipeline">
        <div className="grid gap-3">
          {[
            { step: '1', label: 'Tokenize', desc: 'HTML tags and URLs stripped, text lowercased, split on whitespace. Words shorter than 3 chars or pure numbers discarded.' },
            { step: '2', label: 'Stopword filter', desc: 'Language-specific stopword lists (DE, EN, FR, ES, IT) remove grammatical filler words.' },
            { step: '3', label: 'TF scoring', desc: 'Term Frequency = count(word) / total_tokens × 100. Each word gets a raw frequency score.' },
            { step: '4', label: 'Profile weight boost', desc: 'If a profile with trained weights exists, TF is multiplied: score = TF × (1 + weight × 3). Trained terms get up to 4× amplification.' },
            { step: '5', label: 'Bonus signals', desc: 'Title presence (+6 pts), early-position bonus for first 20% of text (+2 pts), word length > 6 chars (+1 pt).' },
            { step: '6', label: 'Deduplication', desc: 'Prefix/suffix variants of the same root (e.g. "rank" vs "ranking") are collapsed to the higher-scoring form.' },
            { step: '7', label: 'N-gram extraction', desc: 'Bigrams and trigrams are scored by avgWeight × log(1 + count). Stop-word-anchored phrases are discarded.' },
            { step: '8', label: 'Meta description', desc: 'Sentences are scored by keyword density + length (80–160 chars). Best sentence becomes the meta description.' },
          ].map(r => (
            <div key={r.step} className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold mt-0.5">{r.step}</span>
              <div>
                <span className="text-white text-sm font-medium">{r.label}</span>
                <span className="text-slate-500 text-sm"> — {r.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* TF-IDF Corpus Training */}
      <Section title="Profile training (TF-IDF corpus analysis)">
        <p className="text-slate-400 text-sm leading-relaxed mb-3">
          When you train a profile, KeyLens runs a full corpus TF-IDF analysis across all your training texts.
          This creates a <em>weight map</em> — a dictionary of words to normalized importance scores — that is
          stored in the D1 database and applied to every subsequent analysis.
        </p>

        <FormulaBox
          label="IDF formula (multi-document)"
          formula="IDF(w) = log( (N + 1) / (df(w) + 1) )"
          desc="N = number of training documents · df(w) = how many docs contain the word. Rare, niche-specific terms score higher."
        />
        <FormulaBox
          label="Per-word score"
          formula="score(w) = IDF(w) × avgTF(w) × lengthBonus(w)"
          desc="avgTF = mean TF across documents that contain w. lengthBonus = min(wordLength / 6, 1.5)"
        />
        <FormulaBox
          label="Normalization"
          formula="weight(w) = round(score(w) / max(score) × 1000) / 1000"
          desc="Weights are normalized to [0, 1]. Only words with weight ≥ 0.05 are applied during analysis."
        />

        <p className="text-slate-400 text-sm mt-3">
          With a single-document corpus (e.g. one training text), IDF falls back to{' '}
          <code className="font-mono text-blue-300">log(1 + corpusFreq)</code> to still reward repeated terms.
        </p>
      </Section>

      {/* Longtail */}
      <Section title="Longtail keyword generation">
        <p className="text-slate-400 text-sm leading-relaxed mb-3">
          After single-word scoring, KeyLens extracts <strong className="text-white">bigrams</strong> (2-word) and{' '}
          <strong className="text-white">trigrams</strong> (3-word) from the filtered token stream.
        </p>
        <FormulaBox
          label="N-gram score"
          formula="phraseScore = avgWeight(words) × (1 + log(count + 1))"
          desc="avgWeight = mean profile weight of constituent words (default 0.05 if untrained). Phrases starting/ending with stopwords are discarded."
        />
        <p className="text-slate-400 text-sm">
          Trigrams are added first (more specific), then bigrams fill remaining slots.
          Duplicate phrase permutations are deduplicated before returning.
        </p>
      </Section>

      {/* Config */}
      <Section title="Tunable parameters">
        <p className="text-slate-400 text-sm mb-3">
          Every profile stores a <code className="font-mono text-blue-300">config</code> JSON object that overrides defaults:
        </p>
        <CodeBlock lang="json" code={`{
  "minWordLength":   3,      // Minimum token length
  "topN":           10,      // Number of keywords returned
  "longtailTopN":   10,      // Number of longtail phrases returned
  "idfSmoothing":    1,      // IDF denominator smoothing
  "titleWeight":     3,      // Title is repeated N times for scoring
  "titleBonus":      6,      // Flat bonus for title words
  "positionBonus":   2,      // Bonus for words in first 20% of text
  "lengthBonus":     1,      // Bonus for words longer than 6 chars
  "positionCutoff":  0.2,    // What fraction counts as "early"
  "lengthThreshold": 6,      // Word length for length bonus
  "minNgramScore":   0.03,   // Minimum phrase score to include
  "weightThreshold": 0.05    // Minimum profile weight to apply
}`} />
      </Section>

      {/* Ignore list */}
      <Section title="Ignore lists">
        <p className="text-slate-400 text-sm leading-relaxed">
          Words added to the ignore list are filtered <em>after</em> tokenization but{' '}
          <em>before</em> scoring. They never appear as keywords, longtail terms, or n-gram components.
          Ignore lists can be global (user-level) or profile-specific. Profile-specific lists take precedence
          and are merged with the global list at query time.
        </p>
      </Section>
    </div>
  );
}
