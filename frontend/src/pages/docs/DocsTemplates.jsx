import { Link } from 'react-router-dom';

const TEMPLATES = [
  {
    id: 'blog-de',
    name: 'Blog Deutsch',
    lang: 'DE',
    icon: '✍️',
    color: 'blue',
    desc: 'Für deutschsprachige Blog-Artikel, Content-Marketing und Ratgeber-Texte.',
    useCases: ['Blog-Artikel', 'How-To Guides', 'Content Marketing', 'Magazin-Beiträge'],
    weights: 'Gewichtet Nischen-Fachbegriffe, langen Satzteile und edukative Begriffe höher. Entfernt generische Konnektoren.',
    stopwords: 'Erweitertes deutsches Stopwort-Set mit Blog-spezifischen Füllwörtern (zudem, übrigens, bekanntlich…)',
    longtail: 'Optimiert für Frage-Bigrams (wie + Nomen, was + Verb).',
  },
  {
    id: 'blog-en',
    name: 'Blog English',
    lang: 'EN',
    icon: '✍️',
    color: 'blue',
    desc: 'English-language blog posts, tutorials, and informational content.',
    useCases: ['Blog Posts', 'Tutorials', 'How-To Articles', 'Thought Leadership'],
    weights: 'Boosts long-tail informational phrases and question-style n-grams.',
    stopwords: 'Extended English stopwords with common filler expressions.',
    longtail: 'Favors "how to + verb", "best + noun" and "top N" trigrams.',
  },
  {
    id: 'ecommerce-de',
    name: 'E-Commerce DE',
    lang: 'DE',
    icon: '🛒',
    color: 'violet',
    desc: 'Produktbeschreibungen, Shop-Kategorieseiten und Kaufberatungen.',
    useCases: ['Produktseiten', 'Kategorieseiten', 'Kaufberatung', 'Amazon-Listings'],
    weights: 'Höhere Gewichtung für Produkteigenschaften, Materialien, Marken und kaufintentionale Begriffe.',
    stopwords: 'Entfernt allgemeine Textphrasen, behält Maßangaben und Produktattribute.',
    longtail: 'Bevorzugt "kaufen + Produkt", "günstig + Adjektiv" und Marken-Bigrams.',
  },
  {
    id: 'ecommerce-en',
    name: 'E-Commerce EN',
    lang: 'EN',
    icon: '🛒',
    color: 'violet',
    desc: 'Product pages, category descriptions, and buying guides.',
    useCases: ['Product Listings', 'Category Pages', 'Amazon SEO', 'Shop Descriptions'],
    weights: 'Prioritizes product attributes, materials, brand terms, and transactional intent words.',
    stopwords: 'Filters generic prose while keeping measurement units and SKU fragments.',
    longtail: 'Targets "buy + product", "cheap + adjective", "best + product" patterns.',
  },
  {
    id: 'tech-en',
    name: 'Tech / Software',
    lang: 'EN',
    icon: '⚙️',
    color: 'emerald',
    desc: 'Technical documentation, SaaS landing pages, developer content.',
    useCases: ['SaaS Landing Pages', 'API Docs', 'Dev Blogs', 'Software Reviews'],
    weights: 'Amplifies technical nouns, acronyms, and feature-specific terminology.',
    stopwords: 'Generic prose removed; code-adjacent terms preserved.',
    longtail: 'Generates "framework + use case" and "tool + comparison" phrases.',
  },
  {
    id: 'gaming-de',
    name: 'Gaming Deutsch',
    lang: 'DE',
    icon: '🎮',
    color: 'fuchsia',
    desc: 'Gaming-Content, Reviews, Guides und Walkthroughs auf Deutsch.',
    useCases: ['Game Reviews', 'Guides & Walkthroughs', 'News', 'YouTube-Beschreibungen'],
    weights: 'Boost für Genre-Begriffe, Spielmechaniken und Plattform-Bezeichnungen.',
    stopwords: 'Entfernt deutsche Füllphrasen; Gaming-Slang und Titel bleiben erhalten.',
    longtail: 'Zielt auf "Spiel + Review", "bester + Klasse" und Titel-Bigrams.',
  },
  {
    id: 'news-de',
    name: 'News / Journalismus',
    lang: 'DE',
    icon: '📰',
    color: 'amber',
    desc: 'Nachrichtenartikel, Reportagen und journalistische Texte.',
    useCases: ['Nachrichtenartikel', 'Reportagen', 'Interviews', 'Pressemitteilungen'],
    weights: 'Fokus auf Eigennamen, Ereignis-Substantive und Zeitbezüge.',
    stopwords: 'Schwerpunkt auf Verben und Adverbien; Substantive und Nomen erhalten.',
    longtail: 'Bevorzugt Orts-Bigrams, Personen-Bigrams und Ereignis-Trigrams.',
  },
];

const colorMap = {
  blue:    { badge: 'badge-blue', border: 'border-blue-500/20 hover:border-blue-500/40', tag: 'bg-blue-500/10 text-blue-400' },
  violet:  { badge: 'badge-violet', border: 'border-violet-500/20 hover:border-violet-500/40', tag: 'bg-violet-500/10 text-violet-400' },
  emerald: { badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-0.5 text-[11px] font-medium', border: 'border-emerald-500/20 hover:border-emerald-500/40', tag: 'bg-emerald-500/10 text-emerald-400' },
  fuchsia: { badge: 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 rounded-full px-2.5 py-0.5 text-[11px] font-medium', border: 'border-fuchsia-500/20 hover:border-fuchsia-500/40', tag: 'bg-fuchsia-500/10 text-fuchsia-400' },
  amber:   { badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-2.5 py-0.5 text-[11px] font-medium', border: 'border-amber-500/20 hover:border-amber-500/40', tag: 'bg-amber-500/10 text-amber-400' },
};

export default function DocsTemplates() {
  return (
    <div>
      <div className="mb-8">
        <span className="badge-blue mb-3 inline-block">Templates</span>
        <h1 className="text-3xl font-bold text-white mb-3">Pre-built Profiles</h1>
        <p className="text-slate-400 leading-relaxed">
          Templates are pre-configured algorithm profiles for common niches.
          Select one when creating a profile — no training required.
          You can still fine-tune any template by adding training texts or adjusting the config.
        </p>
      </div>

      <div className="card bg-blue-500/5 border-blue-500/15 mb-8 text-sm text-slate-400">
        <strong className="text-white">How to use: </strong>
        In the app, go to <strong className="text-white">Profiles → New Profile</strong> and pick a template from the dropdown.
        Or pass a <code className="font-mono text-blue-300">template_id</code> when creating a profile via API.
      </div>

      <div className="space-y-6">
        {TEMPLATES.map(t => {
          const c = colorMap[t.color] || colorMap.blue;
          return (
            <div key={t.id} className={`card border transition-all ${c.border}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold">{t.name}</h3>
                    <span className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full border font-mono ${
                      t.color === 'blue'   ? 'bg-blue-500/10 text-blue-400 border-blue-500/25' :
                      t.color === 'violet' ? 'bg-violet-500/10 text-violet-400 border-violet-500/25' :
                      t.color === 'emerald'? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' :
                      t.color === 'fuchsia'? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/25' :
                                            'bg-amber-500/10 text-amber-400 border-amber-500/25'
                    }`}>{t.lang}</span>
                  </div>
                </div>
                <code className="text-[11px] text-slate-600 font-mono bg-white/[0.04] px-2 py-1 rounded-lg border border-white/[0.08]">{t.id}</code>
              </div>

              <p className="text-slate-400 text-sm mb-4">{t.desc}</p>

              <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500 uppercase tracking-wider font-semibold mb-2">Use cases</p>
                  <div className="flex flex-wrap gap-1.5">
                    {t.useCases.map(u => (
                      <span key={u} className={`px-2 py-1 rounded-lg text-[11px] ${c.tag}`}>{u}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-slate-500 uppercase tracking-wider font-semibold mb-1">Weights</p>
                    <p className="text-slate-400 leading-relaxed">{t.weights}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase tracking-wider font-semibold mb-1">Longtail</p>
                    <p className="text-slate-400 leading-relaxed">{t.longtail}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card mt-10 bg-violet-500/5 border-violet-500/15">
        <h3 className="font-semibold text-white mb-2">Need a custom niche?</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          Templates are a starting point. For the best results, train your own profile
          with 10–50 texts from your specific domain. The TF-IDF corpus analysis will
          automatically learn which terms are rare and valuable in your niche.
          See <Link to="/docs/algorithm" className="text-violet-400 hover:underline">How it works</Link> for details.
        </p>
      </div>
    </div>
  );
}
