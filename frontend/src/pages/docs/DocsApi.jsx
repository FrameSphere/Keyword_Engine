import { useState } from 'react';

const BASE_URL = 'https://keyscope-worker.karol-paschek.workers.dev';

function CodeBlock({ code, lang = 'bash' }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative rounded-xl overflow-hidden border border-white/[0.08] my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.08]">
        <span className="text-[11px] text-slate-500 font-mono uppercase tracking-wider">{lang}</span>
        <button onClick={handleCopy}
          className="text-[11px] text-slate-500 hover:text-white transition-colors px-2 py-0.5 rounded border border-white/[0.08] hover:border-white/20">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-slate-300 font-mono leading-relaxed bg-black/20">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Endpoint({ method, path, desc, children }) {
  const colors = {
    POST:   'bg-blue-500/15 text-blue-400 border-blue-500/25',
    GET:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    PUT:    'bg-amber-500/15 text-amber-400 border-amber-500/25',
    DELETE: 'bg-red-500/15 text-red-400 border-red-500/25',
  };
  return (
    <div className="card mb-6">
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-[11px] font-bold px-2 py-1 rounded border font-mono ${colors[method]}`}>{method}</span>
        <code className="text-white font-mono text-sm">{BASE_URL}{path}</code>
      </div>
      <p className="text-slate-400 text-sm mb-4">{desc}</p>
      {children}
    </div>
  );
}

function ParamTable({ rows }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/[0.08] mb-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.08] bg-white/[0.03]">
            <th className="text-left px-4 py-2.5 text-slate-400 font-medium text-xs uppercase tracking-wider">Parameter</th>
            <th className="text-left px-4 py-2.5 text-slate-400 font-medium text-xs uppercase tracking-wider">Type</th>
            <th className="text-left px-4 py-2.5 text-slate-400 font-medium text-xs uppercase tracking-wider">Required</th>
            <th className="text-left px-4 py-2.5 text-slate-400 font-medium text-xs uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-white/[0.04] last:border-0">
              <td className="px-4 py-2.5 font-mono text-blue-300 text-xs">{r.name}</td>
              <td className="px-4 py-2.5 text-slate-500 text-xs">{r.type}</td>
              <td className="px-4 py-2.5">
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${r.req ? 'bg-blue-500/15 text-blue-400' : 'bg-white/5 text-slate-500'}`}>
                  {r.req ? 'required' : 'optional'}
                </span>
              </td>
              <td className="px-4 py-2.5 text-slate-400 text-xs">{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DocsApi() {
  return (
    <div>
      <div className="mb-8">
        <span className="badge-blue mb-3 inline-block">API Reference</span>
        <h1 className="text-3xl font-bold text-white mb-3">REST API</h1>
        <p className="text-slate-400 leading-relaxed">
          All endpoints accept and return <code className="font-mono text-blue-300">application/json</code>.
          Authentication uses a <strong className="text-white">Bearer token</strong> in the Authorization header.
          Generate your API key under{' '}
          <code className="font-mono text-blue-300">Settings → API Keys</code>.
        </p>
      </div>

      {/* Auth header */}
      <div className="card bg-amber-500/5 border-amber-500/15 mb-8 text-sm text-slate-400">
        <strong className="text-white">Authentication: </strong>
        All endpoints except <code className="font-mono text-blue-300">/auth/*</code> require:
        <CodeBlock lang="http" code={`Authorization: Bearer YOUR_API_KEY`} />
      </div>

      {/* ── Auth ── */}
      <h2 className="text-lg font-semibold text-white mb-4 mt-8 pb-2 border-b border-white/[0.08]">Auth</h2>

      <Endpoint method="POST" path="/auth/register" desc="Create a new account. Returns a session token.">
        <ParamTable rows={[
          { name: 'email',    type: 'string', req: true,  desc: 'User email address' },
          { name: 'password', type: 'string', req: true,  desc: 'Minimum 8 characters' },
        ]} />
        <CodeBlock lang="json" code={`// Response 201
{ "ok": true, "token": "abc123...", "user": { "id": "...", "email": "...", "plan": "free" } }`} />
      </Endpoint>

      <Endpoint method="POST" path="/auth/login" desc="Log in and receive a session token.">
        <ParamTable rows={[
          { name: 'email',    type: 'string', req: true, desc: 'Registered email' },
          { name: 'password', type: 'string', req: true, desc: 'Account password' },
        ]} />
        <CodeBlock lang="json" code={`{ "ok": true, "token": "abc123...", "user": { "id": "...", "email": "...", "plan": "free" } }`} />
      </Endpoint>

      <Endpoint method="GET" path="/auth/me" desc="Return the currently authenticated user." />

      <Endpoint method="POST" path="/auth/logout" desc="Invalidate the current session token." />

      {/* ── Analyze ── */}
      <h2 className="text-lg font-semibold text-white mb-4 mt-8 pb-2 border-b border-white/[0.08]">Analysis</h2>

      <Endpoint method="POST" path="/analyze" desc="Extract keywords and longtail phrases from text. Rate limited: 20/day (Free), 500/day (Pro).">
        <ParamTable rows={[
          { name: 'content',       type: 'string',  req: true,  desc: 'Text to analyze (min. 50 chars)' },
          { name: 'title',         type: 'string',  req: false, desc: 'Page title — receives 6pt bonus per word' },
          { name: 'lang',          type: 'string',  req: false, desc: 'Language code: de | en | fr | es | it (default: de)' },
          { name: 'profile_id',    type: 'string',  req: false, desc: 'UUID of a trained profile to apply weights' },
          { name: 'mode',          type: 'string',  req: false, desc: 'algorithmic (default) | ai (Pro only)' },
          { name: 'keyword_count', type: 'integer', req: false, desc: 'Number of keywords to return (1–50, default 10)' },
          { name: 'longtail_count',type: 'integer', req: false, desc: 'Number of longtail phrases (1–50, default 10)' },
        ]} />
        {/* Example 1: basic */}
        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Example — basic</p>
        <CodeBlock lang="bash" code={`curl -X POST ${BASE_URL}/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Beste SEO Strategien 2025",
    "content": "Suchmaschinenoptimierung ist im digitalen Marketing...",
    "lang": "de",
    "keyword_count": 15,
    "longtail_count": 10
  }'`} />

        {/* Example 2: with profile */}
        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1 mt-4">Example — with trained profile</p>
        <CodeBlock lang="bash" code={`curl -X POST ${BASE_URL}/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Beste SEO Strategien 2025",
    "content": "Suchmaschinenoptimierung ist im digitalen Marketing...",
    "lang": "de",
    "profile_id": "YOUR_PROFILE_UUID",
    "keyword_count": 15,
    "longtail_count": 10
  }'`} />
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Get your profile UUIDs via <code className="font-mono text-blue-300">GET /profiles</code>. The profile's trained word weights and ignore list are applied automatically.
        </p>

        {/* Example 3: AI mode */}
        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Example — AI mode <span className="badge-magenta ml-1">Pro</span></p>
        <CodeBlock lang="bash" code={`curl -X POST ${BASE_URL}/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Beste SEO Strategien 2025",
    "content": "Suchmaschinenoptimierung ist im digitalen Marketing...",
    "lang": "de",
    "mode": "ai",
    "keyword_count": 15,
    "longtail_count": 10
  }'`} />
        <p className="text-xs text-slate-500 mt-1 mb-4">
          <code className="font-mono text-blue-300">mode: "ai"</code> routes the request to the Hugging Face model instead of the TF-IDF engine. Requires Pro plan — returns <code className="font-mono text-red-400">403</code> otherwise.
        </p>

        {/* Response */}
        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Response</p>
        <CodeBlock lang="json" code={`{
  "ok": true,
  "mode": "algorithmic",        // or "ai"
  "keywords": ["suchmaschinenoptimierung", "marketing", "ranking"],
  "longtailKeywords": ["lokale seo strategie", "keyword recherche tool"],
  "metaDescription": "Suchmaschinenoptimierung ist im digitalen Marketing unverzichtbar...",
  "lang": "de",
  "profile_id": "YOUR_PROFILE_UUID"  // null if not used
}`} />
      </Endpoint>

      {/* ── Profiles ── */}
      <h2 className="text-lg font-semibold text-white mb-4 mt-8 pb-2 border-b border-white/[0.08]">Profiles</h2>

      <Endpoint method="GET" path="/profiles" desc="List all profiles for the authenticated user." />

      <Endpoint method="POST" path="/profiles" desc="Create a new keyword profile.">
        <ParamTable rows={[
          { name: 'name',        type: 'string', req: true,  desc: 'Profile display name' },
          { name: 'description', type: 'string', req: false, desc: 'Optional description' },
          { name: 'language',    type: 'string', req: false, desc: 'de | en | fr | es | it' },
          { name: 'config',      type: 'object', req: false, desc: 'Algorithm parameter overrides (see Algorithm docs)' },
        ]} />
      </Endpoint>

      <Endpoint method="PUT" path="/profiles/:id" desc="Update an existing profile's name, description, or config." />
      <Endpoint method="DELETE" path="/profiles/:id" desc="Delete a profile and all associated weights and training texts." />

      {/* ── Weights (Training) ── */}
      <h2 className="text-lg font-semibold text-white mb-4 mt-8 pb-2 border-b border-white/[0.08]">Training / Weights</h2>

      <Endpoint method="POST" path="/weights/train" desc="Train a profile by running TF-IDF on a corpus of your documents. Replaces any existing weights.">
        <ParamTable rows={[
          { name: 'profile_id', type: 'string', req: true,  desc: 'UUID of the profile to train' },
          { name: 'documents',  type: 'array',  req: true,  desc: 'Array of { title?, content, lang? } objects (max 20 Free / max 200 Pro)' },
          { name: 'lang',       type: 'string', req: false, desc: 'Fallback language if not set per-document' },
        ]} />
        <CodeBlock lang="bash" code={`curl -X POST ${BASE_URL}/weights/train \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "profile_id": "PROFILE_UUID",
    "documents": [
      { "content": "Dein erster Trainingstext...", "lang": "de" },
      { "content": "Zweiter Text zur Gewichtsberechnung...", "lang": "de" }
    ]
  }'`} />
      </Endpoint>

      <Endpoint method="GET"    path="/weights/:profileId" desc="Return the current word weights for a profile." />
      <Endpoint method="DELETE" path="/weights/:profileId" desc="Delete all weights for a profile (reset to untrained)." />

      {/* ── Ignore ── */}
      <h2 className="text-lg font-semibold text-white mb-4 mt-8 pb-2 border-b border-white/[0.08]">Ignore Lists</h2>

      <Endpoint method="GET" path="/ignore" desc="List ignore words. Optional query param: ?profile_id=UUID" />

      <Endpoint method="POST" path="/ignore" desc="Add words to the ignore list.">
        <ParamTable rows={[
          { name: 'words',      type: 'string[]', req: true,  desc: 'Array of words to ignore' },
          { name: 'profile_id', type: 'string',   req: false, desc: 'Scope to profile; omit for global ignore' },
        ]} />
      </Endpoint>

      <Endpoint method="DELETE" path="/ignore/:word" desc="Remove a word from the ignore list. Optional query param: ?profile_id=UUID" />

      {/* ── History ── */}
      <h2 className="text-lg font-semibold text-white mb-4 mt-8 pb-2 border-b border-white/[0.08]">History</h2>

      <Endpoint method="GET" path="/history" desc="Return paginated analysis history.">
        <ParamTable rows={[
          { name: 'limit',  type: 'integer', req: false, desc: 'Page size (default 20, max 100)' },
          { name: 'offset', type: 'integer', req: false, desc: 'Pagination offset (default 0)' },
        ]} />
      </Endpoint>

      {/* ── API Key ── */}
      <h2 className="text-lg font-semibold text-white mb-4 mt-8 pb-2 border-b border-white/[0.08]">API Key Management</h2>

      <Endpoint method="GET"    path="/apikey"  desc="Return the current API key (masked)." />
      <Endpoint method="POST"   path="/apikey"  desc="Generate a new API key. Previous key is immediately revoked." />
      <Endpoint method="DELETE" path="/apikey"  desc="Revoke the current API key." />

      {/* Error Codes */}
      <h2 className="text-lg font-semibold text-white mb-4 mt-8 pb-2 border-b border-white/[0.08]">Error codes</h2>
      <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.03]">
              <th className="text-left px-4 py-2.5 text-slate-400 font-medium text-xs uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-2.5 text-slate-400 font-medium text-xs uppercase tracking-wider">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['400', 'Bad Request — invalid or missing parameters'],
              ['401', 'Unauthorized — missing or invalid token'],
              ['403', 'Forbidden — feature requires Pro plan'],
              ['404', 'Not Found — resource does not exist'],
              ['409', 'Conflict — email already registered'],
              ['429', 'Too Many Requests — daily rate limit exceeded'],
              ['500', 'Internal Server Error — contact support'],
            ].map(([code, msg]) => (
              <tr key={code} className="border-b border-white/[0.04] last:border-0">
                <td className="px-4 py-2.5 font-mono text-red-400 text-xs">{code}</td>
                <td className="px-4 py-2.5 text-slate-400 text-xs">{msg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
