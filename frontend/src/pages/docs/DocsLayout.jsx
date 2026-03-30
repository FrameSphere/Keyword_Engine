import { NavLink, Outlet } from 'react-router-dom';

const NAV = [
  { to: '/docs',              label: 'Overview',     icon: '◈' },
  { to: '/docs/quickstart',   label: 'Quickstart',   icon: '▷' },
  { to: '/docs/algorithm',    label: 'How it works', icon: '⬡' },
  { to: '/docs/api',          label: 'API Reference',icon: '{ }' },
  { to: '/docs/templates',    label: 'Templates',    icon: '⊞' },
];

export default function DocsLayout() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-[200px,1fr] gap-10">
        {/* Sidebar */}
        <aside>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Docs</p>
          <nav className="space-y-0.5">
            {NAV.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/docs'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-blue-500/10 text-blue-400 font-medium'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }>
                <span className="text-xs">{l.icon}</span>
                {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0">
          <div className="prose-keylens">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
