# AI Video Tool Finder

Affiliate comparison site for AI video generation/editing tools. See
`docs/superpowers/specs/2026-09-22-ai-video-finder-design.md` for the full
design spec and `docs/superpowers/plans/2026-09-22-ai-video-finder-mvp.md`
for the implementation plan.

## Local development

    npm install
    npm run dev

## Tests

    npm test

## Updating an affiliate status

When an affiliate program accepts the site, edit `data/products.ts`:

1. Set that product's `affiliateStatus` to `"active"`.
2. Set `affiliateUrl` to the real affiliate link.
3. Commit and push — Vercel redeploys automatically.

No other code changes are needed; `/go/[slug]` picks up the change via
`lib/redirect.ts`.

## Deployment

Hosted on Vercel's free Hobby tier, connected to the `master` branch of
this repo (`TomAlkalai/ai-video-tool-finder` on GitHub). Pushing to
`master` triggers an automatic redeploy.

Domain: `aivideofinder.com`, DNS pointed at Vercel per the records shown
in the Vercel project's Settings → Domains.
