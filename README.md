# KeyLens – Keyword Analysis Engine

> AI-powered & algorithmic keyword extraction tool as a SaaS product.

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React + Vite + Tailwind CSS       |
| Hosting    | Cloudflare Pages                  |
| API        | Cloudflare Workers                |
| Database   | Cloudflare D1 (SQLite)            |
| AI Plan    | HuggingFace Spaces (optional)     |

## Project Structure

```
Keyword_Engine/
  frontend/        ← React/Vite app (Cloudflare Pages)
  worker/          ← Cloudflare Worker API
  schema.sql       ← D1 database schema
  wrangler.toml    ← Cloudflare config (Pages + Worker)
  README.md
```

## Features

### Free Plan (Algorithmic)
- TF-IDF based keyword extraction
- Longtail keyword generation (bigrams + trigrams)
- Custom ignore lists
- Pre-built niche templates
- Up to 500 keywords per analysis
- API access (rate limited)

### Pro Plan (AI-powered)
- HuggingFace Spaces model integration
- Semantic keyword clustering
- Context-aware longtail suggestions
- Unlimited analyses
- Priority API access
- Custom model fine-tuning

## Local Development

```bash
# Frontend
cd frontend
npm install
npm run dev

# Worker
cd worker
npm install
npx wrangler dev
```

## Deployment

```bash
# Deploy Worker
cd worker && npx wrangler deploy

# Deploy Frontend (via Pages)
cd frontend && npm run build
# Push to GitHub → Cloudflare Pages auto-deploys
```

## D1 Database Setup

```bash
npx wrangler d1 create keylens-db
npx wrangler d1 execute keylens-db --file=../schema.sql
```
