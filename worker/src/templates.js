// ============================================================
// KeyScope – Template Definitions
// Gruppiert nach Konzept, mehrere Sprachen pro Template
// ============================================================

// Jedes Template-Konzept hat einen slug, Metadaten und
// pro Sprache eine eigene Konfiguration (gleicher slug + lang-suffix als ID)

export const TEMPLATE_GROUPS = [
  {
    slug:  'general',
    name:  'General',
    icon:  '◈',
    color: 'slate',
    desc:  'Neutral all-purpose profile for any text type. Good starting point when no niche-specific template fits.',
    useCases: ['Any text', 'Mixed content', 'Unknown niche', 'Quick analysis'],
    longtail: 'Balanced bigram/trigram extraction, no niche bias.',
    langs: ['de', 'en', 'fr', 'es', 'it'],
  },
  {
    slug:  'blog',
    name:  'Blog & Content',
    icon:  '✍️',
    color: 'blue',
    desc:  'Blog articles, how-to guides, content marketing and editorial texts.',
    useCases: ['Blog articles', 'How-To guides', 'Content marketing', 'Magazine posts'],
    longtail: 'Favors question-style bigrams (how + verb, best + noun, was + Nomen).',
    langs: ['de', 'en', 'fr'],
  },
  {
    slug:  'ecommerce',
    name:  'E-Commerce & Shop',
    icon:  '🛒',
    color: 'violet',
    desc:  'Product pages, shop categories, buying guides and Amazon listings.',
    useCases: ['Product pages', 'Category pages', 'Amazon SEO', 'Buying guides'],
    longtail: 'Targets transactional phrases: "buy + product", "best + attribute".',
    langs: ['de', 'en'],
  },
  {
    slug:  'tech',
    name:  'Tech & Software',
    icon:  '⚙️',
    color: 'emerald',
    desc:  'Technical docs, SaaS landing pages, dev blogs and software reviews.',
    useCases: ['SaaS pages', 'API docs', 'Dev blogs', 'Software reviews'],
    longtail: 'Generates "tool + use case" and "framework + comparison" phrases.',
    langs: ['de', 'en'],
  },
  {
    slug:  'gaming',
    name:  'Gaming',
    icon:  '🎮',
    color: 'fuchsia',
    desc:  'Game reviews, guides, walkthroughs, patch notes and YouTube descriptions.',
    useCases: ['Game reviews', 'Guides', 'Walkthroughs', 'YouTube descriptions'],
    longtail: 'Targets "game + guide", "best + class/build" and title bigrams.',
    langs: ['de', 'en'],
  },
  {
    slug:  'news',
    name:  'News & Journalism',
    icon:  '📰',
    color: 'amber',
    desc:  'News articles, press releases, reportages and interviews.',
    useCases: ['News articles', 'Press releases', 'Reportages', 'Interviews'],
    longtail: 'Favors location bigrams, person bigrams and event trigrams.',
    langs: ['de', 'en'],
  },
  {
    slug:  'health',
    name:  'Health & Fitness',
    icon:  '💪',
    color: 'green',
    desc:  'Health articles, fitness guides, nutrition content and wellness blogs.',
    useCases: ['Health articles', 'Fitness guides', 'Nutrition', 'Wellness blogs'],
    longtail: 'Boosts symptom-phrases, exercise names and "how to + health verb".',
    langs: ['de', 'en'],
  },
  {
    slug:  'travel',
    name:  'Travel & Tourism',
    icon:  '✈️',
    color: 'cyan',
    desc:  'Travel guides, destination content, hotel reviews and trip reports.',
    useCases: ['Travel guides', 'Destination articles', 'Hotel reviews', 'Trip reports'],
    longtail: 'Targets "city + activity", "best + destination" and "travel + tip".',
    langs: ['de', 'en'],
  },
  {
    slug:  'food',
    name:  'Food & Recipes',
    icon:  '🍳',
    color: 'orange',
    desc:  'Recipe content, food blogs, restaurant reviews and nutrition articles.',
    useCases: ['Recipes', 'Food blogs', 'Restaurant reviews', 'Nutrition'],
    longtail: 'Focuses on ingredient bigrams, preparation methods and dish names.',
    langs: ['de', 'en'],
  },
  {
    slug:  'social',
    name:  'Social Media & YouTube',
    icon:  '📱',
    color: 'pink',
    desc:  'YouTube descriptions, social captions, influencer content and short-form posts.',
    useCases: ['YouTube descriptions', 'Instagram captions', 'TikTok posts', 'Shorts'],
    longtail: 'Emphasizes hashtag-adjacent terms and trending phrase patterns.',
    langs: ['de', 'en'],
  },
  {
    slug:  'legal',
    name:  'Legal & Business',
    icon:  '⚖️',
    color: 'slate',
    desc:  'Legal texts, business documents, contracts and compliance content.',
    useCases: ['Legal articles', 'Business docs', 'Contracts', 'Compliance'],
    longtail: 'Extracts clause-style bigrams and formal compound terms.',
    langs: ['de', 'en'],
  },
];

// ── Flache Template-Map (wie vorher) — ID = slug-lang ────────
export const TEMPLATES = {

  // ── General ──────────────────────────────────────────────
  'general-de': {
    name: 'General Deutsch', language: 'de',
    description: 'Allgemeines Profil für beliebige Texte',
    config: { titleBonus: 6, positionBonus: 2, lengthThreshold: 5 },
    ignoreWords: ['text', 'inhalt', 'seite', 'bereich', 'punkt', 'teil', 'form', 'weise'],
  },
  'general-en': {
    name: 'General English', language: 'en',
    description: 'All-purpose profile for any text type',
    config: { titleBonus: 6, positionBonus: 2, lengthThreshold: 5 },
    ignoreWords: ['content', 'page', 'section', 'point', 'part', 'form', 'way', 'thing'],
  },
  'general-fr': {
    name: 'Général Français', language: 'fr',
    description: 'Profil général pour tout type de texte',
    config: { titleBonus: 6, positionBonus: 2, lengthThreshold: 5 },
    ignoreWords: ['contenu', 'page', 'partie', 'point', 'section', 'texte'],
  },
  'general-es': {
    name: 'General Español', language: 'es',
    description: 'Perfil general para cualquier tipo de texto',
    config: { titleBonus: 6, positionBonus: 2, lengthThreshold: 5 },
    ignoreWords: ['contenido', 'página', 'sección', 'punto', 'parte', 'texto'],
  },
  'general-it': {
    name: 'Generale Italiano', language: 'it',
    description: 'Profilo generale per qualsiasi tipo di testo',
    config: { titleBonus: 6, positionBonus: 2, lengthThreshold: 5 },
    ignoreWords: ['contenuto', 'pagina', 'sezione', 'punto', 'parte', 'testo'],
  },

  // ── Blog ─────────────────────────────────────────────────
  'blog-de': {
    name: 'Blog Deutsch', language: 'de',
    description: 'Deutschsprachige Blog-Artikel und Content Marketing',
    config: { titleBonus: 8, positionBonus: 3, lengthThreshold: 5 },
    ignoreWords: ['artikel', 'beitrag', 'text', 'inhalt', 'seite', 'blog', 'post', 'thema',
      'punkt', 'bereich', 'teil', 'schritt', 'beispiel', 'grund', 'fazit', 'einleitung'],
  },
  'blog-en': {
    name: 'Blog English', language: 'en',
    description: 'English blog posts and content marketing',
    config: { titleBonus: 8, positionBonus: 3, lengthThreshold: 5 },
    ignoreWords: ['article', 'post', 'blog', 'content', 'page', 'section', 'point', 'part',
      'step', 'example', 'reason', 'summary', 'intro', 'conclusion', 'topic', 'tips'],
  },
  'blog-fr': {
    name: 'Blog Français', language: 'fr',
    description: 'Articles de blog et marketing de contenu en français',
    config: { titleBonus: 8, positionBonus: 3, lengthThreshold: 5 },
    ignoreWords: ['article', 'billet', 'contenu', 'page', 'section', 'point', 'partie',
      'étape', 'exemple', 'raison', 'résumé', 'intro', 'conclusion', 'sujet'],
  },

  // ── E-Commerce ────────────────────────────────────────────
  'ecommerce-de': {
    name: 'E-Commerce Deutsch', language: 'de',
    description: 'Produktbeschreibungen und Online-Shops',
    config: { titleBonus: 10, positionBonus: 2, lengthThreshold: 4 },
    ignoreWords: ['produkt', 'artikel', 'bestellen', 'preis', 'angebot', 'shop',
      'versand', 'lieferung', 'zahlung', 'kontakt', 'impressum', 'warenkorb'],
  },
  'ecommerce-en': {
    name: 'E-Commerce English', language: 'en',
    description: 'Product descriptions and online stores',
    config: { titleBonus: 10, positionBonus: 2, lengthThreshold: 4 },
    ignoreWords: ['product', 'item', 'order', 'price', 'offer', 'shop', 'shipping',
      'delivery', 'payment', 'contact', 'checkout', 'cart', 'store'],
  },

  // ── Tech ─────────────────────────────────────────────────
  'tech-de': {
    name: 'Tech & Software DE', language: 'de',
    description: 'Technische Dokumentation, SaaS und Software-Content',
    config: { titleBonus: 7, positionBonus: 2, lengthThreshold: 4 },
    ignoreWords: ['klicken', 'öffnen', 'schließen', 'button', 'menü', 'seite', 'bildschirm',
      'nutzer', 'system', 'datei', 'ordner', 'fenster', 'tab', 'feld', 'option'],
  },
  'tech-en': {
    name: 'Tech & Software EN', language: 'en',
    description: 'Technical docs, SaaS landing pages and dev content',
    config: { titleBonus: 7, positionBonus: 2, lengthThreshold: 4 },
    ignoreWords: ['click', 'open', 'close', 'button', 'menu', 'page', 'screen', 'user',
      'system', 'data', 'file', 'folder', 'window', 'tab', 'field', 'option', 'settings'],
  },

  // ── Gaming ────────────────────────────────────────────────
  'gaming-de': {
    name: 'Gaming Deutsch', language: 'de',
    description: 'Gaming-Content, Reviews und Guides auf Deutsch',
    config: { titleBonus: 9, positionBonus: 2, lengthThreshold: 4 },
    ignoreWords: ['spiel', 'spieler', 'spielen', 'level', 'punkte', 'runde', 'match',
      'modus', 'version', 'update', 'patch', 'server', 'account'],
  },
  'gaming-en': {
    name: 'Gaming English', language: 'en',
    description: 'Game reviews, guides and gaming content in English',
    config: { titleBonus: 9, positionBonus: 2, lengthThreshold: 4 },
    ignoreWords: ['game', 'player', 'play', 'level', 'score', 'round', 'match', 'mode',
      'version', 'update', 'patch', 'server', 'account', 'win', 'lose'],
  },

  // ── News ─────────────────────────────────────────────────
  'news-de': {
    name: 'News & Journalismus DE', language: 'de',
    description: 'Nachrichtenartikel und journalistische Texte',
    config: { titleBonus: 10, positionBonus: 5, lengthThreshold: 5 },
    ignoreWords: ['laut', 'sagt', 'sagte', 'erklärt', 'berichtet', 'zufolge',
      'heißt', 'teilte', 'äußerte', 'bestätigte', 'bericht', 'meldung', 'mitteilung'],
  },
  'news-en': {
    name: 'News & Journalism EN', language: 'en',
    description: 'News articles and journalistic texts in English',
    config: { titleBonus: 10, positionBonus: 5, lengthThreshold: 5 },
    ignoreWords: ['said', 'says', 'told', 'according', 'reported', 'confirmed', 'added',
      'noted', 'stated', 'announced', 'report', 'statement', 'release', 'spokesperson'],
  },

  // ── Health ────────────────────────────────────────────────
  'health-de': {
    name: 'Gesundheit & Fitness DE', language: 'de',
    description: 'Gesundheitsartikel, Fitness-Guides und Wellness-Content',
    config: { titleBonus: 8, positionBonus: 3, lengthThreshold: 5 },
    ignoreWords: ['körper', 'gesund', 'gesundheit', 'tipps', 'hilfe', 'ratgeber',
      'arzt', 'praxis', 'behandlung', 'produkt', 'mittel'],
  },
  'health-en': {
    name: 'Health & Fitness EN', language: 'en',
    description: 'Health articles, fitness guides and wellness content',
    config: { titleBonus: 8, positionBonus: 3, lengthThreshold: 5 },
    ignoreWords: ['body', 'health', 'healthy', 'tips', 'help', 'guide', 'doctor',
      'treatment', 'product', 'supplement', 'study', 'research'],
  },

  // ── Travel ────────────────────────────────────────────────
  'travel-de': {
    name: 'Reise & Tourismus DE', language: 'de',
    description: 'Reiseführer, Reiseberichte und Hotel-Reviews auf Deutsch',
    config: { titleBonus: 9, positionBonus: 3, lengthThreshold: 4 },
    ignoreWords: ['reise', 'reisen', 'urlaub', 'hotel', 'flug', 'buchen', 'preis',
      'angebot', 'tipp', 'tipps', 'ausflug', 'erlebnis'],
  },
  'travel-en': {
    name: 'Travel & Tourism EN', language: 'en',
    description: 'Travel guides, destination content and hotel reviews',
    config: { titleBonus: 9, positionBonus: 3, lengthThreshold: 4 },
    ignoreWords: ['travel', 'trip', 'hotel', 'flight', 'book', 'price', 'offer',
      'tip', 'tips', 'visit', 'experience', 'tour', 'tourist'],
  },

  // ── Food ─────────────────────────────────────────────────
  'food-de': {
    name: 'Essen & Rezepte DE', language: 'de',
    description: 'Rezepte, Food-Blogs und Restaurant-Reviews auf Deutsch',
    config: { titleBonus: 9, positionBonus: 2, lengthThreshold: 4 },
    ignoreWords: ['rezept', 'zubereitung', 'zutaten', 'kochen', 'backen', 'gericht',
      'portion', 'minuten', 'stunden', 'schritt', 'schüssel', 'pfanne'],
  },
  'food-en': {
    name: 'Food & Recipes EN', language: 'en',
    description: 'Recipes, food blogs and restaurant reviews in English',
    config: { titleBonus: 9, positionBonus: 2, lengthThreshold: 4 },
    ignoreWords: ['recipe', 'ingredient', 'cooking', 'baking', 'dish', 'serving',
      'minutes', 'hours', 'step', 'bowl', 'pan', 'cup', 'tablespoon', 'teaspoon'],
  },

  // ── Social ────────────────────────────────────────────────
  'social-de': {
    name: 'Social Media & YouTube DE', language: 'de',
    description: 'YouTube-Beschreibungen, Social Captions und Kurzform-Content',
    config: { titleBonus: 10, positionBonus: 4, lengthThreshold: 4, minNgramScore: 0.02 },
    ignoreWords: ['video', 'kanal', 'abonnieren', 'abonnement', 'like', 'kommentar',
      'folgen', 'teilen', 'klicken', 'link', 'beschreibung', 'thumbnail'],
  },
  'social-en': {
    name: 'Social Media & YouTube EN', language: 'en',
    description: 'YouTube descriptions, social captions and short-form content',
    config: { titleBonus: 10, positionBonus: 4, lengthThreshold: 4, minNgramScore: 0.02 },
    ignoreWords: ['video', 'channel', 'subscribe', 'like', 'comment', 'follow', 'share',
      'click', 'link', 'description', 'thumbnail', 'watch', 'stream'],
  },

  // ── Legal ─────────────────────────────────────────────────
  'legal-de': {
    name: 'Recht & Business DE', language: 'de',
    description: 'Juristische Texte, Geschäftsdokumente und Compliance-Content',
    config: { titleBonus: 7, positionBonus: 2, lengthThreshold: 6 },
    ignoreWords: ['gemäß', 'wonach', 'hiermit', 'sowie', 'beziehungsweise', 'entsprechend',
      'vorliegend', 'nachfolgend', 'vorgenannt', 'unterzeichnet', 'vertragspartei'],
  },
  'legal-en': {
    name: 'Legal & Business EN', language: 'en',
    description: 'Legal texts, business documents and compliance content',
    config: { titleBonus: 7, positionBonus: 2, lengthThreshold: 6 },
    ignoreWords: ['pursuant', 'herein', 'thereof', 'hereto', 'whereas', 'notwithstanding',
      'aforementioned', 'hereafter', 'hereinafter', 'foregoing', 'party', 'parties'],
  },
};

// Gibt Template-Gruppen-Liste für Frontend zurück
export function getTemplateGroups() {
  return TEMPLATE_GROUPS.map(g => ({
    ...g,
    variants: g.langs.map(lang => ({
      id:       `${g.slug}-${lang}`,
      lang,
      name:     TEMPLATES[`${g.slug}-${lang}`]?.name || `${g.name} ${lang.toUpperCase()}`,
      description: TEMPLATES[`${g.slug}-${lang}`]?.description || '',
    })).filter(v => TEMPLATES[v.id]), // nur vorhandene
  }));
}

// Gibt flache Template-Liste zurück (für Dropdown im Profil-Erstellen)
export function getTemplateList() {
  return Object.entries(TEMPLATES).map(([id, t]) => ({
    id,
    name:        t.name,
    language:    t.language,
    description: t.description,
  }));
}
