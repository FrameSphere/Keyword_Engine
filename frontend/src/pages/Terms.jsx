// ============================================================
// KeyScope – Terms of Service Page
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

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-600 mb-10">
        <Link to="/" className="hover:text-slate-400 transition-colors">Home</Link>
        <span>›</span>
        <span className="text-slate-400">Terms of Service</span>
      </div>

      <div className="mb-12">
        <span className="inline-block text-xs font-semibold tracking-widest text-blue-400 uppercase mb-4">Legal</span>
        <h1 className="text-4xl font-bold text-white mb-3">Terms of Service</h1>
        <p className="text-slate-500 text-sm">Last updated: January 2025</p>
      </div>

      <Section title="1. Acceptance of Terms">
        <p>
          By creating an account or using KeyScope (the "Service"), you agree to be bound by these Terms
          of Service ("Terms"). If you do not agree, do not use the Service.
        </p>
        <p>
          These Terms constitute a legally binding agreement between you and the operator of KeyScope.
          See the <Link to="/legal" className="text-blue-400 hover:text-blue-300 transition-colors">Legal Notice</Link> for operator details.
        </p>
      </Section>

      <Section title="2. Description of Service">
        <p>
          KeyScope is a keyword analysis SaaS that extracts SEO keywords and longtail phrases from text
          using a TF-IDF algorithm or, for Pro users, an AI model via Hugging Face. The Service is provided
          "as is" and is intended for legitimate SEO and content research purposes.
        </p>
      </Section>

      <Section title="3. Accounts & Eligibility">
        <p>You must be at least 16 years old to create an account. You are responsible for:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Maintaining the confidentiality of your login credentials</li>
          <li>All activity that occurs under your account</li>
          <li>Providing accurate and up-to-date account information</li>
        </ul>
        <p>We reserve the right to suspend or terminate accounts that violate these Terms.</p>
      </Section>

      <Section title="4. Acceptable Use">
        <p>You agree <strong className="text-slate-300">not</strong> to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use the Service for unlawful purposes or to violate any laws</li>
          <li>Submit content that infringes third-party intellectual property rights</li>
          <li>Attempt to reverse-engineer, scrape, or circumvent the API rate limits</li>
          <li>Use automated tools to create multiple accounts or circumvent usage limits</li>
          <li>Interfere with or disrupt the integrity of the Service or its infrastructure</li>
          <li>Resell or sublicense access to the Service without our written permission</li>
        </ul>
      </Section>

      <Section title="5. Plans, Billing & Cancellation">
        <p>
          The Free plan is provided at no cost with daily analysis limits. The Pro plan is a paid subscription
          billed monthly or annually via Stripe.
        </p>
        <p>
          <strong className="text-slate-300">Billing:</strong> Subscription fees are charged at the start of each billing period.
          All prices are in EUR and include applicable taxes unless otherwise stated.
        </p>
        <p>
          <strong className="text-slate-300">Cancellation:</strong> You may cancel your Pro subscription at any time via the
          billing portal in Settings. Access to Pro features continues until the end of the current billing period.
          No refunds are issued for partial periods unless required by applicable law.
        </p>
        <p>
          <strong className="text-slate-300">Downgrades:</strong> If you downgrade to Free, your data is preserved but Pro-only
          features are suspended immediately or at period end depending on the method of cancellation.
        </p>
        <p>
          We reserve the right to change pricing with 30 days' notice. Continued use after a price change
          constitutes acceptance.
        </p>
      </Section>

      <Section title="6. Intellectual Property">
        <p>
          The KeyScope platform, its design, algorithms, and code are owned by the operator and protected
          by applicable intellectual property laws.
        </p>
        <p>
          You retain full ownership of any text you submit for analysis. By submitting text, you grant us
          a limited, non-exclusive license to process it solely for the purpose of providing the Service.
          We do not claim ownership of your content and do not use it to train models without explicit consent.
        </p>
      </Section>

      <Section title="7. Availability & SLA">
        <p>
          We strive for high availability but do not guarantee uninterrupted access. The Service may be
          temporarily unavailable due to maintenance, Cloudflare outages, or other factors outside our control.
          No SLA is provided under the Free plan. Pro users may contact support for incident escalation.
        </p>
      </Section>

      <Section title="8. Disclaimer of Warranties">
        <p>
          THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM
          ALL WARRANTIES INCLUDING FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ACCURACY OF
          KEYWORD RESULTS. YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK.
        </p>
      </Section>

      <Section title="9. Limitation of Liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR DATA, ARISING FROM YOUR
          USE OF THE SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 3 MONTHS
          PRECEDING THE CLAIM.
        </p>
      </Section>

      <Section title="10. Governing Law">
        <p>
          These Terms are governed by and construed in accordance with the laws of Germany.
          Any disputes shall be subject to the exclusive jurisdiction of the competent courts in Germany.
        </p>
      </Section>

      <Section title="11. Changes to Terms">
        <p>
          We may modify these Terms at any time. Material changes will be communicated by updating the
          "Last updated" date and, where appropriate, by email. Continued use of the Service after changes
          constitutes your acceptance.
        </p>
      </Section>

      <Section title="12. Contact">
        <p>
          For questions about these Terms, see our <Link to="/legal" className="text-blue-400 hover:text-blue-300 transition-colors">Legal Notice</Link> for contact details.
        </p>
      </Section>

      <div className="flex gap-4 pt-4 border-t border-white/[0.06]">
        <Link to="/privacy" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy →</Link>
        <Link to="/legal"   className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Legal Notice →</Link>
      </div>
    </div>
  );
}
