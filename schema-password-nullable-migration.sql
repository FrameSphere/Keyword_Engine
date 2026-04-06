-- ============================================================
-- KeyScope – Migration: Allow NULL password for OAuth users
-- Run via:
--   wrangler d1 execute keyscope-db --remote --file=schema-password-nullable-migration.sql
-- ============================================================

-- SQLite does not support ALTER COLUMN, so we recreate the table.

-- 1. Create new table with password nullable
CREATE TABLE IF NOT EXISTS users_new (
  id                     TEXT PRIMARY KEY,
  email                  TEXT UNIQUE NOT NULL,
  password               TEXT,                          -- NULL for OAuth-only accounts
  plan                   TEXT NOT NULL DEFAULT 'free',
  api_key                TEXT UNIQUE,
  stripe_customer_id     TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  email_verified         INTEGER NOT NULL DEFAULT 0,
  oauth_provider         TEXT,
  oauth_id               TEXT,
  created_at             TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at             TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. Copy all existing data
INSERT INTO users_new
  SELECT
    id, email, password, plan,
    api_key, stripe_customer_id, stripe_subscription_id,
    COALESCE(email_verified, 0),
    oauth_provider, oauth_id,
    created_at, updated_at
  FROM users;

-- 3. Swap tables
DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

-- 4. Recreate indexes that referenced users
CREATE INDEX IF NOT EXISTS idx_sessions_token   ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user    ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user    ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_ignore_user      ON ignore_words(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user    ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_user   ON api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ev_token         ON email_verifications(token);
CREATE INDEX IF NOT EXISTS idx_ev_user          ON email_verifications(user_id);
