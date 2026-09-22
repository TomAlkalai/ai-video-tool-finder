# AI Video Tool Finder — MVP Design Spec

Date: 2026-09-22

## 1. Purpose

Validate, in one week, whether a small high-intent comparison site for AI
video tools can generate real affiliate clicks (and ideally conversions)
from organically-relevant direct/social traffic. This is a business
experiment, not a long-term product build. Success is measured by learning
where the funnel breaks (distribution, content/UX, offer, or conversion),
not by revenue in week one.

## 2. Non-goals (explicitly out of scope for MVP)

- Recommendation engine / AI quiz ("what should I use for X" free-text tool)
- User accounts, auth, dashboards, subscriptions
- CMS or database — content lives in source files
- Paid traffic, paid SEO tooling, paid analytics
- More than ~8-10 content pages
- Claims of hands-on product testing (we have not tested these tools)

## 3. Tech stack

- **Framework:** Next.js (App Router), statically generated pages
- **Styling:** Tailwind CSS
- **Hosting:** Vercel (free/Hobby tier)
- **Domain:** aivideofinder.com (already owned via GoDaddy), DNS pointed at
  Vercel
- **Data storage:** none — a single typed TypeScript file
  (`data/products.ts`) is the product database. No CMS, no DB, matches
  YAGNI guidance in the source brief.
- **Analytics:** Vercel Web Analytics (free tier) for pageviews, plus a
  custom `outbound_click` event fired from the `/go/[slug]` redirect route.
  No paid analytics tooling.

## 4. Product data model

Single file `data/products.ts`, exporting a typed array. Fields per the
source brief:

```ts
type Product = {
  name: string;
  slug: string;
  category: string[];          // e.g. ["youtube", "faceless", "editing"]
  pricing: string;             // short human-readable summary
  freePlan: boolean;
  mainFeatures: string[];
  targetUsers: string;
  pros: string[];
  cons: string[];
  affiliateUrl: string;        // real affiliate link once approved
  officialUrl: string;         // direct link, used while affiliate_status is "pending"
  affiliateStatus: "pending" | "active" | "rejected";
  lastVerified: string;        // ISO date pricing/features were last checked
};
```

Seven products at launch: VEED, InVideo, Pictory, Descript, HeyGen,
Synthesia, Runway. Pricing/features are researched from current official
sources at build time and re-checked before Day 3 affiliate applications,
not copied from old articles.

## 5. Affiliate link handling (honesty mechanic)

The user is starting with **zero existing affiliate accounts** and will
apply to programs during the build, reporting back which get accepted.

- Every product starts with `affiliateStatus: "pending"`.
- All outbound CTA buttons route through `/go/[slug]`, a route handler that:
  1. Looks up the product by slug.
  2. Fires a Vercel Analytics custom event `outbound_click` with the
     product slug and the page it was clicked from.
  3. Redirects (302) to `affiliateUrl` if `affiliateStatus === "active"`,
     otherwise to `officialUrl`.
- No fabricated affiliate links are ever used. When the user reports a
  program acceptance, we flip that product's `affiliateStatus` to
  `"active"` and fill in the real `affiliateUrl` — a one-line data change,
  no code change.
- `/affiliate-disclosure` page explains the relationship plainly, and a
  short disclosure line appears near comparison tables/CTAs sitewide.

## 6. Site structure

Home (`/`): hero + "What are you trying to make?" grid linking to the
recommendation pages below.

Content pages (8, matching the source brief's ~8-10 target):

- `/ai-video-tools` — hub page, short profile card per tool, links out to
  relevant comparison/recommendation pages
- `/best-ai-video-generator-for-youtube`
- `/best-ai-video-generator-for-faceless-youtube`
- `/best-ai-video-tool-for-tiktok`
- `/best-ai-avatar-generator`
- `/best-ai-video-tool-for-product-ads`
- `/best-ai-video-editor`
- `/invideo-vs-pictory`
- `/veed-vs-descript`

Plus `/affiliate-disclosure` (required, not counted toward content total).

Each recommendation page: explains what matters for that specific use case
(script-to-video, AI voice, editing, subtitles, export quality, pricing,
ease of use as relevant), a comparison table of the relevant tools, and
verdict-style prose ("best for X because...", "not ideal if you need
Z..."), not a flat ranked list. Each comparison page (tool vs tool) covers
pricing, features, AI capabilities, editing, ease of use, target audience,
limitations, free plan, and relevant use cases side by side.

Content is written from current public sources (official pricing/docs
pages), explicitly not claiming personal testing anywhere.

## 7. Design/UX requirements

Clean modern SaaS-comparison-site look: fast, mobile-responsive, good
typography, clear CTAs, real comparison tables, generous spacing.
Explicitly avoid: walls of generic text, excessive gradients, fake
testimonials/reviews/ratings/user counts, keyword stuffing, near-duplicate
pages.

## 8. Shared components

- `Nav`, `Footer`
- `UseCaseGrid` (homepage)
- `ProductCard` (hub page)
- `ComparisonTable` (recommendation + comparison pages)
- `AffiliateCta` (button that always renders a `/go/[slug]` link)
- `DisclosureNote` (short inline disclosure, used near tables/CTAs)

## 9. Out of scope for this spec (future, not now)

Free-text recommendation engine ("I want to make 10-minute faceless
YouTube videos...") described in the source brief section 11 — explicitly
deferred until the basic comparison site shows signal.

## 10. Open items to resolve during the week (not blockers to launch)

- Which affiliate programs actually accept the site (user is applying in
  parallel with the build; data file gets updated as approvals come in)
- Whether a 9th/10th page (e.g. price-bucketed "AI video tools under $X")
  is worth adding once early click data shows intent for it
