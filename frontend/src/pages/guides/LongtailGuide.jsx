import {
  GuideHero, GuideSection, GuideSubSection, GuideParagraph,
  GuideHighlight, GuideTip, GuideList, GuideCTA, GuideRelated,
} from './GuideComponents.jsx';

export default function LongtailGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <GuideHero
        badge="SEO Strategy"
        readTime="14"
        title="Longtail Keywords: The Complete Guide to Finding Low-Competition Phrases"
        subtitle="Longtail keywords account for over 70% of all search queries — yet most content teams focus on a handful of head terms. This guide explains what longtail keywords are, how to find them algorithmically, and how to build a content strategy around them."
      />

      <GuideSection id="what-are-longtail" title="What Are Longtail Keywords?">
        <GuideParagraph>
          The term "longtail" comes from the statistical distribution of search queries. If you plot every search query against its monthly search volume, you get a power-law distribution: a small number of head terms (e.g., "SEO") command enormous search volume, while a very long tail of specific, multi-word queries each attract only a handful of searches.
        </GuideParagraph>
        <GuideParagraph>
          Longtail keywords are typically 3 to 6 words long and highly specific. Instead of "coffee", a longtail query might be "best pour-over coffee grinder under €100". Instead of "SEO", it might be "how to do keyword research for a B2B SaaS blog in German".
        </GuideParagraph>
        <GuideHighlight>
          <strong>The longtail paradox:</strong> Individual longtail keywords have low search volume, but collectively they account for the majority of all searches. A site ranking for 500 longtail phrases will often receive more total traffic than a site ranking #4 for a single head term — with far less competition on each individual phrase.
        </GuideHighlight>
        <GuideSubSection title="Head Terms vs. Longtail: A Comparison">
          <div className="overflow-x-auto rounded-lg border border-white/[0.08] my-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/[0.08]">
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Property</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Head Term</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Longtail Keyword</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Example', 'SEO', 'keyword research for SaaS blogs'],
                  ['Monthly searches', '1M+', '50–500'],
                  ['Competition', 'Extremely high', 'Low to medium'],
                  ['Conversion intent', 'Informational/vague', 'High intent, specific'],
                  ['Time to rank', '12–24 months', '1–3 months'],
                  ['Content required', 'Domain authority needed', 'Quality content sufficient'],
                ].map(([prop, head, lt], i) => (
                  <tr key={i} className="border-b border-white/[0.04] last:border-0">
                    <td className="px-4 py-3 text-slate-400">{prop}</td>
                    <td className="px-4 py-3 text-slate-500">{head}</td>
                    <td className="px-4 py-3 text-emerald-400">{lt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GuideSubSection>
      </GuideSection>

      <GuideSection id="why-longtail" title="Why Longtail Keywords Win in 2025">
        <GuideSubSection title="Search Intent Alignment">
          <GuideParagraph>
            Google's primary mission is to match search intent. Longtail queries express intent with much more precision than head terms. Someone searching "best pour-over coffee grinder under €100" is clearly in buying mode — they know the brewing method, the product type, and their budget. This specificity makes it far easier to create content that perfectly matches what they need.
          </GuideParagraph>
          <GuideParagraph>
            Head terms are ambiguous. "Coffee" might mean a recipe, a history lesson, a product comparison, or a café finder. Ranking for it requires either massive domain authority or a very broad page that satisfies everyone — which usually satisfies no one deeply.
          </GuideParagraph>
        </GuideSubSection>
        <GuideSubSection title="AI Search and Conversational Queries">
          <GuideParagraph>
            With the rise of AI-powered search interfaces (Google's AI Overviews, Perplexity, ChatGPT), conversational query patterns have accelerated dramatically. Users increasingly ask complete questions: "what is the difference between TF-IDF and BM25 for keyword extraction?" rather than searching "TF-IDF BM25".
          </GuideParagraph>
          <GuideParagraph>
            These AI search tools are trained to surface content that precisely answers specific questions. A well-structured article targeting longtail phrases is far more likely to be cited in an AI answer than a generic overview page.
          </GuideParagraph>
        </GuideSubSection>
        <GuideSubSection title="Lower Competition, Faster ROI">
          <GuideParagraph>
            Most of your competitors are chasing the same 20 head terms. The longtail space is orders of magnitude less competitive. A new domain with quality content can realistically rank on page 1 for specific longtail phrases within weeks, while it might take years to crack the first page for a head term.
          </GuideParagraph>
          <GuideParagraph>
            The ROI calculation shifts dramatically: if you can publish 3 well-researched longtail articles per week, you build a compounding traffic base where each article attracts a modest but stable stream of highly qualified visitors.
          </GuideParagraph>
        </GuideSubSection>
        <GuideTip>
          Target one primary longtail keyword per article, but include 4–6 semantically related longtail variants naturally throughout the content. Google understands semantic clustering — ranking for the primary phrase often brings rankings for related variants automatically.
        </GuideTip>
      </GuideSection>

      <GuideSection id="finding-longtail" title="How to Find Longtail Keywords Algorithmically">
        <GuideParagraph>
          Manual longtail research (brainstorming, Google autocomplete, People Also Ask boxes) has severe scale limitations. Algorithmic approaches let you systematically mine longtail opportunities from large text corpora.
        </GuideParagraph>
        <GuideSubSection title="N-gram Extraction with TF-IDF">
          <GuideParagraph>
            The most reliable method for automated longtail extraction is bigram and trigram TF-IDF analysis. Instead of scoring individual words, you treat word pairs and triples as single tokens and score them the same way. A phrase like "keyword research tool" might have a TF-IDF score as a unit that none of its individual words achieve alone.
          </GuideParagraph>
          <GuideParagraph>
            The algorithm works in three stages: first, extract all bigrams and trigrams from the text; second, filter by minimum frequency threshold (phrases appearing only once are usually noise); third, score each phrase using the same IDF values from your training corpus.
          </GuideParagraph>
        </GuideSubSection>
        <GuideSubSection title="Semantic Coherence Filtering">
          <GuideParagraph>
            Not all frequently co-occurring word pairs are meaningful longtail candidates. "the algorithm" or "is very" are frequent bigrams but worthless as keywords. Effective tools apply coherence filters:
          </GuideParagraph>
          <GuideList items={[
            'Part-of-speech filtering: require at least one noun in the phrase',
            'Stopword boundary rules: phrases cannot start or end with stopwords',
            'Component word score threshold: both words in a bigram should individually score above a minimum TF-IDF value',
            'Character length minimum: phrases shorter than 15 characters are usually too generic',
          ]} />
        </GuideSubSection>
        <GuideSubSection title="Corpus-Based IDF for Competitive Analysis">
          <GuideParagraph>
            If you train your extraction model on competitor content, the IDF values reflect your competitive landscape. A longtail phrase that appears in your article but rarely in competitor articles has a low IDF — meaning the algorithm hasn't seen it often. This is either a hidden gem (underserved phrase you're uniquely covering) or a phrase no one is searching for.
          </GuideParagraph>
          <GuideParagraph>
            Cross-referencing corpus-rare phrases with actual search volume data (from Google Search Console or keyword tools) separates the gems from the noise. This two-stage approach — algorithm-first, search-volume-second — is the most efficient way to build a longtail keyword list.
          </GuideParagraph>
        </GuideSubSection>
      </GuideSection>

      <GuideSection id="longtail-content-strategy" title="Building a Longtail Content Strategy">
        <GuideSubSection title="The Pillar-Cluster Model">
          <GuideParagraph>
            The most effective content architecture for longtail SEO is the pillar-cluster model. A single comprehensive pillar page covers a broad topic (e.g., "SEO Keyword Research: The Complete Guide"). Multiple cluster pages, each targeting a specific longtail query, link back to the pillar.
          </GuideParagraph>
          <GuideParagraph>
            The pillar page signals topical authority to Google. The cluster pages capture specific longtail queries. Internal links between them distribute PageRank and help Google understand the thematic relationship. The entire cluster rises in rankings together.
          </GuideParagraph>
        </GuideSubSection>
        <GuideSubSection title="Longtail Keyword Mapping">
          <GuideParagraph>
            Before writing, map each longtail keyword to a specific article in your content calendar. The mapping should be one-to-one — two articles targeting the same longtail phrase cannibalize each other and confuse Google about which page to rank.
          </GuideParagraph>
          <GuideParagraph>
            Group semantically similar longtail phrases into single articles. An article about "pour-over coffee grinder" can naturally cover "best manual coffee grinder for pour-over", "hand grinder pour-over coffee", and "burr grinder pour-over recommendation" — all in a single comprehensive piece without keyword stuffing.
          </GuideParagraph>
        </GuideSubSection>
        <GuideSubSection title="Search Intent Matching">
          <GuideParagraph>
            Every longtail keyword has an associated search intent. Get this wrong and you will rank briefly and then drop as Google measures user behavior (bounce rate, time on page, return visits).
          </GuideParagraph>
          <GuideList items={[
            'Informational intent ("how does TF-IDF work") → comprehensive explanatory article with examples',
            'Navigational intent ("KeyScope pricing") → dedicated pricing page with clear CTAs',
            'Commercial intent ("best keyword extraction tool for developers") → comparison article with honest pros and cons',
            'Transactional intent ("buy SEO keyword tool monthly") → landing page with immediate purchase option',
          ]} />
        </GuideSubSection>
        <GuideTip>
          Run your finished article through a TF-IDF analyzer to verify that the longtail phrases you targeted actually surface in the top results. If they don't, your content mentions the words but not with sufficient density or semantic context. Add a dedicated section or FAQ entry for each target phrase.
        </GuideTip>
      </GuideSection>

      <GuideSection id="measuring-longtail" title="Measuring Longtail Keyword Performance">
        <GuideParagraph>
          Unlike head terms where ranking position is easy to track, longtail performance is often scattered across hundreds of variations. Here is how to measure it effectively:
        </GuideParagraph>
        <GuideList items={[
          'Google Search Console: the "Queries" report reveals which longtail variants are already driving impressions. Sort by impressions to find phrases at position 6–15 — these are your quick-win optimization targets.',
          'Click-through rate as success proxy: a longtail phrase at position 3 with a 15% CTR is performing well. The same position with 2% CTR signals a title or meta description mismatch.',
          'Semantic clustering in GSC: group queries by topic (use a spreadsheet with CONTAINS filters) to understand which content clusters are gaining momentum.',
          'Long-term traffic compounding: longtail articles often show a characteristic pattern — slow initial growth followed by an inflection point around months 2–4 as Google fully indexes and trusts the content.',
        ]} />
      </GuideSection>

      <GuideSection id="longtail-tools" title="Tools for Longtail Keyword Research">
        <GuideParagraph>
          The most effective longtail research combines several approaches:
        </GuideParagraph>
        <GuideSubSection title="Algorithmic Extraction (KeyScope)">
          <GuideParagraph>
            Feed your draft articles or competitor content into KeyScope's TF-IDF engine with a trained profile. The bigram/trigram extraction surfaces longtail phrases that already exist in your content — these are your strongest candidates because they reflect the language your specific audience uses.
          </GuideParagraph>
        </GuideSubSection>
        <GuideSubSection title="Google Search Console">
          <GuideParagraph>
            Your own GSC data is the most valuable longtail source available. Queries with more than 3 words, at positions 5–20, with more than 100 impressions per month are your prime optimization targets — you're already being shown for them, but not clicking yet.
          </GuideParagraph>
        </GuideSubSection>
        <GuideSubSection title="People Also Ask & Autocomplete">
          <GuideParagraph>
            Google's PAA boxes are algorithmically generated longtail questions. Every PAA result represents a distinct search intent that Google has identified as related to your topic. Answer these questions explicitly in your content (ideally in a dedicated FAQ section with schema markup).
          </GuideParagraph>
        </GuideSubSection>
        <GuideSubSection title="Forum and Community Mining">
          <GuideParagraph>
            Reddit, Quora, industry-specific forums, and Discord communities are goldmines for natural-language longtail phrases. Real users articulate their questions in exactly the words they type into search engines. Mining these communities for recurring question patterns yields longtail keywords that no tool would generate — because they come directly from your target audience.
          </GuideParagraph>
        </GuideSubSection>
      </GuideSection>

      <GuideCTA
        to="/register"
        label="Extract longtail keywords from your content for free"
        sub="KeyScope's bigram and trigram engine surfaces longtail phrases algorithmically. No credit card needed."
      />

      <GuideRelated guides={[
        { to: '/guides/tfidf-keyword-extraction', tag: 'Algorithm', title: 'TF-IDF Keyword Extraction: How the Algorithm Really Works' },
        { to: '/guides/ai-keyword-extraction', tag: 'AI & ML', title: 'AI Keyword Extraction: Semantic Models vs. Statistical Algorithms' },
        { to: '/docs/quickstart', tag: 'Docs', title: 'KeyScope Quickstart: Extract Keywords in 5 Minutes' },
      ]} />
    </div>
  );
}
