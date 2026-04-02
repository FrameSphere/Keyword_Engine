// ============================================================
// KeyScope – Stripe Handler
// POST /stripe/checkout  → Checkout Session erstellen
// POST /stripe/portal    → Billing Portal öffnen
// POST /stripe/webhook   → Stripe Webhook (öffentlich, kein Auth)
// ============================================================

import { json, err } from './utils.js';

// ── Stripe REST helper ────────────────────────────────────────
async function stripePost(path, params, secretKey) {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    body.append(k, String(v));
  }
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Stripe API error');
  return data;
}

// ── Webhook-Signatur-Verifikation (HMAC-SHA256) ───────────────
async function verifyWebhook(body, sigHeader, secret) {
  const parts = {};
  sigHeader.split(',').forEach(p => {
    const i = p.indexOf('=');
    parts[p.slice(0, i)] = p.slice(i + 1);
  });
  const timestamp = parts.t;
  const expected  = parts.v1;
  if (!timestamp || !expected) throw new Error('Ungültiger Signatur-Header');

  // Zeitfenster: max. 5 Minuten
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) {
    throw new Error('Webhook-Zeitstempel zu alt');
  }

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sigBuf = await crypto.subtle.sign(
    'HMAC', key,
    new TextEncoder().encode(`${timestamp}.${body}`)
  );
  const hex = Array.from(new Uint8Array(sigBuf))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  if (hex !== expected) throw new Error('Signatur stimmt nicht überein');
}

// ── Webhook-Events verarbeiten ────────────────────────────────
async function handleWebhookEvent(event, env) {
  const obj = event.data.object;

  switch (event.type) {

    // Checkout abgeschlossen → Plan auf Pro setzen
    case 'checkout.session.completed': {
      if (obj.mode !== 'subscription') break;
      const userId = obj.metadata?.user_id;
      const subId  = obj.subscription;
      if (!userId || !subId) break;
      await env.DB.prepare(`
        UPDATE users
        SET plan = 'pro',
            stripe_subscription_id = ?,
            updated_at = datetime('now')
        WHERE id = ?
      `).bind(subId, userId).run();
      console.log(`[Stripe] User ${userId} → pro (sub: ${subId})`);
      break;
    }

    // Subscription aktualisiert (Status-Change)
    case 'customer.subscription.updated': {
      const active = ['active', 'trialing'].includes(obj.status);
      const plan   = active ? 'pro' : 'free';

      // user_id aus Subscription-Metadaten oder über stripe_customer_id
      let userId = obj.metadata?.user_id;
      if (!userId) {
        const row = await env.DB.prepare(
          `SELECT id FROM users WHERE stripe_customer_id = ? LIMIT 1`
        ).bind(obj.customer).first();
        userId = row?.id;
      }
      if (!userId) break;

      await env.DB.prepare(`
        UPDATE users
        SET plan = ?,
            stripe_subscription_id = ?,
            updated_at = datetime('now')
        WHERE id = ?
      `).bind(plan, obj.id, userId).run();
      console.log(`[Stripe] User ${userId} subscription.updated → ${plan}`);
      break;
    }

    // Subscription gekündigt / abgelaufen → Free
    case 'customer.subscription.deleted': {
      let userId = obj.metadata?.user_id;
      if (!userId) {
        const row = await env.DB.prepare(
          `SELECT id FROM users WHERE stripe_subscription_id = ? OR stripe_customer_id = ? LIMIT 1`
        ).bind(obj.id, obj.customer).first();
        userId = row?.id;
      }
      if (!userId) break;

      await env.DB.prepare(`
        UPDATE users
        SET plan = 'free',
            stripe_subscription_id = NULL,
            updated_at = datetime('now')
        WHERE id = ?
      `).bind(userId).run();
      console.log(`[Stripe] User ${userId} subscription.deleted → free`);
      break;
    }

    // Zahlung fehlgeschlagen → nur loggen (Stripe retries)
    case 'invoice.payment_failed': {
      console.warn(`[Stripe] Zahlung fehlgeschlagen für Customer: ${obj.customer}`);
      break;
    }
  }
}

// ── Haupt-Route-Handler ───────────────────────────────────────
export async function handleStripe(request, env, path, user) {
  const method   = request.method;
  const KEY      = env.STRIPE_SECRET_KEY;
  const PRICE_ID = env.STRIPE_PRICE_ID;
  const FRONTEND = env.FRONTEND_URL || 'https://keyscope.pages.dev';

  // ── POST /stripe/webhook (kein user-Auth, Signatur reicht) ──
  if (path === '/stripe/webhook' && method === 'POST') {
    const sigHeader = request.headers.get('stripe-signature') || '';
    const secret    = env.STRIPE_WEBHOOK_SECRET;
    if (!secret) return new Response('Webhook-Secret fehlt', { status: 500 });

    const body = await request.text();
    try {
      await verifyWebhook(body, sigHeader, secret);
    } catch (e) {
      console.error('[Stripe] Webhook-Verifikation fehlgeschlagen:', e.message);
      return new Response(`Webhook Error: ${e.message}`, { status: 400 });
    }

    const event = JSON.parse(body);
    await handleWebhookEvent(event, env);
    return json({ received: true });
  }

  // Ab hier brauchen wir einen authentifizierten User
  if (!user) return err('Unauthorized', 401);

  // ── POST /stripe/checkout ────────────────────────────────────
  if (path === '/stripe/checkout' && method === 'POST') {
    if (!KEY || !PRICE_ID) return err('Stripe nicht konfiguriert', 500);
    if (user.plan === 'pro') return err('Du hast bereits Pro.', 400);

    // Stripe-Customer anlegen falls noch nicht vorhanden
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripePost('/customers', {
        email: user.email,
        'metadata[user_id]': user.id,
      }, KEY);
      customerId = customer.id;
      await env.DB.prepare(
        `UPDATE users SET stripe_customer_id = ? WHERE id = ?`
      ).bind(customerId, user.id).run();
    }

    const session = await stripePost('/checkout/sessions', {
      mode: 'subscription',
      customer: customerId,
      'line_items[0][price]': PRICE_ID,
      'line_items[0][quantity]': '1',
      'subscription_data[metadata][user_id]': user.id,
      'metadata[user_id]': user.id,
      success_url: `${FRONTEND}/app/settings?upgraded=1`,
      cancel_url:  `${FRONTEND}/pricing`,
      allow_promotion_codes: 'true',
    }, KEY);

    return json({ url: session.url });
  }

  // ── POST /stripe/portal ──────────────────────────────────────
  if (path === '/stripe/portal' && method === 'POST') {
    if (!KEY) return err('Stripe nicht konfiguriert', 500);
    if (!user.stripe_customer_id) return err('Kein aktives Abonnement gefunden.', 400);

    const portal = await stripePost('/billing_portal/sessions', {
      customer: user.stripe_customer_id,
      return_url: `${FRONTEND}/settings`,
    }, KEY);

    return json({ url: portal.url });
  }

  return err('Not Found', 404);
}
