import { Link } from 'react-router-dom';

function CodeBlock({ code, lang = 'bash' }) {
  return (
    <div className="relative rounded-xl overflow-hidden border border-white/[0.08] my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.08]">
        <span className="text-[11px] text-slate-500 font-mono uppercase tracking-wider">{lang}</span>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-slate-300 font-mono leading-relaxed bg-black/20">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Step({ n, title, children }) {
  return (
    <div className="flex gap-4 mb-8">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
           style={{ background: 'linear-gradient(135deg,#2563EB,#7C3AED)' }}>
        {n}
      </div>
      <div className="flex-1 pt-1">
        <h3 className="text-white font-semibold mb-2">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export default function DocsQuickstart() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="badge-blue mb-3 inline-block">Quickstart</span>
        <h1 className="text-3xl font-bold text-white mb-3">Get started in 5 minutes</h1>
        <p className="text-slate-400 leading-relaxed">
          This guide walks you through your first keyword extraction — via the UI and via the REST API.
          No configuration needed for the algorithmic mode; just create an account and go.
        </p>
      </div>

      {/* Steps: UI */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-white/[0.08]">
          Option A — Use the Interface
        </h2>

        <Step n={1} title="Create a free account">
          <p className="text-slate-400 text-sm leading-relaxed">
            Head to <Link to="/register" className="text-blue-400 hover:underline">keylens.io/register</Link> and
            sign up with your email. No credit card required for the Free plan.
            After registration you'll land directly in the Dashboard with a default profile already created.
          </p>
        </Step>

        <Step n={2} title="Open the Analyzer">
          <p className="text-slate-400 text-sm leading-relaxed mb-2">
            Click <strong className="text-white">Analyzer</strong> in the sidebar.
            Paste any text (minimum 50 characters) into the content field.
            Optionally add a page title — titles receive extra weight in the algorithm.
          </p>
          <div className="card bg-blue-500/5 border-blue-500/15 text-sm text-slate-400">
            💡 <strong className="text-white">Tip:</strong> The title field mimics an HTML{' '}
            <code className="text-blue-300 font-mono">&lt;title&gt;</code> tag.
            Words appearing there receive a 6-point bonus in scoring.
          </div>
        </Step>

        <Step n={3} title="Choose a profile & language">
          <p className="text-slate-400 text-sm leading-relaxed">
            Select a profile from the dropdown (your default one is already there) and pick the language
            of your text. KeyLens ships with stopword lists for <strong className="text-white">DE, EN, FR, ES, IT</strong>.
            Custom profiles with your own training data amplify results dramatically — see{' '}
            <Link to="/docs/algorithm" className="text-blue-400 hover:underline">How it works</Link>.
          </p>
        </Step>

        <Step n={4} title="Run & review results">
          <p className="text-slate-400 text-sm leading-relaxed">
            Hit <strong className="text-white">Analyze</strong>. Within milliseconds you'll see:
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-400">
            <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">→</span><span><strong className="text-white">Keywords</strong> — scored single-word terms, sorted by relevance</span></li>
            <li className="flex items-start gap-2"><span className="text-violet-400 mt-0.5">→</span><span><strong className="text-white">Longtail Phrases</strong> — bigrams and trigrams built from the top tokens</span></li>
            <li className="flex items-start gap-2"><span className="text-fuchsia-400 mt-0.5">→</span><span><strong className="text-white">Meta Description</strong> — auto-generated, keyword-rich &lt;meta description&gt;</span></li>
          </ul>
          <p className="text-slate-500 text-sm mt-2">Click any keyword chip to copy it to your clipboard.</p>
        </Step>
      </div>

      {/* Steps: API */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-white/[0.08]">
          Option B — Use the REST API
        </h2>

        <Step n={1} title="Generate an API key">
          <p className="text-slate-400 text-sm leading-relaxed">
            Go to <Link to="/app/settings" className="text-blue-400 hover:underline">Settings → API Keys</Link> and
            click <em>Generate API Key</em>. Copy the key — it won't be shown again.
          </p>
        </Step>

        <Step n={2} title="Make your first request">
          <p className="text-slate-400 text-sm leading-relaxed mb-1">Send a <code className="font-mono text-blue-300">POST</code> to the analyze endpoint:</p>
          <CodeBlock lang="bash" code={`curl -X POST https://keylens-worker.YOUR-SUBDOMAIN.workers.dev/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Die besten SEO-Strategien für 2025",
    "content": "Suchmaschinenoptimierung ist im Jahr 2025 wichtiger denn je...",
    "lang": "de",
    "keyword_count": 10,
    "longtail_count": 8
  }'`} />
        </Step>

        <Step n={3} title="Parse the response">
          <CodeBlock lang="json" code={`{
  "ok": true,
  "mode": "algorithmic",
  "keywords": ["suchmaschinenoptimierung", "strategie", "ranking", "..."],
  "longtailKeywords": ["lokale seo strategie", "keyword recherche 2025", "..."],
  "metaDescription": "Suchmaschinenoptimierung ist 2025 wichtiger denn je...",
  "lang": "de"
}`} />
          <p className="text-slate-400 text-sm">
            That's it. Integrate the response into your CMS, pipeline, or workflow.
            For the full parameter reference, see the{' '}
            <Link to="/docs/api" className="text-blue-400 hover:underline">API Reference</Link>.
          </p>
        </Step>
      </div>

      {/* Next Steps */}
      <div className="card bg-violet-500/5 border-violet-500/15">
        <h3 className="font-semibold text-white mb-3">What's next?</h3>
        <div className="space-y-2 text-sm">
          <Link to="/docs/algorithm" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <span className="text-violet-400">⬡</span> Understand TF-IDF scoring and profile training
          </Link>
          <Link to="/docs/templates" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <span className="text-blue-400">⊞</span> Use pre-built templates for your niche
          </Link>
          <Link to="/docs/api" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <span className="text-fuchsia-400">{ }</span> Full API reference with all endpoints
          </Link>
        </div>
      </div>
    </div>
  );
}
