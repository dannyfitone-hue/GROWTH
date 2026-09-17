## V2.0.10 delete business
- Adds Delete controls to the Command Center and Client Pipeline, plus Delete business in each client workspace.
- Opens a keyboard-accessible confirmation dialog with the selected business name. The administrator must type that name before Permanently delete becomes available. Cancel and Escape close the dialog without deleting anything.
- The server requires the existing signed admin session, a same-origin JSON request and the current business name. It deletes by the selected UUID and name, protecting other businesses with duplicate names and detecting concurrent name changes.
- Uses one database DELETE. Existing ON DELETE CASCADE relationships remove linked records as part of that same transaction. The app never deletes child records in separate requests. A protected foreign-key relationship blocks the operation and displays an error.
- After success, the list reloads; deleting from a client workspace returns to Client Pipeline. No real businesses were deleted while preparing this release.
- Preserves the transparent logo, company branding, six working navigation sections, reports and existing integrations. No paid AI request is needed to delete a business.
- This source ZIP still needs deployment to update the live CRM.

### Database compatibility
The bundled V2 migration defines cascading client relationships for analysis runs and onboarding state. The original legacy-table definitions and live database constraints were not available for verification. Deletion relies on the existing client foreign keys for all other linked CRM records. If the app reports protected linked records, a database administrator must review those relationships before deletion can succeed; the app deliberately does not attempt a partial cleanup. No database migration or production data change was run for this release. Downloaded files and external service accounts are outside the scope of CRM deletion.

### V2.0.10 verification
- Production build and TypeScript checks passed.
- Local HTTP tests against the production Next.js server passed for every navigation page, report downloads, deletion controls and initially disabled confirmation dialogs.
- Tested authentication, cross-site rejection, missing/malformed confirmation, exact-name mismatch, unknown record, read/write failures, protected foreign keys, concurrent renames, duplicate business names and repeated deletion requests.
- With cascading relationships modeled in isolated fixtures, successful deletion removes only the selected business and linked records; the business disappears from all admin sections and its portal, report and PDF links stop serving it.
- Tests used only synthetic local records. Live database constraints, live deployment and interactive browser behavior have not been verified.

## V2.0.9 working admin navigation
- Fixes four menu entries that previously linked back to the Command Center.
- Client Pipeline (`/admin/clients`): searchable client records with program-stage filters and links to client workspaces.
- Analysis Queue (`/admin/analysis`): saved research status, latest progress, failures, filters and links to review or retry in a client workspace. Opening this page does not start an AI job.
- 90-Day Operations (`/admin/operations`): existing implementation tasks with client names, phases, recorded statuses and task filters.
- Reports (`/admin/reports`): availability per client and working audit/roadmap downloads using the existing report endpoints. Download links only appear when a completed analysis with results exists.
- All admin sections require the existing admin session. Desktop and mobile share the same six navigation destinations and highlight the current section.
- New tab pages use 25-record pagination; query failures display a load error instead of an empty list.
- Preserves the transparent logo, client records, existing API workflows and database schema. No new migration or environment variables are required.
- This source ZIP must be deployed to update the live CRM.

### V2.0.9 verification
- Production build and TypeScript checks passed.
- All six navigation destinations were exercised over HTTP against the production Next.js server with isolated local database fixtures.
- Verified login protection, selected navigation on desktop/mobile markup, client search/stage filters, queue status filters, task filters, pagination, empty/error states, client workspace links and both actual PowerPoint downloads.
- Confirmed the PowerPoint downloads embed the existing transparent logo.
- No production database, live deployment or paid AI service was used in these checks. Interactive browser verification and production verification have not been performed.

## V2.0.8 transparent logo and visual polish
- Cleans the approved silver/white-and-cyan logo background to genuine transparency and removes the dark logo tile, rounded frame and filters.
- Uses the transparent artwork throughout login, desktop/mobile admin navigation, both portal states, browser icon, PowerPoint reports and the onboarding PDF.
- Refines logo sizes, header alignment, login copy, form spacing and primary action colors.
- Improves small-screen layouts, keeps navigation and sign-out available on mobile, prevents sidebar footer overlap, and adds visible keyboard focus and reduced-motion support.
- Company branding remains Growth Intelligence LLC. No database migration, environment-variable change or paid AI request is required for this update.
- This is the updated source ZIP. The live CRM is not redeployed by downloading it.

## V2.0.7 exact supplied logo
- Replaces the prior artwork with the exact attached silver/white-and-cyan Growth Intelligence LLC logo, without redrawing or modifying its pixels.
- Applies this logo to login, desktop/mobile admin navigation, both client portal states, browser icon, PowerPoint reports and the onboarding PDF.
- Displays the light logo on a dark navy background for legibility.
- Uses Growth Intelligence LLC as the company name throughout the interface, agreements, report branding and page metadata.
- The source package contains no former-company name or former-company logo assets. Existing client data and application workflows are preserved.
- This ZIP has not been published to the live CRM. No database migration or environment-variable changes are required for this branding update.

## V2.0.6 company branding completion
- Includes the exact approved Growth Intelligence LLC logo across the CRM and generated reports.
- Uses the approved artwork for the browser tab icon and the full company name in page metadata.
- Updates the website scanner identity to Growth Intelligence and removes the final former-company name from the source package.
- This is a source-code ZIP update; it does not publish a live deployment.
- Existing database tables, records, login behavior and environment variables are unchanged. No new database migration is needed when upgrading an existing V2 installation.
- For an existing CRM, deploy these source files to its confirmed repository/project while keeping the existing environment configuration. The setup instructions below apply to new installations.

## V2.0.5 approved company logo
- Adds the approved Growth Intelligence LLC logo to admin navigation, the mobile admin header, login, and both client portal states.
- Embeds that exact logo in both generated PowerPoints and the onboarding PDF.
- Keeps the client’s own logo and existing application workflows.
- Uses a bundled static asset; no OpenAI API calls, database migration or new environment variables are required.
- Include `public/brand/` when deploying this complete project to the existing CRM repository and Vercel project.

## V2.0.4 company rebrand
- Rebranded the complete platform, client portal, reports, agreements, PDF exports, AI research instructions and admin experience to **Growth Intelligence LLC**.
- No database migration or environment-variable changes are required for this rebrand.

# Growth Intelligence LLC — Command Center V2 PRO

This build powers the Growth Intelligence LLC client acquisition, analysis, onboarding and execution workflow:

**Admin creates client → AI researches business + web presence → audit + 90-day PowerPoints → Growth Intelligence LLC reviews/approves → personalized client portal → pricing → private intake → access plan → e-signature → activation → 48-hour strategy stage → 90-day tasks.**

## What is functional in V2 PRO

- Private Growth Intelligence LLC admin login (server-side signed session cookie)
- Client pipeline / command center
- Create client with business, website, contact, industry, start date and pricing
- Automatic website metadata scan for logo/favicon/OG image/title/description
- OpenAI Responses API background analysis job using built-in web search
- Structured evidence-based audit stored in Supabase
- Two generated PowerPoints from the same analysis record:
  - Digital Growth Intelligence Audit
  - 90-Day Execution & Results Roadmap
- Admin review gate before client sees anything
- Random secure client portal token
- High-tech client-branded guided portal
- One-step-at-a-time flow: Analysis → Program → Business → Access → Agreement → Review → Activation
- Program pricing automatically shown in portal and agreement
- Typed e-signature record + agreement snapshot
- Google/platform access planning without collecting passwords
- Final activation moves client to `strategy_48h`
- 90-day tasks automatically generated from the AI treatment plan
- Downloadable onboarding PDF after completion
- Permanent activity timeline

## Important: OpenAI API

The AI research layer uses the **OpenAI Responses API** with built-in web search and Structured Outputs. An OpenAI API key is separate from a ChatGPT subscription and must be added to Vercel as `OPENAI_API_KEY`.

The model is configurable using `OPENAI_MODEL`. The model is controlled by `OPENAI_MODEL` in Vercel.

## 1. Run the V2 database migration

In Supabase → SQL Editor, run:

`supabase/migration_v2_pro.sql`

This is additive. It does not drop your older legacy `clients` table or the existing Growth CRM tables.

## 2. Vercel environment variables

Keep the two variables already configured:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (Secret)

Add:

- `NEXT_PUBLIC_APP_URL` = your production CRM domain, e.g. `https://growth-tawny-one.vercel.app`
- `OPENAI_API_KEY` = OpenAI API secret key (Secret)
- `OPENAI_MODEL` = optional; configured with `OPENAI_MODEL`
- `ADMIN_PASSWORD` = long private password for Growth Intelligence LLC admin login (Secret)
- `SESSION_SECRET` = long random secret, at least 32 characters (Secret)

Redeploy Production after changing environment variables.

## 3. Health check

Open:

`/api/health`

Expected:

```json
{
  "ok": true,
  "database": "connected",
  "growth_clients_table": "available",
  "openai": "configured",
  "admin_auth": "configured"
}
```

## 4. Test workflow before Adamik's

1. Sign in at `/login`.
2. Create a fake plumbing client.
3. Open the client workspace.
4. Click **Run Complete Business Analysis**.
5. The job runs in OpenAI background mode and the page polls status.
6. When complete, open both PowerPoints and verify findings/sources.
7. Click **Approve & Publish Client Portal**.
8. Open the generated private portal.
9. Complete every client step.
10. Submit and confirm the 48-hour activation screen.
11. Confirm the client has 90-day tasks in Supabase.

## Security rules built into this version

- The Supabase service-role key is server-only and never sent to the browser.
- New Growth CRM tables use RLS and are not granted to `anon` or `authenticated` roles.
- Client portal tokens use cryptographically random values.
- The portal never asks clients to submit Google passwords, MFA codes or recovery credentials.
- AI research is never published automatically; Growth Intelligence LLC must approve it.

## Still recommended before broad production rollout

- Replace the shared admin password with full Supabase Auth + named staff accounts / roles.
- Add real Google OAuth / Google Ads / GA4 / Search Console / Business Profile API connections so access can be verified automatically rather than only recorded as a client checklist.
- Add private file uploads to Supabase Storage for historical SEO reports, assets and signed-document files.
- Have California counsel review the final digital agreement language/e-signature workflow before using it as Growth Intelligence LLC's permanent legal contract.
- Add a background job/queue provider if analysis volume grows substantially.

## OpenAI implementation references

This build follows current OpenAI documentation for the Responses API, background responses, built-in web search and Structured Outputs.


## V2.0.2 build compatibility fix
- Adds backward-compatible `templates` and `admin()` exports for stale V1 files that can remain when a repository is updated via upload instead of a clean replace.
- Overwrites legacy `/intake/[token]` with a redirect to the V2 `/p/[token]` portal.
- Retires the legacy `/api/intake/[token]/submit` endpoint.
- No database migration changes from V2 PRO.
