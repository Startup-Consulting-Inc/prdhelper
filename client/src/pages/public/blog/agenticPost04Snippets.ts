/**
 * Long verbatim excerpts from docs/agentic_docs/post_04.md for Blog Post 04.
 */

export const PROTRAIT_THREAT_MODEL_DOC = `# Threat Model — ProPortrait AI

## Assets we protect
- User-uploaded photos (faces of real people — sensitive)
- Firebase user credentials and session tokens
- Gemini API key (high cost if leaked — ~$0.04 per generation)
- Stripe webhook secret and API keys
- Cloudflare R2 access credentials

## Top threats and controls

1. Gemini API key exfiltration
   - Key lives server-side only in Cloud Run secrets
   - Never sent to frontend in any response
   - All AI calls route through /api/portraits/*
   - CORS_ORIGIN locked to portrait.ai-biz.app in prod

2. Account takeover
   - Firebase Auth handles password storage
   - 15-min idle session timeout, server + client enforced
   - Timeout disabled during active generation (UX requirement —
     Gemini calls take 2-3 min)
   - Google OAuth through Firebase standard flow

3. Credit fraud
   - Credit checks happen in server/routes/portraits.ts
     after Stripe webhook confirms payment
   - Client credit display is informational only —
     server never trusts client-reported balance
   - Stripe webhook signature verified via STRIPE_WEBHOOK_SECRET

4. Image upload abuse
   - Max 10MB enforced client + server
   - MIME type checked server-side (JPG/PNG/WEBP only)
   - Auto-compressed via Sharp before Gemini
   - Rate limit: 20 generations per 15 min per IP

5. PII in logs
   - User emails redacted in server logs
   - No photo bytes logged, only R2 object keys
   - Sentry scrub rules drop request bodies on portrait endpoints

## Out of scope (handled elsewhere)
- DDoS: Firebase Hosting + Cloud Run infrastructure
- PCI compliance: Stripe handles card data, we never see it
- GDPR cookie consent: handled by CookieConsent.tsx component`;

export const PROTRAIT_RUNBOOK_DOC = `# Deployment Runbook — ProPortrait AI

## Environments
- dev: local (Vite :3000 + Express :3001)
- prod: portrait.ai-biz.app (Firebase Hosting) +
        proportrait-api Cloud Run service

## Required environment variables (prod)

Backend (Cloud Run, from Google Secret Manager):
GEMINI_API_KEY, FIREBASE_PROJECT_ID, APP_URL, CORS_ORIGIN,
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_HD_ADDON_PRICE_ID,
STRIPE_PLATFORM_SINGLE_PRICE_ID, STRIPE_PLATFORM_BUNDLE_PRICE_ID,
R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME,
RESEND_API_KEY, RESEND_FROM_EMAIL

Frontend (baked at Vite build):
VITE_FIREBASE_* (6 vars), VITE_API_URL, VITE_POSTHOG_KEY,
VITE_POSTHOG_HOST, VITE_SENTRY_DSN

## Deploy to production
1. Merge PR to main — triggers .github/workflows/deploy.yml
2. Lint + tsc --noEmit + npm audit (must all pass)
3. Backend: Cloud Build → Artifact Registry → Cloud Run
4. Frontend: npm run build with VITE_* env → Firebase Hosting
5. PostHog deploy event fires automatically

## Rollback procedure
- Backend: Cloud Run console → Revisions → Manage Traffic
  → 100% to previous revision (~30s to propagate)
- Frontend: Firebase Hosting → Release history → Rollback
  (instant, CDN clears in ~60s)

## Health checks
- Frontend: portrait.ai-biz.app/ → 200
- Backend: /api/health → 200
- Firestore: Firebase console, alert if QPS drops to 0

## When things break at 2am
1. Check Sentry first — most issues show up with stack traces
2. Check Cloud Run logs: gcloud run services logs read proportrait-api
3. Recent deploy? → Roll back first, investigate after
4. Gemini issues? → Check Google AI status page; can't fix externally
5. Stripe webhooks failing? → Check signing secret hasn't rotated
6. R2 unreachable? → Degraded (no downloads) but not fully down`;

export const CLEARLYREQS_RUNBOOK_DOC = `# Deployment Runbook — ClearlyReqs

## Environments
- dev: localhost (Vite dev server, mock AI responses)
- prod: clearlyreqs.com (Vercel), AI calls proxied server-side

## Required environment variables (prod, Vercel)
- OPENROUTER_API_KEY (or provider-specific AI key)
- NEXT_PUBLIC_APP_URL
- AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
- UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN (rate limiting)

## Deploy to production
1. Merge PR to main → Vercel preview deploy triggers automatically
2. Review preview URL — test document generation end-to-end
3. Promote to production in Vercel dashboard
4. No backend service to restart — serverless functions redeploy atomically

## Rollback procedure
- Vercel dashboard → Deployments → Promote any previous deployment
  Takes ~30s. No database migrations to reverse.

## Health checks
- clearlyreqs.com/ → 200 with wizard UI loaded
- /api/health → 200
- Generate a test document end-to-end after every deploy

## When things break
1. Check Vercel Function logs — AI proxy errors appear here first
2. OpenRouter/AI provider down? Check provider status page.
   Most generation failures trace back here.
3. Rate limit issues? Check Upstash Redis dashboard
4. Auth broken? Check OAuth credentials haven't expired in provider console
5. Slow first response? Expected — serverless cold start on first request`;
