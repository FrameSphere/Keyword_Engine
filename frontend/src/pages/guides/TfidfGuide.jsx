import {
  GuideHero, GuideSection, GuideSubSection, GuideParagraph,
  GuideHighlight, GuideFormula, GuideTip, GuideList,
  GuideCTA, GuideRelated,
} from './GuideComponents.jsx';

export default function TfidfGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <GuideHero
        badge="Algorithm"
        readTime="12"
        title="TF-IDF Keyword Extraction: How the Algorithm Really Works"
        subtitle="TF-IDF is one of the oldest, most reliable methods for finding the words that actually define a piece of text. This guide breaks down the math, the intuition, and how to use it effectively for SEO keyword research."
      />

      <GuideSection id="what-is-tfidf" title="What is TF-IDF?">
        <GuideParagraph>
          TF-IDF stands for <strong className="text-white">Term Frequency–Inverse Document Frequency</strong>. It is a numerical statistic that reflects how important a word is to a document relative to a collection of documents (a corpus). The idea is elegant: a word that appears often in one document but rarely across all documents is likely a key term for that document.
        </GuideParagraph>
        <GuideParagraph>
          Developed in the 1970s by Karen Spärck Jones, TF-IDF became the backbone of information retrieval systems long before machine learning was practical. Today it still powers search engines, document summarizers, and — critically for SEO — keyword extraction tools. Its strength lies in its simplicity and interpretability: you always know exactly why a word received a high score.
        </GuideParagraph>
        <GuideHighlight>
          <strong>Core insight:</strong> Not all frequent words matter. "The", "is", and "a" appear constantly everywhere — TF-IDF discounts these automatically. Domain-specific terms like "longtail keyword" or "brawler" get boosted because they are rare in general language but frequent in your niche.
        </GuideHighlight>
      </GuideSection>

      <GuideSection id="the-math" title="The Math Behind TF-IDF">
        <GuideSubSection title="Term Frequency (TF)">
          <GuideParagraph>
            Term Frequency simply measures how often a word appears in a document. The raw count alone is misleading — a 2,000-word article naturally contains more repetitions than a 200-word snippet. To normalize, TF is usually calculated as:
          </GuideParagraph>
          <GuideFormula
            label="Term Frequency"
            formula="TF(t, d) = (count of t in d) / (total words in d)"
            explanation="t = term, d = document. Result is a number between 0 and 1."
          />
          <GuideParagraph>
            A word appearing 12 times in a 400-word document has a TF of 0.03. This normalized value lets us compare documents of different lengths fairly.
          </GuideParagraph>
        </GuideSubSection>

        <GuideSubSection title="Inverse Document Frequency (IDF)">
          <GuideParagraph>
            IDF measures how rare or common a term is across your entire corpus. A word that appears in 90% of all documents carries almost no discriminative power — the search engine already knows it's irrelevant. A word that appears in only 2% of documents is far more informative.
          </GuideParagraph>
          <GuideFormula
            label="Inverse Document Frequency"
            formula="IDF(t, D) = log( |D| / (1 + df(t)) )"
            explanation="|D| = number of documents in corpus, df(t) = documents containing term t. The +1 prevents division by zero."
          />
          <GuideParagraph>
            The logarithm prevents IDF from growing unboundedly for very rare terms. In practice, IDF values typically range from 0 (term in every document) to around 8–10 for extremely rare terms.
          </GuideParagraph>
        </GuideSubSection>

        <GuideSubSection title="The Combined TF-IDF Score">
          <GuideParagraph>
            The final TF-IDF score is simply the product of the two values:
          </GuideParagraph>
          <GuideFormula
            label="TF-IDF Score"
            formula="TFIDF(t, d, D) = TF(t, d) × IDF(t, D)"
            explanation="High score = frequent in this document AND rare across all documents = high keyword relevance."
          />
          <GuideParagraph>
            This multiplicative relationship creates a natural balance: a word needs to be both locally frequent and globally rare to score highly. This is exactly what you want for keyword extraction — terms that characterize this specific text without being generic noise.
          </GuideParagraph>
        </GuideSubSection>
      </GuideSection>

      <GuideSection id="tfidf-for-seo" title="Why TF-IDF Matters for SEO Keyword Research">
        <GuideParagraph>
          Google has used TF-IDF-like signals since its earliest days to understand what a page is about. While modern search engines layer neural networks and semantic understanding on top, term frequency patterns remain a fundamental relevance signal — both for the engine and for content creators.
        </GuideParagraph>
        <GuideSubSection title="Finding Primary Keywords">
          <GuideParagraph>
            When you run TF-IDF on your article, the top-scoring single terms are your primary keyword candidates. These are the words your text already treats as important — the algorithm simply makes that implicit emphasis explicit and measurable.
          </GuideParagraph>
          <GuideParagraph>
            This has a critical implication: if you write naturally and thoroughly about a topic, TF-IDF will surface the right keywords automatically. You don't need to "stuff" keywords — you need to cover the topic deeply.
          </GuideParagraph>
        </GuideSubSection>
        <GuideSubSection title="Competitive Gap Analysis">
          <GuideParagraph>
            When you train your keyword profile with 20–50 competitor articles and then analyze your own content against that corpus, TF-IDF reveals which terms your text overuses (already ranking well) and which it underuses (missed opportunities). This is the real power of corpus training — the algorithm becomes domain-specific.
          </GuideParagraph>
          <GuideParagraph>
            A word with high TF in your text but also high document frequency across the corpus will score low — meaning it's a generic topic word. A word with high TF in your text and low corpus frequency is a differentiation opportunity: you're covering something your competitors aren't.
          </GuideParagraph>
        </GuideSubSection>
        <GuideSubSection title="Meta Description Generation">
          <GuideParagraph>
            TF-IDF scores can be used to intelligently select which sentences to include in auto-generated meta descriptions. Sentences that contain the highest-scoring terms best represent the document's content. This is exactly how KeyScope generates meta descriptions — it scores each sentence by the sum of its words' TF-IDF values.
          </GuideParagraph>
        </GuideSubSection>
        <GuideTip>
          Train your KeyScope profile with at least 10–15 articles from the top-5 Google results for your target keyword. The algorithm will learn which words are generic for your niche (high df → low IDF) and which are differentiation opportunities (low df → high IDF).
        </GuideTip>
      </GuideSection>

      <GuideSection id="limitations" title="Limitations of TF-IDF">
        <GuideParagraph>
          TF-IDF is powerful, but not without weaknesses. Understanding them helps you use the algorithm more effectively and know when to reach for the AI mode instead.
        </GuideParagraph>
        <GuideList items={[
          'No semantic understanding: "automobile" and "car" are treated as completely different words. TF-IDF does not understand synonyms or related concepts.',
          'Position-blind: A keyword in the H1 and a keyword buried in paragraph 12 receive the same weight. Many tools add title bonuses (KeyScope applies a +6-point bonus per title word) to compensate.',
          'Language-dependent: Stopword lists and stemming rules must be tuned per language. A German TF-IDF model needs different stopwords than an English one.',
          'Corpus quality is critical: If your training corpus is low-quality content, the IDF values will be miscalibrated. Garbage in, garbage out.',
          'No context window: TF-IDF sees bags of words, not sentences. It cannot understand that "Python" in a programming article means something different than in a zoology article.',
        ]} />
        <GuideParagraph>
          For most SEO keyword extraction tasks — especially when you have a domain-specific corpus to train on — TF-IDF delivers excellent results at near-zero latency and cost. For nuanced semantic analysis, an AI model complements it well.
        </GuideParagraph>
      </GuideSection>

      <GuideSection id="advanced-techniques" title="Advanced TF-IDF Techniques">
        <GuideSubSection title="BM25: A Better TF Saturation">
          <GuideParagraph>
            BM25 (Best Match 25) is a refined version of TF-IDF that addresses one key flaw: raw TF grows linearly, so a word appearing 100 times gets 10× the score of a word appearing 10 times, even though the extra repetitions add less and less new information. BM25 adds a saturation parameter that diminishes returns:
          </GuideParagraph>
          <GuideFormula
            label="BM25 Term Score (simplified)"
            formula="score = IDF × (TF × (k₁+1)) / (TF + k₁ × (1-b+b×|d|/avgdl))"
            explanation="k₁ controls TF saturation (typically 1.2–2.0), b controls length normalization (typically 0.75). Used by Elasticsearch and Lucene."
          />
        </GuideSubSection>
        <GuideSubSection title="Sublinear TF Scaling">
          <GuideParagraph>
            A simpler alternative to BM25: replace raw TF with 1 + log(TF). This preserves the relative ordering of frequent terms while compressing the scale. KeyScope uses this approach internally when computing weights from your training corpus.
          </GuideParagraph>
        </GuideSubSection>
        <GuideSubSection title="N-gram TF-IDF for Longtail Phrases">
          <GuideParagraph>
            Standard TF-IDF operates on single words (unigrams). To extract longtail keyword phrases, you extend the analysis to bigrams (two-word pairs) and trigrams (three-word phrases). Each phrase is treated as a single token and given its own TF-IDF score.
          </GuideParagraph>
          <GuideParagraph>
            The challenge is the combinatorial explosion: a 500-word text has ~500 unigrams, ~499 bigrams, and ~498 trigrams — nearly 1,500 candidates. Effective longtail extraction requires additional filters like minimum co-occurrence thresholds and semantic coherence checks to keep the results manageable.
          </GuideParagraph>
        </GuideSubSection>
        <GuideTip>
          In KeyScope, the longtail engine applies a coherence boost: bigrams and trigrams where both component words individually score high get an additional multiplier. This ensures longtail phrases are semantically tight, not just frequently co-occurring noise.
        </GuideTip>
      </GuideSection>

      <GuideSection id="practical-workflow" title="A Practical TF-IDF SEO Workflow">
        <GuideParagraph>
          Here is the step-by-step process for using TF-IDF effectively in your content workflow:
        </GuideParagraph>
        <GuideList items={[
          'Collect your corpus: Find 15–30 top-ranking articles for your target topic. Copy their full text content.',
          'Train your profile: Upload the corpus to KeyScope. The engine calculates IDF values from this competitive landscape.',
          'Write your draft: Write naturally and comprehensively. Do not stuff keywords.',
          'Run the analysis: Analyze your draft against the trained profile. Review the top 10–15 keywords and top 10 longtail phrases.',
          'Fill the gaps: Keywords that appear in competitor texts (low IDF in your corpus) but not in yours are semantic gaps — your article is missing important topic coverage.',
          'Optimize title and meta: Use your top 3 TF-IDF keywords in the H1 and meta description.',
          'Iterate: After publishing, use the history feature to track how keyword distributions shift across revisions.',
        ]} />
      </GuideSection>

      <GuideSection id="tfidf-vs-ai" title="TF-IDF vs. AI Keyword Extraction">
        <GuideParagraph>
          Modern LLMs and encoder models like BERT can extract keywords with semantic understanding that TF-IDF lacks. Instead of counting words, they encode meaning — recognizing that "machine learning" and "ML" are the same concept, or that "Apple" means different things in different contexts.
        </GuideParagraph>
        <GuideParagraph>
          However, AI extraction is not strictly superior to TF-IDF. For domain-specific SEO work with a trained corpus, TF-IDF often outperforms AI models because it is calibrated to your specific niche. An AI model trained on general internet text may miss hyper-specific industry jargon that your corpus correctly identifies as high-value.
        </GuideParagraph>
        <GuideHighlight>
          <strong>Best practice:</strong> Use TF-IDF as your primary engine for speed, cost efficiency, and domain-specific calibration. Use AI mode as a secondary pass for semantic enrichment — catching synonyms, related concepts, and entity keywords that TF-IDF's bag-of-words model misses.
        </GuideHighlight>
      </GuideSection>

      <GuideCTA
        to="/register"
        label="Try TF-IDF keyword extraction for free"
        sub="Train a custom profile with your corpus and extract keywords instantly. No credit card required."
      />

      <GuideRelated guides={[
        { to: '/guides/longtail-keywords', tag: 'Strategy', title: 'Longtail Keywords: The Complete Guide to Finding Low-Competition Phrases' },
        { to: '/guides/ai-keyword-extraction', tag: 'AI & ML', title: 'AI Keyword Extraction: Semantic Models vs. Statistical Algorithms' },
        { to: '/docs/algorithm', tag: 'Docs', title: 'KeyScope Algorithm Reference & Parameter Tuning' },
      ]} />
    </div>
  );
}
