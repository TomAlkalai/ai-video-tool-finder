# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

AI Video Tool Finder: an affiliate comparison site for AI video tools (aivideofinder.com). Next.js 16 App Router, React 19, Tailwind v4, Vitest. Pushing to `master` auto-deploys on Vercel.

## Commands

- `npm run dev`: dev server on :3000 (the preview config is named `ai-video-finder-dev`)
- `npm test`: all tests (Vitest, jsdom)
- `npx vitest run lib/pricing.test.ts`: one file; add `-t "name"` to run one test
- `npm run lint` / `npm run build`

## Architecture: data-driven, pages are thin

All content lives in `data/*.ts`. Pages only look up a config and render a shared template. **`slug` is the join key everywhere:**

- `data/products.ts`: the `Product` type and all tools. `data/logos.ts` maps slug → `public/logos/*`.
- `data/recommendation-pages.ts` (`productSlugs`, `verdict[].productSlug`) and `data/comparison-pages.ts` (`productSlugA/B`) reference products by slug.
- Each recommendation/comparison page is a static folder `app/<page-slug>/page.tsx`. It finds its config by slug and renders `RecommendationPage` or `ComparisonPage`. To add one, add the config entry and copy an existing folder (for example `app/veed-vs-descript/`). `app/sitemap.ts` picks it up automatically.
- `app/tools/[slug]` is generated from `products` and links to every guide that mentions the tool.
- The quiz (`/find-my-tool`, `lib/quiz.ts`) maps each goal to a recommendation page slug. `data/categories.ts` values must match the `category` strings on products.
- The "Cheapest" badge uses `startingPriceUSD` (`lib/pricing.ts`). The free-plan signal is the separate `freePlan` field.

## Affiliate rules (from the design spec)

- Every outbound CTA goes through `/go/[slug]` (`app/go/[slug]/route.ts`). Never link to a product URL directly. The route fires the Vercel Analytics event `outbound_click`. It redirects to `affiliateUrl` only if `affiliateStatus === "active"`, and otherwise to `officialUrl` (`lib/redirect.ts`).
- Never invent affiliate URLs. To activate a program, set `affiliateStatus: "active"` and paste the real link the user gives you. This is a data-only change.
- Affiliate CTAs use `rel="noopener noreferrer sponsored"`. Pages with CTAs or tables show `DisclosureNote`.
- When adding a tool: add a `products.ts` entry with `lastVerified` set to today, add its logo file plus a `logos.ts` entry, and start it as `"pending"` unless the user supplies an active link.

## Gotchas

- Next 16: route `params` is a `Promise`, so `await` it.
- Tailwind v4 has no `tailwind.config`. Theme tokens are in `app/globals.css` (`@theme inline`).
- The `@/` import alias points to the repo root. Tests sit next to their source as `*.test.ts(x)`.

## Docs

`docs/superpowers/plans/*` (about 3,200 lines) are historical records of finished work, so don't read them unless asked. For original intent, `docs/superpowers/specs/2026-09-22-ai-video-finder-design.md` (143 lines) is enough.
