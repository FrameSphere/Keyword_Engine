-- ============================================================
-- KeyScope – Migration: Email Verification + OAuth
-- Run via: wrangler d1 execute keyscope-db --remote --file=schema-oauth-email-migration.sql
-- ============================================================

-- Add email_verified flag to users
ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN oauth_provider TEXT;   -- 'google' | 'github' | NULL
ALTER TABLE users ADD COLUMN oauth_id       TEXT;   -- provider's user id

-- Email verification tokens
CREATE TABLE IF NOT EXISTS email_verifications (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL,
  token      TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_ev_token   ON email_verifications(token);
CREATE INDEX IF NOT EXISTS idx_ev_user    ON email_verifications(user_id);

-- OAuth users have no password – allow NULL
-- (D1/SQLite: password column already TEXT, NULL is implicitly allowed unless NOT NULL was set)
-- If your schema has NOT NULL on password, run:
-- CREATE TABLE users_new (...) then migrate. Otherwise the ALTER above is sufficient.

-- Mark all existing users (registered before this migration) as verified
-- so they don't suddenly see a verification banner
UPDATE users SET email_verified = 1 WHERE email_verified = 0;
