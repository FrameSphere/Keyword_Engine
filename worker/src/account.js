// ============================================================
// KeyScope – Account Handler
// POST /account/downgrade
// DELETE /account → delete account + all data
// ============================================================

import { json, err } from './utils.js';

export async function handleAccount(request, env, user, path) {
  const method = request.method;

  // POST /account/upgrade → via Stripe
  if (path === '/account/upgrade' && method === 'POST') {
    return err('Please upgrade via /stripe/checkout.', 400);
  }

  // POST /account/downgrade
  if (path === '/account/downgrade' && method === 'POST') {
    if (user.plan === 'free') return err('Already on Free plan.', 400);
    await env.DB.prepare(
      `UPDATE users SET plan = 'free', updated_at = datetime('now') WHERE id = ?`
    ).bind(user.id).run();
    return json({ ok: true, plan: 'free' });
  }

  // DELETE /account → wipe everything
  if (path === '/account' && method === 'DELETE') {
    const { confirm } = await request.json().catch(() => ({}));
    if (confirm !== 'DELETE') return err('Confirmation string missing.', 400);

    const id = user.id;

    // Delete in dependency order
    await env.DB.prepare(`DELETE FROM email_verifications WHERE user_id = ?`).bind(id).run();
    await env.DB.prepare(`DELETE FROM sessions            WHERE user_id = ?`).bind(id).run();
    await env.DB.prepare(`DELETE FROM api_usage           WHERE user_id = ?`).bind(id).run();
    await env.DB.prepare(`DELETE FROM ignore_words        WHERE user_id = ?`).bind(id).run();
    await env.DB.prepare(`DELETE FROM analyses            WHERE user_id = ?`).bind(id).run();
    await env.DB.prepare(`DELETE FROM weights             WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = ?)`).bind(id).run();
    await env.DB.prepare(`DELETE FROM profiles            WHERE user_id = ?`).bind(id).run();
    await env.DB.prepare(`DELETE FROM users               WHERE id = ?`).bind(id).run();

    return json({ ok: true });
  }

  return err('Not Found', 404);
}
