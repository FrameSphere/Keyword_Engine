// ============================================================
// KeyScope – Account Handler
// POST /account/upgrade   → Free → Pro (Demo-Upgrade, kein Payment)
// GET  /account/plan      → aktuellen Plan abrufen
// ============================================================

import { json, err } from './utils.js';

export async function handleAccount(request, env, user, path) {
  const method = request.method;

  // POST /account/upgrade
  if (path === '/account/upgrade' && method === 'POST') {
    if (user.plan === 'pro') {
      return err('Du hast bereits den Pro-Plan.', 400);
    }

    // In Produktion: hier Stripe/Payment-Check einfügen.
    // Fürs Erste: direktes Upgrade ohne Payment (Demo).
    await env.DB.prepare(
      `UPDATE users SET plan = 'pro', updated_at = datetime('now') WHERE id = ?`
    ).bind(user.id).run();

    return json({ ok: true, plan: 'pro' });
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
