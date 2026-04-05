import { Link } from 'react-router-dom';

// ── Hero ──────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-20"
             style={{ background: 'radial-gradient(ellipse, #2563EB 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full opacity-10"
             style={{ background: 'radial-gradient(ellipse, #7C3AED 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-10"
             style={{ background: 'radial-gradient(ellipse, #D946EF 0%, transparent 70%)' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 badge-blue mb-6 py-1.5 px-4">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-slow" />
          <span className="text-xs">TF-IDF Engine + AI Model — Two extraction modes</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.08] mb-6 tracking-tight">
          Extract the keywords
          <br />
          <span className="gradient-text">that actually rank</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          KeyScope analyzes your content with a custom-tuned TF-IDF algorithm or AI model,
          returning ranked keywords, longtail phrases, and meta descriptions — via UI or API.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="btn-primary text-base px-7 py-3.5 shadow-glow-blue">
            Start for free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </Link>
          <Link to="/docs/quickstart" className="btn-secondary text-base px-7 py-3.5">
            View docs
          </Link>
        </div>

        {/* Demo widget */}
        <div className="mt-16 card-glow max-w-2xl mx-auto text-left animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="text-xs text-slate-600 ml-2 font-mono">keyscope • analyze</span>
          </div>
          <p className="text-xs text-slate-500 font-mono mb-3">Input text →</p>
          <p className="text-sm text-slate-400 italic mb-5 leading-relaxed border-l-2 border-blue-500/30 pl-3">
            "Brawl Stars is one of the most popular mobile multiplayer games, featuring over 70 unique brawlers with different abilities, game modes like Gem Grab and Showdown, and regular seasonal updates..."
          </p>
          <p className="text-xs text-slate-500 font-mono mb-3">Keywords →</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {['brawl stars','brawlers','multiplayer','game modes','gem grab','seasonal','abilities','showdown'].map(kw => (
              <span key={kw} className="kw-chip">{kw}</span>
            ))}
          </div>
          <p className="text-xs text-slate-500 font-mono mb-3">Longtail →</p>
          <div className="flex flex-wrap gap-2">
            {['mobile multiplayer game','unique brawler abilities','seasonal game updates'].map(lt => (
              <span key={lt} className="lt-chip">{lt}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────
const FEATURES = [
  {
    icon: '⬡',
    color: 'blue',
    title: 'TF-IDF Algorithm',
    desc: 'Tune the algorithm with your own training texts. The engine learns what words matter in your niche and weights them accordingly.',
  },
  {
    icon: '✦',
    color: 'violet',
    title: 'AI-Powered Mode',
    desc: 'Upgrade to Pro and use our HuggingFace model for semantic, context-aware keyword extraction beyond pure frequency analysis.',
  },
  {
    icon: '⇌',
    color: 'magenta',
    title: 'Longtail Phrases',
    desc: 'Weighted bigram and trigram generation. Every longtail phrase is scored by semantic relevance, not just frequency.',
  },
  {
    icon: '◈',
    color: 'blue',
    title: 'Custom Profiles',
    desc: 'Create separate analyzer profiles for different projects, niches, or languages. Each profile has its own trained weights.',
  },
  {
    icon: '⊝',
    color: 'violet',
    title: 'Ignore Lists',
    desc: 'Block words you never want in your output. Add them manually or import from pre-built niche templates.',
  },
  {
    icon: '{ }',
    color: 'magenta',
    title: 'Full API Access',
    desc: 'Send text, get keywords back. RESTful API with Bearer token auth — integrate into any workflow, pipeline, or CMS.',
  },
];

function Features() {
  const colorMap = {
    blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400' },
    violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  text: 'text-violet-400' },
    magenta: { bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20', text: 'text-fuchsia-400' },
  };

  return (
    <section className="py-24 max-w-6xl mx-auto px-4">
      <div className="text-center mb-14">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Features</p>
        <h2 className="text-4xl font-bold text-white">Everything you need to win at SEO</h2>
        <p className="text-slate-400 mt-4 max-w-xl mx-auto">
          Built on years of real-world keyword analysis — now packaged as a product you can customize and automate.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {FEATURES.map(f => {
          const c = colorMap[f.color];
          return (
            <div key={f.title} className="card hover:border-white/[0.12] transition-all group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4 border ${c.bg} ${c.border} ${c.text}`}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Create a Profile', desc: 'Choose a template or start from scratch. Set your language and niche.' },
    { n: '02', title: 'Train the Algorithm', desc: 'Upload your best-performing texts. The engine calculates word weights from your content.' },
    { n: '03', title: 'Analyze any text', desc: 'Paste text or hit the API. Get back ranked keywords + longtail phrases instantly.' },
    { n: '04', title: 'Integrate & automate', desc: 'Use the REST API to pipe keywords directly into your CMS or content pipeline.' },
  ];

  return (
    <section className="py-24 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-4xl font-bold text-white">From text to keywords in seconds</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-px bg-gradient-to-r from-blue-500/20 via-violet-500/30 to-fuchsia-500/20" />
          {steps.map((s, i) => (
            <div key={i} className="relative text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold mx-auto mb-4 relative z-10"
                   style={{ background: 'linear-gradient(135deg, #1e2a4a, #2a1e4a)', border: '1px solid rgba(124,58,237,0.3)' }}>
                <span className="gradient-text-blue">{s.n}</span>
              </div>
              <h3 className="font-semibold text-white text-sm mb-2">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── API Preview ───────────────────────────────────────────────
function ApiPreview() {
  const code = `curl -X POST https://keyscope-worker.karol-paschek.workers.dev/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Best SEO Practices 2025",
    "content": "...",
    "lang": "en",
    "profile_id": "prof_abc123",
    "keyword_count": 15,
    "longtail_count": 10
  }'`;

  const response = `{
  "keywords": [
    "seo practices", "search ranking",
    "keyword research", "backlinks", ...
  ],
  "longtailKeywords": [
    "best seo practices 2025",
    "improve search ranking fast", ...
  ],
  "metaDescription": "Discover the best SEO..."
}`;

  return (
    <section className="py-24 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold text-fuchsia-400 uppercase tracking-widest mb-3">API</p>
            <h2 className="text-4xl font-bold text-white mb-5">Built for developers</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Send any text to the REST API and receive structured keyword data back.
              Use your trained profile, set the count, and integrate into any stack — headless CMS,
              custom scripts, or automated content pipelines.
            </p>
            <div className="space-y-3">
              {['REST API with Bearer token auth','Profile-specific trained weights','Algorithmic + AI mode via API','Rate limits: 20/day free · 500/day pro'].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-emerald-400">✓</span> {f}
                </div>
              ))}
            </div>
            <Link to="/docs/api" className="btn-secondary mt-8 inline-flex">
              Read API docs →
            </Link>
          </div>

          <div className="space-y-4">
            <div className="card font-mono text-xs">
              <p className="text-slate-500 mb-2">Request</p>
              <pre className="text-blue-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">{code}</pre>
            </div>
            <div className="card font-mono text-xs">
              <p className="text-slate-500 mb-2">Response</p>
              <pre className="text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">{response}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Pricing Preview ───────────────────────────────────────────
function PricingPreview() {
  return (
    <section className="py-24 border-t border-white/[0.06]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Pricing</p>
        <h2 className="text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
        <p className="text-slate-400 mb-12">Start free. Upgrade when you need more.</p>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Free */}
          <div className="card text-left">
            <p className="text-lg font-bold text-white mb-1">Free</p>
            <p className="text-3xl font-extrabold text-white mb-1">€0<span className="text-sm font-normal text-slate-500">/mo</span></p>
            <p className="text-sm text-slate-500 mb-6">Forever free</p>
            <ul className="space-y-2.5 text-sm text-slate-400 mb-8">
              {['20 analyses / day','3 profiles','Algorithmic mode','API access','Pre-built templates'].map(f => (
                <li key={f} className="flex items-center gap-2"><span className="text-blue-400">✓</span>{f}</li>
              ))}
            </ul>
            <Link to="/register" className="btn-secondary w-full justify-center">Get started free</Link>
          </div>

          {/* Pro */}
          <div className="card-glow text-left relative overflow-hidden">
            <div className="absolute top-3 right-3 badge-magenta">Popular</div>
            <p className="text-lg font-bold text-white mb-1">Pro</p>
            <p className="text-3xl font-extrabold text-white mb-1">€9<span className="text-sm font-normal text-slate-500">/mo</span></p>
            <p className="text-sm text-slate-500 mb-6">Everything in Free, plus</p>
            <ul className="space-y-2.5 text-sm text-slate-400 mb-8">
              {['500 analyses / day','50 profiles','AI-powered mode (HF)','200 Training-Dokumente','Priority support'].map(f => (
                <li key={f} className="flex items-center gap-2"><span className="text-fuchsia-400">✓</span>{f}</li>
              ))}
            </ul>
            <Link to="/register" className="btn-primary w-full justify-center shadow-glow-violet">Start Pro</Link>
          </div>
        </div>

        <Link to="/pricing" className="text-sm text-slate-500 hover:text-white transition-colors mt-8 inline-block">
          View full pricing →
        </Link>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="card-glow py-14 px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Start extracting better keywords <span className="gradient-text">today</span>
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            No credit card needed. Get up to 20 free analyses per day — forever.
          </p>
          <Link to="/register" className="btn-primary text-base px-8 py-3.5 shadow-glow-blue">
            Create free account →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Resource Guides ────────────────────────────────────────────
const GUIDES = [
  {
    tag: 'Algorithm',
    to: '/guides/tfidf-keyword-extraction',
    title: 'TF-IDF Keyword Extraction: How the Algorithm Really Works',
    desc: 'Understand the math behind TF-IDF, why it works for SEO, and how to calibrate it with your own corpus for domain-specific results.',
    icon: '⬡',
    color: 'blue',
  },
  {
    tag: 'SEO Strategy',
    to: '/guides/longtail-keywords',
    title: 'Longtail Keywords: The Complete Guide to Low-Competition Phrases',
    desc: 'Longtail keywords account for 70%+ of searches. Learn how to find them algorithmically and build a content strategy around them.',
    icon: '⇄',
    color: 'violet',
  },
  {
    tag: 'AI & ML',
    to: '/guides/ai-keyword-extraction',
    title: 'AI Keyword Extraction: Semantic Models vs. Statistical Algorithms',
    desc: 'When does a transformer model outperform TF-IDF? A deep comparison of embedding-based AI extraction vs. statistical frequency analysis.',
    icon: '❖',
    color: 'magenta',
  },
];

function ResourceGuides() {
  const colorMap = {
    blue:    { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',       icon: 'text-blue-400' },
    violet:  { badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20', icon: 'text-violet-400' },
    magenta: { badge: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20', icon: 'text-fuchsia-400' },
  };
  return (
    <section className="py-24 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Learn</p>
          <h2 className="text-4xl font-bold text-white mb-4">Deep dives on keyword extraction</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Comprehensive guides on the algorithms, strategies, and AI models behind modern SEO keyword analysis.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {GUIDES.map(g => {
            const c = colorMap[g.color];
            return (
              <Link key={g.to} to={g.to}
                    className="card hover:border-white/[0.15] transition-all group flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded border uppercase tracking-wider ${c.badge}`}>{g.tag}</span>
                  <span className={`text-xl ${c.icon}`}>{g.icon}</span>
                </div>
                <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors mb-3 leading-snug flex-1">{g.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{g.desc}</p>
                <p className="text-xs text-blue-400 font-medium">Read guide →</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function Landing() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <ResourceGuides />
      <ApiPreview />
      <PricingPreview />
      <CTA />
    </>
  );
}
