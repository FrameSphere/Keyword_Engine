// ── API Client ────────────────────────────────────────────────
// Zentraler Fetch-Wrapper für alle Worker-Endpoints

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

// ── Auth ──────────────────────────────────────────────────────
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

  // ── Analyze ─────────────────────────────────────────────────
  analyze: (payload) =>
    req('/analyze', { method: 'POST', body: JSON.stringify(payload) }),

  // ── Profiles ────────────────────────────────────────────────
  profiles: {
    list:   ()                      => req('/profiles'),
    create: (data)                  => req('/profiles', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data)              => req(`/profiles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id)                    => req(`/profiles/${id}`, { method: 'DELETE' }),
  },

  // ── Weights ──────────────────────────────────────────────────
  weights: {
    train:  (profile_id, documents, lang) =>
      req('/weights/train', { method: 'POST', body: JSON.stringify({ profile_id, documents, lang }) }),
    get:    (profileId)  => req(`/weights/${profileId}`),
    delete: (profileId)  => req(`/weights/${profileId}`, { method: 'DELETE' }),
  },

  // ── Ignore ───────────────────────────────────────────────────
  ignore: {
    list:   (profile_id)        => req(`/ignore${profile_id ? `?profile_id=${profile_id}` : ''}`),
    add:    (words, profile_id) => req('/ignore', { method: 'POST', body: JSON.stringify({ words, profile_id }) }),
    remove: (word, profile_id)  => req(`/ignore/${encodeURIComponent(word)}${profile_id ? `?profile_id=${profile_id}` : ''}`, { method: 'DELETE' }),
  },

  // ── History ──────────────────────────────────────────────────
  history: {
    list: (limit = 20, offset = 0) => req(`/history?limit=${limit}&offset=${offset}`),
  },

  // ── API Key ──────────────────────────────────────────────────
  apikey: {
    get:      ()  => req('/apikey'),
    generate: ()  => req('/apikey', { method: 'POST' }),
    revoke:   ()  => req('/apikey', { method: 'DELETE' }),
  },

  // ── Templates (lokal) ───────────────────────────────────────
  templates: () => Promise.resolve([
    { id: 'blog-de',      name: 'Blog Deutsch',       language: 'de', description: 'Blog-Artikel & Content Marketing' },
    { id: 'blog-en',      name: 'Blog English',       language: 'en', description: 'Blog posts & content marketing' },
    { id: 'ecommerce-de', name: 'E-Commerce Deutsch', language: 'de', description: 'Produktbeschreibungen & Online-Shops' },
    { id: 'ecommerce-en', name: 'E-Commerce English', language: 'en', description: 'Product pages & online stores' },
    { id: 'tech-en',      name: 'Tech / Software',    language: 'en', description: 'Technical docs, SaaS & software' },
    { id: 'gaming-de',    name: 'Gaming Deutsch',     language: 'de', description: 'Gaming-Content, Reviews & Guides' },
    { id: 'news-de',      name: 'News / Journalismus',language: 'de', description: 'Nachrichtenartikel & Journalismus' },
  ]),
};
