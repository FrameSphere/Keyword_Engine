import {
  GuideHero, GuideSection, GuideSubSection, GuideParagraph,
  GuideHighlight, GuideFormula, GuideTip, GuideList,
  GuideCTA, GuideRelated,
} from './GuideComponents.jsx';

export default function AiKeywordGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <GuideHero
        badge="AI & Machine Learning"
        readTime="13"
        title="AI Keyword Extraction: Semantic Models vs. Statistical Algorithms"
        subtitle="AI-powered keyword extraction uses neural networks to understand meaning, not just frequency. This guide explains how transformer-based models work, how they compare to TF-IDF, and when to use each approach for SEO."
      />

      <GuideSection id="two-approaches" title="Two Fundamentally Different Approaches">
        <GuideParagraph>
          Keyword extraction has two major paradigms. The classical approach — TF-IDF and its variants — counts words and applies statistical weighting. The AI approach — transformer-based neural networks — encodes the meaning of words in high-dimensional vector spaces.
        </GuideParagraph>
        <GuideParagraph>
          The difference is not just technical. It changes what kind of keywords each approach can find. TF-IDF excels at surfacing the exact terms that define a document's topic within a specific corpus. AI models excel at finding semantically related concepts, named entities, and contextually relevant phrases that may not appear frequently in the text.
        </GuideParagraph>
        <GuideHighlight>
          <strong>The key insight:</strong> Statistical methods find words that are statistically important. AI models find words that are semantically important. Both kinds of importance matter for SEO — and they don't always overlap.
        </GuideHighlight>
      </GuideSection>

      <GuideSection id="how-ai-extraction-works" title="How AI Keyword Extraction Works">
        <GuideSubSection title="Word Embeddings and Vector Spaces">
          <GuideParagraph>
            The foundation of modern AI keyword extraction is the word embedding — a learned representation of a word as a high-dimensional vector (typically 256 to 1024 numbers). Words with similar meanings end up with similar vectors: "automobile" and "car" are close together; "car" and "banana" are far apart.
          </GuideParagraph>
          <GuideParagraph>
            This solves TF-IDF's synonym blindness. Once words are represented as vectors, you can find semantically related terms without requiring exact string matches. A search for "electric vehicle" automatically surfaces content about "EVs", "Tesla", "battery range", and "charging stations" — even if those words never appear in the query.
          </GuideParagraph>
        </GuideSubSection>
        <GuideSubSection title="Transformer Architecture (BERT, RoBERTa, and Derivatives)">
          <GuideParagraph>
            Modern AI keyword tools are built on transformer models. Unlike earlier neural networks that processed text sequentially, transformers process all words simultaneously and model relationships between every word pair via an attention mechanism.
          </GuideParagraph>
          <GuideParagraph>
            BERT (Bidirectional Encoder Representations from Transformers), released by Google in 2018, was a watershed moment. For the first time, a model could read text in both directions simultaneously — understanding that "bank" in "river bank" and "bank" in "bank account" are different things purely from context. This contextual understanding is the core advantage of AI extraction over TF-IDF.
          </GuideParagraph>
          <GuideFormula
            label="Attention Mechanism (simplified)"
            formula="Attention(Q,K,V) = softmax(QKᵀ / √d_k) × V"
            explanation="Q=query, K=key, V=value matrices. Each word attends to all other words, weighting by relevance. This is how transformers understand context."
          />
        </GuideSubSection>
        <GuideSubSection title="KeyBERT and Embedding-Based Extraction">
          <GuideParagraph>
            The most widely used AI keyword extraction approach is KeyBERT-style embedding comparison. The algorithm works in three steps: first, generate an embedding for the entire document; second, generate embeddings for each candidate keyword (extracted via n-gram parsing); third, return the candidates whose embeddings are most similar to the document embedding.
          </GuideParagraph>
          <GuideParagraph>
            Cosine similarity measures how "close" two vectors are in direction, regardless of magnitude. A keyword with a cosine similarity of 0.85 to the document embedding is highly representative. One at 0.2 is semantically distant — even if it appears frequently.
          </GuideParagraph>
          <GuideTip>
            KeyBERT-style extraction tends to return diversified, representative keywords. But it can miss domain-specific jargon if the model was not trained on domain-relevant data. This is why corpus-trained TF-IDF often outperforms general AI models in niche industries.
          </GuideTip>
        </GuideSubSection>
        <GuideSubSection title="Named Entity Recognition (NER)">
          <GuideParagraph>
            A specialized form of AI extraction, NER identifies structured entities: people, organizations, locations, products, dates, and events. For SEO, NER is particularly valuable because named entities often represent high-intent search queries — brand names, product models, and public figures attract specific, high-conversion searches.
          </GuideParagraph>
          <GuideParagraph>
            A modern NER model can extract "iPhone 16 Pro Max", "Tim Cook", and "Apple Park" from a technology article — all high-value entity keywords that TF-IDF would not specifically prioritize (since "apple" appears constantly in tech content and thus has a low IDF score despite being highly relevant).
          </GuideParagraph>
        </GuideSubSection>
      </GuideSection>

      <GuideSection id="ai-vs-tfidf" title="AI vs. TF-IDF: A Detailed Comparison">
        <div className="overflow-x-auto rounded-xl border border-white/[0.08] my-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/[0.08]">
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Criterion</th>
                <th className="text-left px-4 py-3 text-blue-400 font-medium">TF-IDF</th>
                <th className="text-left px-4 py-3 text-violet-400 font-medium">AI (Transformer)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Synonym handling', '❌ None', '✅ Native'],
                ['Context awareness', '❌ Bag of words', '✅ Full bidirectional context'],
                ['Domain adaptation', '✅ Train on your corpus', '⚠️ Requires fine-tuning'],
                ['Latency', '✅ <50ms', '⚠️ 500ms–5s depending on model'],
                ['Cost', '✅ Near zero', '⚠️ GPU inference cost'],
                ['Interpretability', '✅ Score is fully explainable', '⚠️ Black box'],
                ['Niche jargon', '✅ Learned from corpus', '⚠️ May miss hyper-specific terms'],
                ['Named entities', '❌ Treated as words', '✅ Identified as entities'],
                ['Language support', '✅ Configurable stopwords', '⚠️ Model-dependent'],
                ['No corpus needed', '❌ Better with corpus', '✅ Works zero-shot'],
              ].map(([crit, tfidf, ai], i) => (
                <tr key={i} className="border-b border-white/[0.04] last:border-0">
                  <td className="px-4 py-3 text-slate-400">{crit}</td>
                  <td className="px-4 py-3 text-slate-300">{tfidf}</td>
                  <td className="px-4 py-3 text-slate-300">{ai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <GuideParagraph>
          Neither approach dominates across all criteria. The practical winner depends on your specific context — industry niche, corpus availability, latency requirements, and the type of keywords you need.
        </GuideParagraph>
      </GuideSection>

      <GuideSection id="when-to-use-ai" title="When to Use AI Extraction">
        <GuideSubSection title="No Training Corpus Available">
          <GuideParagraph>
            TF-IDF requires a corpus to compute meaningful IDF values. Without it, every word is treated equally and the statistical approach degrades. AI models are pre-trained on massive text datasets and work competently zero-shot — without any domain-specific training.
          </GuideParagraph>
          <GuideParagraph>
            If you're analyzing text from a brand-new niche, or you simply don't have 10+ competitor articles to train on, AI extraction immediately outperforms untrained TF-IDF. The AI model's general language understanding substitutes for domain-specific corpus knowledge.
          </GuideParagraph>
        </GuideSubSection>
        <GuideSubSection title="Multilingual Content at Scale">
          <GuideParagraph>
            Modern multilingual transformer models (mBERT, XLM-RoBERTa, multilingual-e5) can process 100+ languages from a single model checkpoint. Maintaining separate TF-IDF stopword lists, stemming algorithms, and training corpora for each language is operationally expensive. A single multilingual AI model handles all of them.
          </GuideParagraph>
        </GuideSubSection>
        <GuideSubSection title="Entity-Rich Content">
          <GuideParagraph>
            Product reviews, news articles, and company profiles contain dense named entity references. AI models with NER capability extract these entities reliably — brand names, model numbers, people's names — as distinct keyword types that deserve specific SEO treatment.
          </GuideParagraph>
        </GuideSubSection>
        <GuideSubSection title="Semantic Diversity Requirements">
          <GuideParagraph>
            For content that needs to cover a topic comprehensively — long-form pillar pages, Wikipedia-style references, educational content — AI extraction surfaces semantically diverse keyword clusters. Maximal Marginal Relevance (MMR), a technique used in AI keyword tools, explicitly penalizes redundant keywords, ensuring the output covers different aspects of the topic rather than returning ten variations of the same phrase.
          </GuideParagraph>
        </GuideSubSection>
        <GuideTip>
          In KeyScope, switch to AI mode when you're analyzing text with heavy entity references (proper nouns, brand names, technical model numbers) or when you need semantic diversity rather than corpus-calibrated frequency weighting.
        </GuideTip>
      </GuideSection>

      <GuideSection id="when-to-use-tfidf" title="When to Use TF-IDF">
        <GuideList items={[
          'Niche industries: Medical, legal, financial, and technical domains have vocabulary that general AI models underweight. A corpus-trained TF-IDF model learns your niche\'s specific terminology naturally.',
          'High-volume automated pipelines: TF-IDF runs in under 50ms per document with minimal CPU. For CMS integrations processing hundreds of articles per day, AI latency and cost become prohibitive.',
          'Competitive gap analysis: TF-IDF naturally reveals what your content covers that competitors don\'t (and vice versa) through IDF differential analysis. AI models don\'t have a native corpus-comparison mode.',
          'Full interpretability: When you need to explain to a client or editor exactly why a keyword was selected, TF-IDF scores are transparent and auditable. AI scores are opaque.',
          'Language control: If you need precise control over stopwords, stemming behavior, or tokenization (e.g., for a language not well covered by standard AI models), TF-IDF is fully configurable.',
        ]} />
      </GuideSection>

      <GuideSection id="hybrid-approach" title="The Hybrid Approach: Best of Both Worlds">
        <GuideParagraph>
          The most sophisticated keyword extraction pipelines use TF-IDF and AI models in sequence, combining their complementary strengths.
        </GuideParagraph>
        <GuideSubSection title="Stage 1: TF-IDF Candidate Generation">
          <GuideParagraph>
            Run TF-IDF on the document using a domain-trained corpus. This produces a ranked list of statistically important terms — your corpus-calibrated candidates. This stage is fast (&lt;100ms) and generates a large candidate pool.
          </GuideParagraph>
        </GuideSubSection>
        <GuideSubSection title="Stage 2: AI Semantic Scoring">
          <GuideParagraph>
            Pass the top TF-IDF candidates through an embedding model. Score each by cosine similarity to the document embedding. Re-rank the candidates by a weighted combination of TF-IDF score and semantic similarity.
          </GuideParagraph>
          <GuideFormula
            label="Hybrid Score"
            formula="score = α × TF-IDF_score + (1-α) × cosine_similarity"
            explanation="α is a tunable parameter. α=0.7 weights statistical relevance more heavily; α=0.3 favors semantic similarity."
          />
        </GuideSubSection>
        <GuideSubSection title="Stage 3: Entity Injection">
          <GuideParagraph>
            Run a NER pass to extract named entities and inject them into the final keyword list, bypassing the frequency-based scoring entirely. Entities are always relevant — a product name or person mentioned even once in an article is a legitimate keyword candidate.
          </GuideParagraph>
        </GuideSubSection>
        <GuideParagraph>
          This three-stage pipeline delivers corpus-calibrated statistical keywords, semantically diverse coverage, and entity awareness in a single pass. It's the architecture used by enterprise-grade SEO platforms — now accessible via KeyScope's Pro AI mode.
        </GuideParagraph>
      </GuideSection>

      <GuideSection id="huggingface-models" title="AI Models for Keyword Extraction: An Overview">
        <GuideSubSection title="Sentence Transformers">
          <GuideParagraph>
            Sentence Transformers (SBERT) are the workhorses of embedding-based keyword extraction. Models like <code className="font-mono text-blue-300 text-xs">all-MiniLM-L6-v2</code> and <code className="font-mono text-blue-300 text-xs">multi-qa-mpnet-base-dot-v1</code> generate document and phrase embeddings that are fast to compute and highly effective for cosine similarity comparisons. These are the models powering most open-source keyword extraction tools.
          </GuideParagraph>
        </GuideSubSection>
        <GuideSubSection title="Multilingual Models">
          <GuideParagraph>
            <code className="font-mono text-blue-300 text-xs">multilingual-e5-large</code> and <code className="font-mono text-blue-300 text-xs">paraphrase-multilingual-mpnet-base-v2</code> cover 50–100 languages from a single model. They are slightly less accurate than their monolingual counterparts on English but dramatically more practical for multilingual content teams.
          </GuideParagraph>
        </GuideSubSection>
        <GuideSubSection title="Large Language Models (LLMs)">
          <GuideParagraph>
            GPT-4, Claude, and open-source LLMs like Llama can extract keywords via prompted reasoning. Their advantage is instruction-following: you can specify exactly what kind of keywords you want ("extract only product-related terms with commercial intent"). Their disadvantage is cost — LLM inference is 10–100× more expensive than embedding models for the same task.
          </GuideParagraph>
          <GuideParagraph>
            For production keyword extraction at scale, embedding-based models remain the practical choice. LLMs are best reserved for post-processing — ranking, categorizing, or explaining a pre-generated keyword list.
          </GuideParagraph>
        </GuideSubSection>
        <GuideTip>
          KeyScope's AI mode routes to a Hugging Face Space running a sentence transformer fine-tuned for multilingual keyword extraction. Pro users get this semantic layer on top of the statistical engine — the best of both approaches.
        </GuideTip>
      </GuideSection>

      <GuideCTA
        to="/register"
        label="Try both algorithmic and AI keyword extraction"
        sub="KeyScope Pro includes both TF-IDF and AI modes. Compare results side-by-side. First 20 analyses are free."
      />

      <GuideRelated guides={[
        { to: '/guides/tfidf-keyword-extraction', tag: 'Algorithm', title: 'TF-IDF Keyword Extraction: How the Algorithm Really Works' },
        { to: '/guides/longtail-keywords', tag: 'SEO Strategy', title: 'Longtail Keywords: The Complete Guide to Finding Low-Competition Phrases' },
        { to: '/docs/api', tag: 'Docs', title: 'KeyScope REST API: Integrate AI Keyword Extraction in Your Stack' },
      ]} />
    </div>
  );
}
