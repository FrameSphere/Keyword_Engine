// ── API Client ────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('keyscope_token');
}

async function req(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({ error: 'Network error' }));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  auth: {
    register: (email, password) =>
      req('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
    login: (email, password) =>
      req('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    logout: () =>
      req('/auth/logout', { method: 'POST' }),
    me: () =>
      req('/auth/me'),
  },

  analyze: (payload) =>
    req('/analyze', { method: 'POST', body: JSON.stringify(payload) }),

  profiles: {
    list:   ()             => req('/profiles'),
    create: (data)         => req('/profiles', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data)     => req(`/profiles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id)           => req(`/profiles/${id}`, { method: 'DELETE' }),
  },

  weights: {
    train:  (profile_id, documents, lang) =>
      req('/weights/train', { method: 'POST', body: JSON.stringify({ profile_id, documents, lang }) }),
    get:    (profileId) => req(`/weights/${profileId}`),
    delete: (profileId) => req(`/weights/${profileId}`, { method: 'DELETE' }),
  },

  ignore: {
    list:   (profile_id)        => req(`/ignore${profile_id ? `?profile_id=${profile_id}` : ''}`),
    add:    (words, profile_id) => req('/ignore', { method: 'POST', body: JSON.stringify({ words, profile_id }) }),
    remove: (word, profile_id)  => req(`/ignore/${encodeURIComponent(word)}${profile_id ? `?profile_id=${profile_id}` : ''}`, { method: 'DELETE' }),
  },

  history: {
    list: (limit = 20, offset = 0) => req(`/history?limit=${limit}&offset=${offset}`),
  },

  apikey: {
    get:      () => req('/apikey'),
    generate: () => req('/apikey', { method: 'POST' }),
    revoke:   () => req('/apikey', { method: 'DELETE' }),
  },

  // ── Templates ─────────────────────────────────────────────
  // Gibt Template-Gruppen zurück (für Docs & Dropdown)
  templateGroups: () => Promise.resolve([
    { slug: 'general',   name: 'General',               icon: '◈',  langs: ['de','en','fr','es','it'] },
    { slug: 'blog',      name: 'Blog & Content',         icon: '✍️', langs: ['de','en','fr'] },
    { slug: 'ecommerce', name: 'E-Commerce & Shop',      icon: '🛒', langs: ['de','en'] },
    { slug: 'tech',      name: 'Tech & Software',        icon: '⚙️', langs: ['de','en'] },
    { slug: 'gaming',    name: 'Gaming',                 icon: '🎮', langs: ['de','en'] },
    { slug: 'news',      name: 'News & Journalism',      icon: '📰', langs: ['de','en'] },
    { slug: 'health',    name: 'Health & Fitness',       icon: '💪', langs: ['de','en'] },
    { slug: 'travel',    name: 'Travel & Tourism',       icon: '✈️', langs: ['de','en'] },
    { slug: 'food',      name: 'Food & Recipes',         icon: '🍳', langs: ['de','en'] },
    { slug: 'social',    name: 'Social Media & YouTube', icon: '📱', langs: ['de','en'] },
    { slug: 'legal',     name: 'Legal & Business',       icon: '⚖️', langs: ['de','en'] },
  ]),

  // Flache Template-Liste für Dropdown (id = slug-lang)
  templates: () => Promise.resolve([
    { id: 'general-de',   name: 'General Deutsch',          language: 'de' },
    { id: 'general-en',   name: 'General English',           language: 'en' },
    { id: 'general-fr',   name: 'Général Français',          language: 'fr' },
    { id: 'general-es',   name: 'General Español',           language: 'es' },
    { id: 'general-it',   name: 'Generale Italiano',         language: 'it' },
    { id: 'blog-de',      name: 'Blog Deutsch',              language: 'de' },
    { id: 'blog-en',      name: 'Blog English',              language: 'en' },
    { id: 'blog-fr',      name: 'Blog Français',             language: 'fr' },
    { id: 'ecommerce-de', name: 'E-Commerce Deutsch',        language: 'de' },
    { id: 'ecommerce-en', name: 'E-Commerce English',        language: 'en' },
    { id: 'tech-de',      name: 'Tech & Software DE',        language: 'de' },
    { id: 'tech-en',      name: 'Tech & Software EN',        language: 'en' },
    { id: 'gaming-de',    name: 'Gaming Deutsch',            language: 'de' },
    { id: 'gaming-en',    name: 'Gaming English',            language: 'en' },
    { id: 'news-de',      name: 'News & Journalismus DE',    language: 'de' },
    { id: 'news-en',      name: 'News & Journalism EN',      language: 'en' },
    { id: 'health-de',    name: 'Gesundheit & Fitness DE',   language: 'de' },
    { id: 'health-en',    name: 'Health & Fitness EN',       language: 'en' },
    { id: 'travel-de',    name: 'Reise & Tourismus DE',      language: 'de' },
    { id: 'travel-en',    name: 'Travel & Tourism EN',       language: 'en' },
    { id: 'food-de',      name: 'Essen & Rezepte DE',        language: 'de' },
    { id: 'food-en',      name: 'Food & Recipes EN',         language: 'en' },
    { id: 'social-de',    name: 'Social Media & YouTube DE', language: 'de' },
    { id: 'social-en',    name: 'Social Media & YouTube EN', language: 'en' },
    { id: 'legal-de',     name: 'Recht & Business DE',       language: 'de' },
    { id: 'legal-en',     name: 'Legal & Business EN',       language: 'en' },
  ]),

  // Account
  account: {
    downgrade: () => req('/account/downgrade', { method: 'POST' }),
  },

  // Stripe
  stripe: {
    checkout: () => req('/stripe/checkout', { method: 'POST' }),
    portal:   () => req('/stripe/portal',   { method: 'POST' }),
  },
};
