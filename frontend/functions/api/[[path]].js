// ============================================================
// KeyScope – Cloudflare Pages Function
// Proxies all /api/* requests to the Worker backend.
// This makes keyscope.pages.dev/api/ the public endpoint.
// ============================================================

const WORKER_URL = 'https://keyscope-worker.karol-paschek.workers.dev';

export async function onRequest(context) {
  const { request, params } = context;

  // Build the target URL: strip /api prefix, forward the rest
  const url     = new URL(request.url);
  const subPath = params.path ? '/' + params.path.join('/') : '/';
  const target  = new URL(subPath + url.search, WORKER_URL);

  // Forward original headers (strip host to avoid conflicts)
  const headers = new Headers(request.headers);
  headers.delete('host');

  // Clone request body for methods that have one
  const body = ['GET', 'HEAD'].includes(request.method) ? undefined : request.body;

  const workerReq = new Request(target.toString(), {
    method:  request.method,
    headers,
    body,
    // Required to stream body correctly in CF env
    duplex: 'half',
  });

  // IMPORTANT: redirect:'manual' prevents fetch from automatically following
  // 302 redirects. Without this, OAuth redirects to Google/GitHub would be
  // silently followed and their HTML served under our domain – causing CSP
  // violations (base-uri, script-src from gstatic.com) and a broken login UI.
  const response = await fetch(workerReq, { redirect: 'manual' });

  // Forward 3xx redirects directly to the browser so the user's tab navigates
  // to the real OAuth provider page (e.g. accounts.google.com).
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('Location');
    if (location) {
      return Response.redirect(location, response.status);
    }
  }

  // Forward the response back – update CORS origin to match Pages domain
  const resHeaders = new Headers(response.headers);
  resHeaders.set('Access-Control-Allow-Origin', url.origin);
  resHeaders.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  resHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  resHeaders.set('Access-Control-Allow-Credentials', 'true');

  return new Response(response.body, {
    status:  response.status,
    headers: resHeaders,
  });
}
