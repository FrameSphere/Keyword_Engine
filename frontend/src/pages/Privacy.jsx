// ============================================================
// KeyScope – Privacy Policy Page
// ============================================================

import { Link } from 'react-router-dom';

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-white mb-3 pb-2 border-b border-white/[0.07]">{title}</h2>
      <div className="text-slate-400 text-sm leading-7 space-y-3">{children}</div>
    </section>
  );
}

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-600 mb-10">
        <Link to="/" className="hover:text-slate-400 transition-colors">Home</Link>
        <span>›</span>
        <span className="text-slate-400">Privacy Policy</span>
      </div>

      <div className="mb-12">
        <span className="inline-block text-xs font-semibold tracking-widest text-blue-400 uppercase mb-4">Legal</span>
        <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
        <p className="text-slate-500 text-sm">Last updated: January 2025</p>
      </div>

      <Section title="1. Introduction">
        <p>
          KeyScope ("we", "us", or "our") is committed to protecting your personal data. This Privacy Policy
          explains how we collect, use, and safeguard information when you use our keyword analysis platform
          at keyscope.pages.dev (the "Service").
        </p>
        <p>
          By using the Service, you agree to the collection and use of information in accordance with this policy.
        </p>
      </Section>

      <Section title="2. Data We Collect">
        <p><strong className="text-slate-300">Account data:</strong> When you register, we collect your email address and a hashed version of your password. We never store passwords in plain text.</p>
        <p><strong className="text-slate-300">Usage data:</strong> We record analyses you perform (input text, results, timestamp, language, profile used) to provide history features and enforce plan limits.</p>
        <p><strong className="text-slate-300">API usage:</strong> We track API call counts per day to enforce rate limits. No request content beyond what you explicitly submit is logged.</p>
        <p><strong className="text-slate-300">Billing data:</strong> If you subscribe to Pro, payment is handled entirely by Stripe. We only store a Stripe Customer ID and Subscription ID — no card numbers or full payment details ever reach our systems.</p>
        <p><strong className="text-slate-300">Technical data:</strong> Standard server-side logs may include IP addresses and HTTP headers for security and debugging purposes. These are not used for profiling.</p>
      </Section>

      <Section title="3. How We Use Your Data">
        <p>We use the data we collect to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Operate and maintain your account and analysis history</li>
          <li>Process subscription payments via Stripe</li>
          <li>Enforce plan limits and prevent abuse</li>
          <li>Send transactional emails (e.g. password resets) — no marketing without consent</li>
          <li>Improve and debug the Service</li>
        </ul>
        <p>We do <strong className="text-slate-300">not</strong> sell your personal data to third parties.</p>
      </Section>

      <Section title="4. Data Storage & Security">
        <p>
          Your data is stored in Cloudflare D1 (SQLite) databases running within Cloudflare's global infrastructure.
          All data is encrypted at rest and in transit (TLS). Authentication tokens are time-limited and stored
          only in your browser's localStorage.
        </p>
        <p>
          We employ reasonable technical measures to protect your data, but no transmission over the internet
          is 100% secure. Use the Service at your own risk for sensitive content.
        </p>
      </Section>

      <Section title="5. Third-Party Services">
        <p>We use the following third-party processors:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-slate-300">Stripe</strong> — payment processing. Subject to Stripe's Privacy Policy.</li>
          <li><strong className="text-slate-300">Cloudflare</strong> — hosting, CDN, and edge compute. Subject to Cloudflare's Privacy Policy.</li>
          <li><strong className="text-slate-300">Hugging Face</strong> (Pro users, optional AI mode) — text inference. No data is stored by Hugging Face on our behalf.</li>
        </ul>
      </Section>

      <Section title="6. Data Retention">
        <p>
          We retain your account and analysis data for as long as your account is active. If you delete your
          account, your data is permanently removed within 30 days. Analysis history older than 12 months may
          be automatically purged for free-plan users.
        </p>
      </Section>

      <Section title="7. Your Rights">
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Access the personal data we hold about you</li>
          <li>Request correction or deletion of your data</li>
          <li>Export your data in a machine-readable format</li>
          <li>Object to or restrict certain processing</li>
        </ul>
        <p>To exercise any of these rights, contact us at the address in the Legal Notice.</p>
      </Section>

      <Section title="8. Cookies">
        <p>
          KeyScope does not use tracking or advertising cookies. A session token is stored in <code className="text-blue-400 text-xs bg-white/5 px-1.5 py-0.5 rounded">localStorage</code> to
          keep you logged in. No third-party cookies are set by our infrastructure.
        </p>
      </Section>

      <Section title="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Changes will be reflected by updating the
          "Last updated" date at the top of this page. Continued use of the Service after changes constitutes
          acceptance.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          For privacy-related inquiries, see our <Link to="/legal" className="text-blue-400 hover:text-blue-300 transition-colors">Legal Notice</Link> for contact details.
        </p>
      </Section>

      <div className="flex gap-4 pt-4 border-t border-white/[0.06]">
        <Link to="/terms" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Terms of Service →</Link>
        <Link to="/legal" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Legal Notice →</Link>
      </div>
    </div>
  );
}
