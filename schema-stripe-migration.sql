-- ============================================================
-- KeyScope – Stripe Migration (Fix: UNIQUE via Index, nicht Column)
-- wrangler d1 execute keyscope-db --remote --file=schema-stripe-migration.sql
-- ============================================================

ALTER TABLE users ADD COLUMN stripe_customer_id     TEXT;
ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_stripe_sub      ON users(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;
