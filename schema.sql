-- ============================================================
-- KeyLens D1 Schema
-- Cloudflare D1 (SQLite)
-- ============================================================

-- ── Users ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,           -- UUID
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,              -- bcrypt hash
  plan        TEXT NOT NULL DEFAULT 'free', -- 'free' | 'pro'
  api_key                TEXT UNIQUE,               -- Bearer token for API access
  stripe_customer_id     TEXT UNIQUE,               -- Stripe Customer ID
  stripe_subscription_id TEXT UNIQUE,               -- Stripe Subscription ID
  created_at             TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at             TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Sessions ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sessions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token       TEXT UNIQUE NOT NULL,
  expires_at  TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Profiles (analyzer configurations) ─────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  template_id   TEXT,                    -- NULL = custom, else template reference
  language      TEXT NOT NULL DEFAULT 'de', -- 'de'|'en'|'fr'|'es'|'it'
  config        TEXT NOT NULL DEFAULT '{}', -- JSON: algorithm parameters
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Training Texts (für Algorithm-Tuning) ──────────────────

CREATE TABLE IF NOT EXISTS training_texts (
  id          TEXT PRIMARY KEY,
  profile_id  TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT,
  content     TEXT NOT NULL,
  lang        TEXT NOT NULL DEFAULT 'de',
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Word Weights (gespeicherte Gewichte pro Profil) ─────────

CREATE TABLE IF NOT EXISTS word_weights (
  profile_id  TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  word        TEXT NOT NULL,
  score       REAL NOT NULL,
  doc_freq    INTEGER DEFAULT 1,
  corpus_freq INTEGER DEFAULT 1,
  PRIMARY KEY (profile_id, word)
);

-- ── Ignore Lists ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ignore_words (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_id  TEXT,                      -- NULL = global for user
  word        TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, profile_id, word)
);

-- ── Analyses (History) ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS analyses (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_id      TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  mode            TEXT NOT NULL DEFAULT 'algorithmic', -- 'algorithmic' | 'ai'
  input_text      TEXT NOT NULL,
  input_title     TEXT,
  language        TEXT NOT NULL DEFAULT 'de',
  keywords        TEXT,                  -- JSON array
  longtail        TEXT,                  -- JSON array
  meta_description TEXT,
  keyword_count   INTEGER DEFAULT 10,
  longtail_count  INTEGER DEFAULT 10,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── API Usage Tracking ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS api_usage (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint    TEXT NOT NULL,
  date        TEXT NOT NULL,             -- YYYY-MM-DD
  count       INTEGER NOT NULL DEFAULT 1,
  UNIQUE (user_id, endpoint, date)
);

-- ── Indexes ─────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_sessions_token     ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user      ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user      ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_training_profile   ON training_texts(profile_id);
CREATE INDEX IF NOT EXISTS idx_weights_profile    ON word_weights(profile_id);
CREATE INDEX IF NOT EXISTS idx_ignore_user        ON ignore_words(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user      ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_user     ON api_usage(user_id);
