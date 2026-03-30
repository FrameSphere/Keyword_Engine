// ============================================================
// KeyLens – Utility Helpers
// ============================================================

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function err(message, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function cors(response, env) {
  const origin = env?.FRONTEND_URL || '*';
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  headers.set('Access-Control-Allow-Credentials', 'true');
  return new Response(response.body, {
    status:  response.status,
    headers,
  });
}

export function uuid() {
  return crypto.randomUUID();
}

export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password, hash) {
  const computed = await hashPassword(password);
  return computed === hash;
}

export function generateToken(length = 48) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function sessionExpiry(hours = 72) {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d.toISOString().replace('T', ' ').split('.')[0];
}

// Rate limit check: gibt false zurück wenn Limit überschritten
export async function checkRateLimit(env, userId, endpoint, limitPerDay) {
  const today = new Date().toISOString().split('T')[0];
  const row = await env.DB.prepare(
    `SELECT count FROM api_usage WHERE user_id = ? AND endpoint = ? AND date = ?`
  ).bind(userId, endpoint, today).first();

  const currentCount = row?.count || 0;
  if (currentCount >= limitPerDay) return false;

  // Upsert
  await env.DB.prepare(`
    INSERT INTO api_usage (id, user_id, endpoint, date, count)
    VALUES (?, ?, ?, ?, 1)
    ON CONFLICT (user_id, endpoint, date)
    DO UPDATE SET count = count + 1
  `).bind(uuid(), userId, endpoint, today).run();

  return true;
}
