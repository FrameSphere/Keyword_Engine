import { Link } from 'react-router-dom';

// ── Shared guide primitives ───────────────────────────────────
export function GuideHero({ badge, title, subtitle, readTime }) {
  return (
    <div className="relative border-b border-white/[0.06] pb-10 mb-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="badge-blue">{badge}</span>
        <span className="text-xs text-slate-600">{readTime} min read</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">{title}</h1>
      <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">{subtitle}</p>
    </div>
  );
}

export function GuideSection({ id, title, children }) {
  return (
    <section id={id} className="mb-14 scroll-mt-8">
      <h2 className="text-2xl font-bold text-white mb-5 pb-3 border-b border-white/[0.06]">{title}</h2>
      <div className="prose-guide">{children}</div>
    </section>
  );
}

export function GuideSubSection({ title, children }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      {children}
    </div>
  );
}

export function GuideParagraph({ children }) {
  return <p className="text-slate-400 leading-relaxed mb-4 text-[15px]">{children}</p>;
}

export function GuideHighlight({ children }) {
  return (
    <div className="my-6 px-5 py-4 rounded-xl bg-blue-500/[0.07] border border-blue-500/20 text-sm text-slate-300 leading-relaxed">
      {children}
    </div>
  );
}

export function GuideFormula({ label, formula, explanation }) {
  return (
    <div className="my-6 card bg-black/30 text-center">
      {label && <p className="text-xs text-slate-600 uppercase tracking-wider mb-3">{label}</p>}
      <code className="text-blue-300 font-mono text-base block mb-3">{formula}</code>
      {explanation && <p className="text-xs text-slate-500">{explanation}</p>}
    </div>
  );
}

export function GuideTip({ children }) {
  return (
    <div className="my-5 px-4 py-3 rounded-xl bg-emerald-500/[0.07] border border-emerald-500/20 text-sm text-emerald-300 flex gap-3">
      <span className="flex-shrink-0">💡</span>
      <span>{children}</span>
    </div>
  );
}

export function GuideList({ items }) {
  return (
    <ul className="space-y-2.5 my-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-slate-400 text-[15px]">
          <span className="text-blue-400 mt-0.5 flex-shrink-0">→</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function GuideCTA({ to, label, sub }) {
  return (
    <div className="mt-12 card-glow text-center py-10 px-6">
      <p className="text-white font-bold text-xl mb-2">{label}</p>
      {sub && <p className="text-slate-400 text-sm mb-6">{sub}</p>}
      <Link to={to} className="btn-primary px-8 py-3">
        Try KeyScope free →
      </Link>
    </div>
  );
}

export function GuideTOC({ items }) {
  return (
    <nav className="card bg-white/[0.02] mb-10 sticky top-4">
      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">On this page</p>
      <ul className="space-y-1.5">
        {items.map(item => (
          <li key={item.id}>
            <a href={`#${item.id}`}
               className="text-sm text-slate-400 hover:text-blue-400 transition-colors block py-0.5">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function GuideRelated({ guides }) {
  return (
    <div className="mt-14 pt-8 border-t border-white/[0.06]">
      <p className="text-sm font-semibold text-slate-400 mb-4">Related guides</p>
      <div className="grid md:grid-cols-3 gap-4">
        {guides.map(g => (
          <Link key={g.to} to={g.to}
                className="card hover:border-white/[0.15] transition-all group block">
            <p className="text-xs text-slate-600 mb-1">{g.tag}</p>
            <p className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors leading-snug">{g.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
