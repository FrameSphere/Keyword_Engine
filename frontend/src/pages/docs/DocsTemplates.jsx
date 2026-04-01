import { Link } from 'react-router-dom';

// ── Template Groups (spiegelt templates.js wider) ─────────────
const GROUPS = [
  {
    slug: 'general', name: 'General', icon: '◈', color: 'slate',
    desc: 'Neutral all-purpose profile for any text type. Good starting point when no niche-specific template fits.',
    useCases: ['Any text', 'Mixed content', 'Unknown niche', 'Quick analysis'],
    longtail: 'Balanced bigram/trigram extraction, no niche bias.',
    langs: ['DE', 'EN', 'FR', 'ES', 'IT'],
  },
  {
    slug: 'blog', name: 'Blog & Content', icon: '✍️', color: 'blue',
    desc: 'Blog articles, how-to guides, content marketing and editorial texts.',
    useCases: ['Blog articles', 'How-To guides', 'Content marketing', 'Magazine posts'],
    longtail: 'Favors question-style bigrams: "how + verb", "best + noun", "was + Nomen".',
    langs: ['DE', 'EN', 'FR'],
  },
  {
    slug: 'ecommerce', name: 'E-Commerce & Shop', icon: '🛒', color: 'violet',
    desc: 'Product pages, shop categories, buying guides and Amazon listings.',
    useCases: ['Product pages', 'Category pages', 'Amazon SEO', 'Buying guides'],
    longtail: 'Targets transactional phrases: "buy + product", "best + attribute".',
    langs: ['DE', 'EN'],
  },
  {
    slug: 'tech', name: 'Tech & Software', icon: '⚙️', color: 'emerald',
    desc: 'Technical docs, SaaS landing pages, dev blogs and software reviews.',
    useCases: ['SaaS pages', 'API docs', 'Dev blogs', 'Software reviews'],
    longtail: 'Generates "tool + use case" and "framework + comparison" phrases.',
    langs: ['DE', 'EN'],
  },
  {
    slug: 'gaming', name: 'Gaming', icon: '🎮', color: 'fuchsia',
    desc: 'Game reviews, guides, walkthroughs, patch notes and YouTube descriptions.',
    useCases: ['Game reviews', 'Guides & Walkthroughs', 'Patch notes', 'YouTube'],
    longtail: 'Targets "game + guide", "best + class/build" and title bigrams.',
    langs: ['DE', 'EN'],
  },
  {
    slug: 'news', name: 'News & Journalism', icon: '📰', color: 'amber',
    desc: 'News articles, press releases, reportages and interviews.',
    useCases: ['News articles', 'Press releases', 'Reportages', 'Interviews'],
    longtail: 'Favors location bigrams, person bigrams and event trigrams.',
    langs: ['DE', 'EN'],
  },
  {
    slug: 'health', name: 'Health & Fitness', icon: '💪', color: 'green',
    desc: 'Health articles, fitness guides, nutrition content and wellness blogs.',
    useCases: ['Health articles', 'Fitness guides', 'Nutrition content', 'Wellness'],
    longtail: 'Boosts symptom-phrases, exercise names and "how to + health verb".',
    langs: ['DE', 'EN'],
  },
  {
    slug: 'travel', name: 'Travel & Tourism', icon: '✈️', color: 'cyan',
    desc: 'Travel guides, destination content, hotel reviews and trip reports.',
    useCases: ['Travel guides', 'Destination articles', 'Hotel reviews', 'Trip reports'],
    longtail: 'Targets "city + activity", "best + destination" and "travel + tip".',
    langs: ['DE', 'EN'],
  },
  {
    slug: 'food', name: 'Food & Recipes', icon: '🍳', color: 'orange',
    desc: 'Recipe content, food blogs, restaurant reviews and nutrition articles.',
    useCases: ['Recipes', 'Food blogs', 'Restaurant reviews', 'Nutrition'],
    longtail: 'Focuses on ingredient bigrams, preparation methods and dish names.',
    langs: ['DE', 'EN'],
  },
  {
    slug: 'social', name: 'Social Media & YouTube', icon: '📱', color: 'pink',
    desc: 'YouTube descriptions, social captions, influencer content and short-form posts.',
    useCases: ['YouTube descriptions', 'Instagram captions', 'TikTok posts', 'Shorts'],
    longtail: 'Emphasizes hashtag-adjacent terms and trending phrase patterns.',
    langs: ['DE', 'EN'],
  },
  {
    slug: 'legal', name: 'Legal & Business', icon: '⚖️', color: 'slate',
    desc: 'Legal texts, business documents, contracts and compliance content.',
    useCases: ['Legal articles', 'Business docs', 'Contracts', 'Compliance'],
    longtail: 'Extracts clause-style bigrams and formal compound terms.',
    langs: ['DE', 'EN'],
  },
];

// Tailwind color maps — musst du statisch halten (kein dynamic class gen)
const COLORS = {
  slate:   { border: 'border-slate-500/20 hover:border-slate-500/40',   lang: 'bg-slate-500/10 text-slate-400 border-slate-500/20',   tag: 'bg-slate-500/10 text-slate-400',   id: 'bg-slate-500/10 text-slate-500' },
  blue:    { border: 'border-blue-500/20 hover:border-blue-500/40',     lang: 'bg-blue-500/10 text-blue-400 border-blue-500/20',     tag: 'bg-blue-500/10 text-blue-400',     id: 'bg-blue-500/10 text-blue-500' },
  violet:  { border: 'border-violet-500/20 hover:border-violet-500/40', lang: 'bg-violet-500/10 text-violet-400 border-violet-500/20', tag: 'bg-violet-500/10 text-violet-400', id: 'bg-violet-500/10 text-violet-500' },
  emerald: { border: 'border-emerald-500/20 hover:border-emerald-500/40', lang: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', tag: 'bg-emerald-500/10 text-emerald-400', id: 'bg-emerald-500/10 text-emerald-500' },
  fuchsia: { border: 'border-fuchsia-500/20 hover:border-fuchsia-500/40', lang: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20', tag: 'bg-fuchsia-500/10 text-fuchsia-400', id: 'bg-fuchsia-500/10 text-fuchsia-500' },
  amber:   { border: 'border-amber-500/20 hover:border-amber-500/40',   lang: 'bg-amber-500/10 text-amber-400 border-amber-500/20',   tag: 'bg-amber-500/10 text-amber-400',   id: 'bg-amber-500/10 text-amber-500' },
  green:   { border: 'border-green-500/20 hover:border-green-500/40',   lang: 'bg-green-500/10 text-green-400 border-green-500/20',   tag: 'bg-green-500/10 text-green-400',   id: 'bg-green-500/10 text-green-500' },
  cyan:    { border: 'border-cyan-500/20 hover:border-cyan-500/40',     lang: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',     tag: 'bg-cyan-500/10 text-cyan-400',     id: 'bg-cyan-500/10 text-cyan-500' },
  orange:  { border: 'border-orange-500/20 hover:border-orange-500/40', lang: 'bg-orange-500/10 text-orange-400 border-orange-500/20', tag: 'bg-orange-500/10 text-orange-400', id: 'bg-orange-500/10 text-orange-500' },
  pink:    { border: 'border-pink-500/20 hover:border-pink-500/40',     lang: 'bg-pink-500/10 text-pink-400 border-pink-500/20',     tag: 'bg-pink-500/10 text-pink-400',     id: 'bg-pink-500/10 text-pink-500' },
};

function LangPill({ lang, colorClass }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-mono font-semibold ${colorClass}`}>
      {lang}
    </span>
  );
}

export default function DocsTemplates() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <span className="badge-blue mb-3 inline-block">Templates</span>
        <h1 className="text-3xl font-bold text-white mb-3">Pre-built Profiles</h1>
        <p className="text-slate-400 leading-relaxed">
          Templates are pre-configured algorithm profiles for common niches and content types.
          Select one when creating a profile — no training required. Each template is available
          in multiple languages.
        </p>
      </div>

      {/* How to use */}
      <div className="card bg-blue-500/5 border-blue-500/15 mb-8 text-sm text-slate-400">
        <strong className="text-white">How to use: </strong>
        Go to <strong className="text-white">Profiles → New Profile</strong>, pick a template and
        select your language. The profile is ready to use immediately — no training needed.
        You can still fine-tune it later by adding your own texts.
      </div>

      {/* Template Cards */}
      <div className="space-y-4">
        {GROUPS.map(g => {
          const c = COLORS[g.color] || COLORS.slate;
          return (
            <div key={g.slug} className={`card border transition-all ${c.border}`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                {/* Left: Icon + Name + Langs */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl flex-shrink-0">{g.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold leading-tight">{g.name}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {g.langs.map(lang => (
                        <LangPill key={lang} lang={lang} colorClass={c.lang} />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Right: Template ID pattern */}
                <code className={`text-[11px] font-mono px-2 py-1 rounded-lg border flex-shrink-0 hidden sm:block ${c.id}`}>
                  {g.slug}
                </code>
              </div>

              <p className="text-slate-400 text-sm mb-4">{g.desc}</p>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500 uppercase tracking-wider font-semibold mb-2">Use cases</p>
                  <div className="flex flex-wrap gap-1.5">
                    {g.useCases.map(u => (
                      <span key={u} className={`px-2 py-1 rounded-lg text-[11px] ${c.tag}`}>{u}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 uppercase tracking-wider font-semibold mb-1">Longtail</p>
                  <p className="text-slate-400 leading-relaxed">{g.longtail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="card mt-10 bg-violet-500/5 border-violet-500/15">
        <h3 className="font-semibold text-white mb-2">Need a custom niche?</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          Templates are a starting point. For the best results, train your own profile
          with 10–50 texts from your specific domain. The TF-IDF corpus analysis will
          automatically learn which terms are rare and valuable in your niche.
          See <Link to="/docs/algorithm" className="text-violet-400 hover:underline">How it works</Link>.
        </p>
      </div>
    </div>
  );
}
