// ============================================================
// KeyScope – Legal Notice (Impressum)
// ============================================================

import { Link } from 'react-router-dom';

export default function Legal() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-600 mb-10">
        <Link to="/" className="hover:text-slate-400 transition-colors">Home</Link>
        <span>›</span>
        <span className="text-slate-400">Legal Notice</span>
      </div>

      <div className="mb-12">
        <span className="inline-block text-xs font-semibold tracking-widest text-blue-400 uppercase mb-4">Legal</span>
        <h1 className="text-4xl font-bold text-white mb-3">Legal Notice</h1>
        <p className="text-slate-500 text-sm">Information in accordance with § 5 TMG (Germany)</p>
      </div>

      {/* Operator info */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-white/[0.07]">Operator</h2>
        <div className="card text-sm text-slate-400 leading-8 space-y-1">
          <p><strong className="text-slate-200">Service:</strong> KeyScope</p>
          <p><strong className="text-slate-200">Operated by:</strong> FrameSphere</p>
          <p><strong className="text-slate-200">Country:</strong> Germany</p>
          <p>
            <strong className="text-slate-200">Contact:</strong>{' '}
            <a href="mailto:support@keyscope.app"
               className="text-blue-400 hover:text-blue-300 transition-colors">
              support@keyscope.app
            </a>
          </p>
          <p>
            <strong className="text-slate-200">Website:</strong>{' '}
            <a href="https://keyscope.pages.dev" className="text-blue-400 hover:text-blue-300 transition-colors">
              keyscope.pages.dev
            </a>
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-3 pb-2 border-b border-white/[0.07]">Responsibility for Content</h2>
        <p className="text-slate-400 text-sm leading-7">
          The operator is responsible for the content of this website in accordance with general law.
          Despite careful monitoring, we assume no liability for the content of external links.
          The operators of linked pages are solely responsible for their content.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-3 pb-2 border-b border-white/[0.07]">Copyright</h2>
        <p className="text-slate-400 text-sm leading-7">
          The content and works on these pages created by the operator are subject to German copyright law.
          Duplication, editing, distribution, and any kind of use outside the limits of copyright law require
          the written consent of the respective author or creator.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-3 pb-2 border-b border-white/[0.07]">Dispute Resolution</h2>
        <p className="text-slate-400 text-sm leading-7">
          The European Commission provides a platform for online dispute resolution (ODR):
          {' '}<a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer"
             className="text-blue-400 hover:text-blue-300 transition-colors">
            ec.europa.eu/consumers/odr
          </a>. We are not obligated to participate in a dispute settlement procedure before a
          consumer arbitration board and do not participate in it.
        </p>
      </section>

      <div className="flex gap-4 pt-4 border-t border-white/[0.06]">
        <Link to="/privacy" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy →</Link>
        <Link to="/terms"   className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Terms of Service →</Link>
      </div>
    </div>
  );
}
