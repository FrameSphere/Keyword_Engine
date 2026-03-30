import { Link } from 'react-router-dom';
import { useState } from 'react';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    badge: null,
    desc: 'Perfect for testing and small projects.',
    color: 'border-white/[0.10]',
    btnClass: 'btn-secondary',
    btnLabel: 'Get started free',
    btnTo: '/register',
    features: [
      { ok: true,  text: '20 analyses per day' },
      { ok: true,  text: 'Up to 10 keywords + 10 longtail' },
      { ok: true,  text: '3 keyword profiles' },
      { ok: true,  text: '5 languages (DE, EN, FR, ES, IT)' },
      { ok: true,  text: 'Pre-built templates' },
      { ok: true,  text: 'REST API access' },
      { ok: false, text: 'Profile training (TF-IDF)' },
      { ok: false, text: 'AI model mode' },
      { ok: false, text: 'Unlimited history' },
      { ok: false, text: 'Priority support' },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 9.99, yearly: 7.99 },
    badge: 'Most Popular',
    desc: 'For SEO professionals and growing content teams.',
    color: 'border-blue-500/40',
    btnClass: 'btn-primary',
    btnLabel: 'Start Pro — 7 days free',
    btnTo: '/register?plan=pro',
    glow: true,
    features: [
      { ok: true,  text: '500 analyses per day' },
      { ok: true,  text: 'Up to 50 keywords + 50 longtail' },
      { ok: true,  text: 'Unlimited profiles' },
      { ok: true,  text: '5 languages (DE, EN, FR, ES, IT)' },
      { ok: true,  text: 'Pre-built templates' },
      { ok: true,  text: 'REST API access' },
      { ok: true,  text: 'Profile training (TF-IDF corpus)' },
      { ok: true,  text: 'AI model mode (Hugging Face)' },
      { ok: true,  text: 'Full analysis history' },
      { ok: true,  text: 'Priority support' },
    ],
  },
];

const FAQ = [
  {
    q: 'What counts as one "analysis"?',
    a: 'Each call to the /analyze endpoint — whether via the UI or the API — counts as one analysis. The result includes keywords, longtail phrases, and a meta description.',
  },
  {
    q: 'What is profile training?',
    a: 'You provide a corpus of example texts from your niche (e.g. 20 blog posts). KeyLens runs TF-IDF on them to learn which words are rare and valuable in your domain. These weights are then applied to every subsequent analysis with that profile.',
  },
  {
    q: 'What is the AI mode?',
    a: 'Instead of the algorithmic TF-IDF engine, your text is sent to a fine-tuned Hugging Face model that returns keywords and longtail phrases. This is a Pro-only feature. Results may differ in style and coverage from the algorithm.',
  },
  {
    q: 'Can I upgrade or downgrade at any time?',
    a: 'Yes. Plan changes take effect immediately. If you downgrade, your data is preserved but access to Pro features is suspended.',
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'Yes — Pro includes a 7-day free trial. No credit card required to start.',
  },
  {
    q: 'Do unused analyses roll over?',
    a: 'No. Daily limits reset at midnight UTC.',
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center mb-14">
        <span className="badge-blue mb-4 inline-block">Pricing</span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Simple, transparent<br />
          <span className="gradient-text">pricing</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Start free, scale when you're ready. No hidden fees. Cancel anytime.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className={`text-sm transition-colors ${!yearly ? 'text-white font-medium' : 'text-slate-500'}`}>Monthly</span>
          <button
            onClick={() => setYearly(y => !y)}
            className={`relative w-12 h-6 rounded-full transition-colors ${yearly ? 'bg-blue-600' : 'bg-white/10'}`}>
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${yearly ? 'left-7' : 'left-1'}`} />
          </button>
          <span className={`text-sm transition-colors ${yearly ? 'text-white font-medium' : 'text-slate-500'}`}>
            Yearly <span className="badge-violet ml-1">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-20">
        {PLANS.map(plan => (
          <div key={plan.id}
               className={`card relative flex flex-col ${plan.color} ${plan.glow ? 'card-glow' : ''}`}>
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="badge-violet text-xs px-3 py-1 font-semibold">{plan.badge}</span>
              </div>
            )}

            <div className="mb-6">
              <p className="text-slate-400 text-sm font-medium mb-1">{plan.name}</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-white">
                  {plan.price.monthly === 0 ? 'Free' : `$${(yearly ? plan.price.yearly : plan.price.monthly).toFixed(2)}`}
                </span>
                {plan.price.monthly > 0 && (
                  <span className="text-slate-500 text-sm mb-1.5">/ month</span>
                )}
              </div>
              {plan.price.monthly > 0 && yearly && (
                <p className="text-xs text-emerald-400">Billed ${ (plan.price.yearly * 12).toFixed(2) }/year</p>
              )}
              <p className="text-slate-500 text-sm mt-2">{plan.desc}</p>
            </div>

            <Link to={plan.btnTo}
              className={`${plan.btnClass} text-center mb-6 py-2.5`}>
              {plan.btnLabel}
            </Link>

            <ul className="space-y-3 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold
                    ${f.ok ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-600'}`}>
                    {f.ok ? '✓' : '×'}
                  </span>
                  <span className={f.ok ? 'text-slate-300' : 'text-slate-600 line-through'}>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Compare plans</h2>
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                <th className="text-left px-6 py-4 text-slate-400 font-medium">Feature</th>
                <th className="text-center px-6 py-4 text-slate-400 font-medium">Free</th>
                <th className="text-center px-6 py-4 text-white font-semibold">Pro</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Daily analyses',         '20',         '500'],
                ['Keywords per result',    'up to 10',   'up to 50'],
                ['Longtail phrases',       'up to 10',   'up to 50'],
                ['Profiles',              '3',           'Unlimited'],
                ['Languages',             '5',           '5'],
                ['REST API',              '✓',           '✓'],
                ['Templates',             '✓',           '✓'],
                ['Profile Training',      '—',           '✓'],
                ['AI Model mode',         '—',           '✓'],
                ['Analysis history',      '7 days',      'Unlimited'],
                ['Support',               'Community',   'Priority'],
              ].map(([feat, free, pro], i) => (
                <tr key={i} className={`border-b border-white/[0.04] last:border-0 ${i % 2 === 0 ? '' : 'bg-white/[0.015]'}`}>
                  <td className="px-6 py-3.5 text-slate-400">{feat}</td>
                  <td className="px-6 py-3.5 text-center text-slate-500">{free}</td>
                  <td className="px-6 py-3.5 text-center text-blue-400 font-medium">{pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mb-20">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently asked questions</h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div key={i} className="card cursor-pointer hover:border-white/[0.12] transition-all"
                 onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div className="flex items-center justify-between">
                <p className="text-white text-sm font-medium pr-4">{item.q}</p>
                <span className={`text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </div>
              {openFaq === i && (
                <p className="text-slate-400 text-sm mt-3 leading-relaxed border-t border-white/[0.06] pt-3">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center card-glow card">
        <h2 className="text-2xl font-bold text-white mb-3">Ready to level up your SEO keywords?</h2>
        <p className="text-slate-400 mb-6">Start for free — no credit card required.</p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/register" className="btn-primary px-8 py-3">Get Started Free</Link>
          <Link to="/docs" className="btn-ghost px-6 py-3">Read the Docs</Link>
        </div>
      </div>
    </div>
  );
}
