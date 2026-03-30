// ============================================================
// KeyLens – Vorgefertigte Profil-Templates
// ============================================================

export const TEMPLATES = {
  // ── Blog / Content Marketing ─────────────────────────────
  'blog-de': {
    name:     'Blog Deutsch',
    language: 'de',
    description: 'Optimiert für deutschsprachige Blog-Artikel und Content Marketing',
    config: {
      titleBonus:      8,
      positionBonus:   3,
      lengthThreshold: 5,
    },
    ignoreWords: [
      'artikel', 'beitrag', 'text', 'inhalt', 'seite', 'blog', 'post',
      'thema', 'punkt', 'bereich', 'teil', 'schritt', 'weise', 'form',
      'beispiel', 'grund', 'zusammenfassung', 'einleitung', 'fazit',
    ],
  },

  'blog-en': {
    name:     'Blog English',
    language: 'en',
    description: 'Optimized for English blog posts and content marketing',
    config: {
      titleBonus:      8,
      positionBonus:   3,
      lengthThreshold: 5,
    },
    ignoreWords: [
      'article', 'post', 'blog', 'content', 'page', 'site', 'section',
      'point', 'part', 'step', 'example', 'reason', 'summary', 'intro',
      'conclusion', 'overview', 'topic', 'tips', 'guide', 'way', 'ways',
    ],
  },

  // ── E-Commerce ────────────────────────────────────────────
  'ecommerce-de': {
    name:     'E-Commerce Deutsch',
    language: 'de',
    description: 'Optimiert für Produktbeschreibungen und Online-Shops',
    config: {
      titleBonus:      10,
      positionBonus:   2,
      lengthThreshold: 4,
    },
    ignoreWords: [
      'produkt', 'artikel', 'bestellen', 'kaufen', 'preis', 'angebot',
      'shop', 'versand', 'lieferung', 'zahlung', 'kontakt', 'impressum',
    ],
  },

  'ecommerce-en': {
    name:     'E-Commerce English',
    language: 'en',
    description: 'Optimized for product descriptions and online stores',
    config: {
      titleBonus:      10,
      positionBonus:   2,
      lengthThreshold: 4,
    },
    ignoreWords: [
      'product', 'item', 'order', 'buy', 'price', 'offer', 'shop',
      'shipping', 'delivery', 'payment', 'contact', 'checkout', 'cart',
    ],
  },

  // ── Tech / Software ───────────────────────────────────────
  'tech-en': {
    name:     'Tech / Software',
    language: 'en',
    description: 'Optimized for technical documentation, SaaS, and software content',
    config: {
      titleBonus:      7,
      positionBonus:   2,
      lengthThreshold: 4,
    },
    ignoreWords: [
      'click', 'open', 'close', 'button', 'menu', 'page', 'screen',
      'user', 'users', 'system', 'data', 'file', 'files', 'folder',
      'window', 'tab', 'field', 'form', 'option', 'settings', 'mode',
    ],
  },

  // ── Gaming ────────────────────────────────────────────────
  'gaming-de': {
    name:     'Gaming Deutsch',
    language: 'de',
    description: 'Optimiert für Gaming-Content, Reviews und Guides',
    config: {
      titleBonus:      9,
      positionBonus:   2,
      lengthThreshold: 4,
    },
    ignoreWords: [
      'spiel', 'spieler', 'spielen', 'game', 'games', 'level', 'punkte',
      'runde', 'match', 'modus', 'version', 'update', 'patch',
    ],
  },

  // ── News / Journalismus ───────────────────────────────────
  'news-de': {
    name:     'News / Journalismus',
    language: 'de',
    description: 'Optimiert für Nachrichtenartikel und journalistische Texte',
    config: {
      titleBonus:      10,
      positionBonus:   5,
      lengthThreshold: 5,
    },
    ignoreWords: [
      'laut', 'sagt', 'sagte', 'erklärt', 'berichtet', 'zufolge',
      'heißt', 'teilte', 'äußerte', 'bestätigte', 'bericht', 'meldung',
    ],
  },
};

// Gibt Template-Liste für Frontend zurück (ohne ignoreWords)
export function getTemplateList() {
  return Object.entries(TEMPLATES).map(([id, t]) => ({
    id,
    name:        t.name,
    language:    t.language,
    description: t.description,
  }));
}
