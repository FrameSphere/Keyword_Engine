// ============================================================
// KeyScope Worker – Hauptrouter
// Cloudflare Workers
// ============================================================

import { handleAuth }      from './auth.js';
import { handleAnalyze }   from './analyze.js';
import { handleProfiles }  from './profiles.js';
import { handleWeights }   from './weights.js';
import { handleIgnore }    from './ignore.js';
import { handleHistory }   from './history.js';
import { handleApiKey }    from './apikey.js';
import { handleAccount }   from './account.js';
import { cors, json, err } from './utils.js';

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return cors(new Response(null, { status: 204 }), env);
    }

    const url    = new URL(request.url);
    const path   = url.pathname;
    const method = request.method;

    try {
      if (path === '/health' && method === 'GET') {
        return cors(json({ ok: true, version: '1.0.0' }), env);
      }

      if (path.startsWith('/auth/')) {
        return cors(await handleAuth(request, env, path), env);
      }

      const user = await getUser(request, env);
      if (!user) {
        return cors(err('Unauthorized', 401), env);
      }

      if (path === '/analyze' && method === 'POST') {
        return cors(await handleAnalyze(request, env, user), env);
      }

      if (path.startsWith('/profiles')) {
        return cors(await handleProfiles(request, env, user, path), env);
      }

      if (path.startsWith('/weights')) {
        return cors(await handleWeights(request, env, user, path), env);
      }

      if (path.startsWith('/ignore')) {
        return cors(await handleIgnore(request, env, user, path), env);
      }

      if (path.startsWith('/history')) {
        return cors(await handleHistory(request, env, user, path), env);
      }

      if (path.startsWith('/apikey')) {
        return cors(await handleApiKey(request, env, user, path), env);
      }

      if (path.startsWith('/account')) {
        return cors(await handleAccount(request, env, user, path), env);
      }

      return cors(err('Not Found', 404), env);

    } catch (e) {
      console.error('Worker error:', e);
      return cors(err('Internal Server Error', 500), env);
    }
  },
};

async function getUser(request, env) {
  const authHeader   = request.headers.get('Authorization') || '';
  const cookieHeader = request.headers.get('Cookie') || '';

  let token = null;

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    const match = cookieHeader.match(/keyscope_session=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token) return null;

  const session = await env.DB.prepare(
    `SELECT s.user_id, u.email, u.plan, u.id
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires_at > datetime('now')
     LIMIT 1`
  ).bind(token).first();

  if (session) return session;

  const userByKey = await env.DB.prepare(
    `SELECT id, email, plan FROM users WHERE api_key = ? LIMIT 1`
  ).bind(token).first();

  return userByKey || null;
}
