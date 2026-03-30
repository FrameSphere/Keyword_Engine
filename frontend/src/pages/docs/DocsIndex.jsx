import { Link } from 'react-router-dom';

const sections = [
  { icon: '▷', title: 'Quickstart',    desc: 'Get up and running in 5 minutes', to: '/docs/quickstart' },
  { icon: '⬡', title: 'How it works',  desc: 'TF-IDF algorithm explained',       to: '/docs/algorithm' },
  { icon: '{ }', title: 'API Reference', desc: 'REST API endpoints and examples', to: '/docs/api' },
  { icon: '⊞', title: 'Templates',     desc: 'Pre-built niche profiles',          to: '/docs/templates' },
];

export default function DocsIndex() {
  return (
    <div>
      <div className="mb-10">
        <span className="badge-blue mb-3 inline-block">Documentation</span>
        <h1 className="text-4xl font-bold text-white mb-4">KeyLens Docs</h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
          Everything you need to extract, manage, and automate SEO keywords — from quick UI use to full API integration.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {sections.map(s => (
          <Link key={s.to} to={s.to}
            className="card hover:border-white/[0.15] transition-all group block">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-blue-400 text-lg">{s.icon}</span>
              <h2 className="font-semibold text-white group-hover:text-blue-300 transition-colors">{s.title}</h2>
            </div>
            <p className="text-sm text-slate-500">{s.desc}</p>
          </Link>
        ))}
      </div>

      <div className="card mt-8 bg-blue-500/5 border-blue-500/15">
        <h3 className="font-semibold text-white mb-2">Need help?</h3>
        <p className="text-sm text-slate-400">
          Check the <Link to="/docs/quickstart" className="text-blue-400 hover:underline">Quickstart guide</Link> to
          get your first keyword extraction running in minutes. For API integration,
          head to the <Link to="/docs/api" className="text-blue-400 hover:underline">API Reference</Link>.
        </p>
      </div>
    </div>
  );
}
