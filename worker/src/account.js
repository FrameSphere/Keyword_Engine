// ============================================================
// KeyScope – Account Handler
// POST /account/downgrade → Pro → Free (via DB, ohne Stripe-Cancel)
// ============================================================

import { json, err } from './utils.js';

export async function handleAccount(request, env, user, path) {
  const method = request.method;

  // POST /account/upgrade → jetzt via Stripe (/stripe/checkout)
  if (path === '/account/upgrade' && method === 'POST') {
    return err('Upgrade bitte über /stripe/checkout durchführen.', 400);
  }

  // POST /account/downgrade (optional, für später)
  if (path === '/account/downgrade' && method === 'POST') {
    if (user.plan === 'free') {
      return err('Du bist bereits auf dem Free-Plan.', 400);
    }

    await env.DB.prepare(
      `UPDATE users SET plan = 'free', updated_at = datetime('now') WHERE id = ?`
    ).bind(user.id).run();

    return json({ ok: true, plan: 'free' });
  }

  return err('Not Found', 404);
}
