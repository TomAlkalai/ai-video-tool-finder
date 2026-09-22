# AI Video Tool Finder MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy the AI Video Tool Finder affiliate comparison site described in the design spec, on entirely free infrastructure.

**Architecture:** Next.js (App Router) statically generated site, styled with Tailwind CSS, product data in a single typed TypeScript file (no DB/CMS), an `/go/[slug]` route handler that centralizes outbound affiliate/official link redirection and analytics, and content pages built from two small generic templates (`RecommendationPage`, `ComparisonPage`) driven by per-page config objects to avoid duplicating markup across the 7 near-identical content pages.

**Tech Stack:** Next.js 14+ (App Router, TypeScript), Tailwind CSS, Vitest + React Testing Library (unit/component tests), Vercel Hobby (free) tier for hosting, `@vercel/analytics` (free tier) for pageviews + custom `outbound_click` events.

**Spec:** [docs/superpowers/specs/2026-09-22-ai-video-finder-design.md](../specs/2026-09-22-ai-video-finder-design.md)

## Global Constraints

- Hosting must be Vercel's free Hobby tier — no paid plans, no paid add-ons.
- No paid traffic, paid SEO tooling, or paid analytics — `@vercel/analytics` free tier only.
- No CMS, no database — `data/products.ts` is the single source of truth for product data.
- No fabricated affiliate links. Every product starts `affiliateStatus: "pending"` and outbound clicks go to `officialUrl` until the user reports a program acceptance.
- No claims of hands-on product testing anywhere in copy.
- Max ~8-10 content pages total (7 recommendation/comparison pages + 1 hub page + 1 disclosure page = 9, matches spec).
- Avoid fake testimonials/reviews/ratings/user counts, keyword stuffing, near-duplicate page copy.

---

## File Structure

```
package.json, tsconfig.json, next.config.mjs, tailwind.config.ts, postcss.config.mjs
vitest.config.ts, vitest.setup.ts
app/
  layout.tsx              — root layout, Nav + Footer + Vercel Analytics
  globals.css             — Tailwind directives + base typography
  page.tsx                — home page (hero + UseCaseGrid)
  sitemap.ts
  robots.ts
  ai-video-tools/page.tsx
  best-ai-video-generator-for-youtube/page.tsx
  best-ai-video-generator-for-faceless-youtube/page.tsx
  best-ai-video-tool-for-tiktok/page.tsx
  best-ai-avatar-generator/page.tsx
  best-ai-video-tool-for-product-ads/page.tsx
  best-ai-video-editor/page.tsx
  invideo-vs-pictory/page.tsx
  veed-vs-descript/page.tsx
  affiliate-disclosure/page.tsx
  go/[slug]/route.ts
data/
  products.ts             — Product type + 7 products
  recommendation-pages.ts — config for the 5 use-case pages
  comparison-pages.ts     — config for the 2 tool-vs-tool pages
lib/
  products.ts             — getProductBySlug, getProductsBySlugs
  redirect.ts             — resolveOutboundUrl(product) pure function
components/
  Nav.tsx
  Footer.tsx
  DisclosureNote.tsx
  AffiliateCta.tsx
  ProductCard.tsx
  ComparisonTable.tsx
  UseCaseGrid.tsx
  RecommendationPage.tsx
  ComparisonPage.tsx
tests/ (colocated *.test.ts / *.test.tsx next to source files)
```

**Interfaces locked in up front** (later tasks depend on these exact names):

```ts
// data/products.ts
export type Product = {
  name: string;
  slug: string;
  category: string[];
  pricing: string;
  freePlan: boolean;
  mainFeatures: string[];
  targetUsers: string;
  pros: string[];
  cons: string[];
  affiliateUrl: string;
  officialUrl: string;
  affiliateStatus: "pending" | "active" | "rejected";
  lastVerified: string;
};
export const products: Product[];

// lib/products.ts
export function getProductBySlug(slug: string): Product | undefined;
export function getProductsBySlugs(slugs: string[]): Product[];

// lib/redirect.ts
export function resolveOutboundUrl(product: Product): string;

// data/recommendation-pages.ts
export type RecommendationPageConfig = {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  criteria: string[];           // what matters for this use case
  productSlugs: string[];       // which products to compare, in order
  verdict: { productSlug: string; text: string }[];
};
export const recommendationPages: RecommendationPageConfig[];

// data/comparison-pages.ts
export type ComparisonPageConfig = {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  productSlugA: string;
  productSlugB: string;
  verdict: string;
};
export const comparisonPages: ComparisonPageConfig[];

// components/RecommendationPage.tsx
export function RecommendationPage(props: { config: RecommendationPageConfig }): JSX.Element;

// components/ComparisonPage.tsx
export function ComparisonPage(props: { config: ComparisonPageConfig }): JSX.Element;

// components/AffiliateCta.tsx
export function AffiliateCta(props: { product: Product; label?: string }): JSX.Element;

// components/ComparisonTable.tsx
export function ComparisonTable(props: { products: Product[] }): JSX.Element;

// components/ProductCard.tsx
export function ProductCard(props: { product: Product }): JSX.Element;

// components/UseCaseGrid.tsx
export function UseCaseGrid(props: { items: { href: string; label: string; description: string }[] }): JSX.Element;
```

---

### Task 1: Scaffold Next.js + TypeScript + Tailwind project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `.gitignore`

**Interfaces:**
- Produces: a runnable Next.js App Router project (`npm run dev`, `npm run build`) that all later tasks add pages/components into.

- [ ] **Step 1: Scaffold with create-next-app**

```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias "@/*" --use-npm --no-turbopack
```

When prompted for a project name (if it asks, since `.` is non-empty because of `docs/`), confirm using the current directory.

- [ ] **Step 2: Replace the default home page with a minimal placeholder**

`app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">AI Video Tool Finder</h1>
      <p className="mt-4 text-lg text-gray-600">
        Compare AI video generation tools by use case.
      </p>
    </main>
  );
}
```

- [ ] **Step 3: Verify build succeeds**

Run: `npm run build`
Expected: build completes with no errors, one static route (`/`).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js + Tailwind project"
```

---

### Task 2: Set up Vitest + React Testing Library

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`, `lib/sanity.test.ts`
- Modify: `package.json` (add `test` script and devDependencies)

**Interfaces:**
- Produces: `npm test` running Vitest, available to every later task's tests.

- [ ] **Step 1: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 2: Add config**

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

`vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Add to `package.json` `scripts`: `"test": "vitest run"`.

- [ ] **Step 3: Write a sanity test**

`lib/sanity.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("test setup", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npm test`
Expected: 1 test passes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add Vitest + React Testing Library test setup"
```

---

### Task 3: Product data model + lookup helpers

**Files:**
- Create: `data/products.ts`, `lib/products.ts`, `lib/products.test.ts`

**Interfaces:**
- Produces: `Product` type, `products` array, `getProductBySlug`, `getProductsBySlugs` (exact signatures in File Structure section above).

- [ ] **Step 1: Write failing tests for the lookup helpers**

`lib/products.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { getProductBySlug, getProductsBySlugs } from "./products";

describe("getProductBySlug", () => {
  it("returns the matching product", () => {
    const product = getProductBySlug("veed");
    expect(product?.name).toBe("VEED");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProductBySlug("does-not-exist")).toBeUndefined();
  });
});

describe("getProductsBySlugs", () => {
  it("returns products in the requested order", () => {
    const result = getProductsBySlugs(["descript", "veed"]);
    expect(result.map((p) => p.slug)).toEqual(["descript", "veed"]);
  });

  it("silently skips unknown slugs", () => {
    const result = getProductsBySlugs(["veed", "nope"]);
    expect(result.map((p) => p.slug)).toEqual(["veed"]);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- lib/products.test.ts`
Expected: FAIL — `./products` has no export `getProductBySlug` (data file doesn't exist yet either).

- [ ] **Step 3: Write the product data**

`data/products.ts` — research current pricing/features from each product's official site before filling this in; do not copy stale numbers from old articles. Structure (fill real values):

```ts
export type Product = {
  name: string;
  slug: string;
  category: string[];
  pricing: string;
  freePlan: boolean;
  mainFeatures: string[];
  targetUsers: string;
  pros: string[];
  cons: string[];
  affiliateUrl: string;
  officialUrl: string;
  affiliateStatus: "pending" | "active" | "rejected";
  lastVerified: string;
};

export const products: Product[] = [
  {
    name: "VEED",
    slug: "veed",
    category: ["editing", "youtube", "tiktok", "captions"],
    pricing: "Free plan; paid plans from ~$12/mo billed annually",
    freePlan: true,
    mainFeatures: [
      "Browser-based video editor",
      "Auto subtitles/captions",
      "AI avatars and text-to-speech",
      "Brand kit and templates",
    ],
    targetUsers: "Creators and marketers who want a fast browser-based editor with captions built in",
    pros: ["No install, runs in browser", "Strong auto-caption quality", "Generous free tier for short clips"],
    cons: ["Exports are watermarked/limited on free plan", "Can feel slow on longer timelines"],
    affiliateUrl: "https://www.veed.io",
    officialUrl: "https://www.veed.io",
    affiliateStatus: "pending",
    lastVerified: "2026-09-22",
  },
  {
    name: "InVideo",
    slug: "invideo",
    category: ["youtube", "faceless", "ads"],
    pricing: "Free plan; paid plans from ~$20/mo billed annually",
    freePlan: true,
    mainFeatures: [
      "Text-to-video AI generation",
      "Large template library",
      "AI voiceover",
      "Script-to-video workflow",
    ],
    targetUsers: "YouTubers and marketers who want to go from script or prompt to a rough-cut video fast",
    pros: ["Fast script-to-video pipeline", "Large stock/template library", "Good for faceless YouTube content"],
    cons: ["AI-generated footage quality is inconsistent", "Free plan is watermarked"],
    affiliateUrl: "https://invideo.io",
    officialUrl: "https://invideo.io",
    affiliateStatus: "pending",
    lastVerified: "2026-09-22",
  },
  {
    name: "Pictory",
    slug: "pictory",
    category: ["youtube", "faceless", "repurposing"],
    pricing: "No permanent free plan; paid plans from ~$19/mo billed annually",
    freePlan: false,
    mainFeatures: [
      "Turns long-form content/blog posts into short videos",
      "Auto-highlight clipping from long videos",
      "Text-to-video from script",
      "Auto captions",
    ],
    targetUsers: "Creators repurposing blog posts or long videos into short-form clips",
    pros: ["Strong repurposing workflow (blog -> video, long -> short)", "Good caption styling options"],
    cons: ["No free plan, only a trial", "Less suited to fully original creative video"],
    affiliateUrl: "https://pictory.ai",
    officialUrl: "https://pictory.ai",
    affiliateStatus: "pending",
    lastVerified: "2026-09-22",
  },
  {
    name: "Descript",
    slug: "descript",
    category: ["editing", "podcast", "captions"],
    pricing: "Free plan; paid plans from ~$12/mo billed annually",
    freePlan: true,
    mainFeatures: [
      "Edit video/audio by editing a text transcript",
      "AI overdub / voice cloning",
      "Filler-word removal",
      "Screen recording",
    ],
    targetUsers: "Podcasters and creators who prefer editing by editing text rather than a timeline",
    pros: ["Transcript-based editing is very fast for talking-head content", "Excellent filler-word removal"],
    cons: ["Less suited to heavy motion-graphics style editing", "Free plan caps transcription minutes"],
    affiliateUrl: "https://www.descript.com",
    officialUrl: "https://www.descript.com",
    affiliateStatus: "pending",
    lastVerified: "2026-09-22",
  },
  {
    name: "HeyGen",
    slug: "heygen",
    category: ["avatar", "ads", "localization"],
    pricing: "Free plan (limited credits); paid plans from ~$24/mo billed annually",
    freePlan: true,
    mainFeatures: [
      "Realistic AI avatars",
      "Text-to-video with avatar presenters",
      "Multi-language voice translation/dubbing",
      "Custom avatar creation",
    ],
    targetUsers: "Teams that want a presenter-style video without filming a person",
    pros: ["Best-in-class avatar realism", "Strong multi-language dubbing"],
    cons: ["Paid tiers needed for custom avatars and longer videos", "Avatar movement can still read as synthetic"],
    affiliateUrl: "https://www.heygen.com",
    officialUrl: "https://www.heygen.com",
    affiliateStatus: "pending",
    lastVerified: "2026-09-22",
  },
  {
    name: "Synthesia",
    slug: "synthesia",
    category: ["avatar", "training", "localization"],
    pricing: "No permanent free plan; paid plans from ~$29/mo billed annually",
    freePlan: false,
    mainFeatures: [
      "AI avatar video generation",
      "120+ language voiceovers",
      "Custom avatar creation (studio plans)",
      "Screen recording + templates for training videos",
    ],
    targetUsers: "Corporate teams making training, onboarding, or internal comms videos",
    pros: ["Polished, enterprise-friendly output", "Wide language coverage for localization"],
    cons: ["No free plan", "Overkill/pricey for casual creators"],
    affiliateUrl: "https://www.synthesia.io",
    officialUrl: "https://www.synthesia.io",
    affiliateStatus: "pending",
    lastVerified: "2026-09-22",
  },
  {
    name: "Runway",
    slug: "runway",
    category: ["editing", "generative", "ads"],
    pricing: "Free plan (limited credits); paid plans from ~$12/mo billed annually",
    freePlan: true,
    mainFeatures: [
      "Text-to-video and image-to-video generative AI",
      "AI video editing tools (green screen, inpainting)",
      "Motion brush and camera controls",
      "Fast generative iteration for short clips",
    ],
    targetUsers: "Creators and editors who want generative AI b-roll or effects, not full narrated videos",
    pros: ["Leading generative video quality for short clips", "Powerful AI editing magic tools"],
    cons: ["Not built for long-form or talking-head video", "Credits burn fast on paid generation"],
    affiliateUrl: "https://runwayml.com",
    officialUrl: "https://runwayml.com",
    affiliateStatus: "pending",
    lastVerified: "2026-09-22",
  },
];
```

`lib/products.ts`:

```ts
import { products, type Product } from "@/data/products";

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsBySlugs(slugs: string[]): Product[] {
  return slugs
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is Product => p !== undefined);
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npm test -- lib/products.test.ts`
Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add product data model and lookup helpers"
```

---

### Task 4: Outbound redirect logic + `/go/[slug]` route

**Files:**
- Create: `lib/redirect.ts`, `lib/redirect.test.ts`, `app/go/[slug]/route.ts`

**Interfaces:**
- Consumes: `getProductBySlug` from `lib/products.ts` (Task 3), `Product` type from `data/products.ts`.
- Produces: `resolveOutboundUrl(product)`; the `/go/[slug]` route.

- [ ] **Step 1: Write failing tests for the pure redirect logic**

`lib/redirect.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { resolveOutboundUrl } from "./redirect";
import type { Product } from "@/data/products";

function makeProduct(overrides: Partial<Product>): Product {
  return {
    name: "Test",
    slug: "test",
    category: [],
    pricing: "",
    freePlan: false,
    mainFeatures: [],
    targetUsers: "",
    pros: [],
    cons: [],
    affiliateUrl: "https://affiliate.example.com/test",
    officialUrl: "https://official.example.com/test",
    affiliateStatus: "pending",
    lastVerified: "2026-01-01",
    ...overrides,
  };
}

describe("resolveOutboundUrl", () => {
  it("returns the official URL when affiliate status is pending", () => {
    const product = makeProduct({ affiliateStatus: "pending" });
    expect(resolveOutboundUrl(product)).toBe(product.officialUrl);
  });

  it("returns the official URL when affiliate status is rejected", () => {
    const product = makeProduct({ affiliateStatus: "rejected" });
    expect(resolveOutboundUrl(product)).toBe(product.officialUrl);
  });

  it("returns the affiliate URL when affiliate status is active", () => {
    const product = makeProduct({ affiliateStatus: "active" });
    expect(resolveOutboundUrl(product)).toBe(product.affiliateUrl);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- lib/redirect.test.ts`
Expected: FAIL — `./redirect` module doesn't exist.

- [ ] **Step 3: Implement the pure function**

`lib/redirect.ts`:

```ts
import type { Product } from "@/data/products";

export function resolveOutboundUrl(product: Product): string {
  return product.affiliateStatus === "active" ? product.affiliateUrl : product.officialUrl;
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npm test -- lib/redirect.test.ts`
Expected: 3 tests pass.

- [ ] **Step 5: Implement the route handler**

`app/go/[slug]/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";
import { resolveOutboundUrl } from "@/lib/redirect";
import { track } from "@vercel/analytics/server";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return NextResponse.redirect(new URL("/ai-video-tools", request.url), { status: 302 });
  }

  const referer = request.headers.get("referer") ?? "";

  await track("outbound_click", { slug: product.slug, from: referer });

  return NextResponse.redirect(resolveOutboundUrl(product), { status: 302 });
}
```

Note: `@vercel/analytics` is installed in Task 12 alongside the rest of the analytics wiring. If this task runs before Task 12, run `npm install @vercel/analytics` here first so the route compiles.

- [ ] **Step 6: Verify the full test suite and build still pass**

Run: `npm test && npm run build`
Expected: all tests pass, build succeeds (the `/go/[slug]` route appears as a dynamic function route).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Add outbound redirect logic and /go/[slug] route"
```

---

### Task 5: Nav, Footer, DisclosureNote

**Files:**
- Create: `components/Nav.tsx`, `components/Footer.tsx`, `components/DisclosureNote.tsx`, `components/DisclosureNote.test.tsx`
- Modify: `app/layout.tsx` (render `Nav`/`Footer` around `children`)

**Interfaces:**
- Produces: `DisclosureNote()` (no props — fixed compliance text, used by `RecommendationPage`/`ComparisonPage` in Tasks 9-10).

- [ ] **Step 1: Write failing test for DisclosureNote content**

`components/DisclosureNote.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DisclosureNote } from "./DisclosureNote";

describe("DisclosureNote", () => {
  it("discloses the affiliate relationship and links to the full policy", () => {
    render(<DisclosureNote />);
    expect(screen.getByText(/may earn a commission/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /affiliate disclosure/i })).toHaveAttribute(
      "href",
      "/affiliate-disclosure"
    );
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- components/DisclosureNote.test.tsx`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement components**

`components/DisclosureNote.tsx`:

```tsx
import Link from "next/link";

export function DisclosureNote() {
  return (
    <p className="text-sm text-gray-500">
      We may earn a commission if you sign up through a link on this page, at
      no extra cost to you. See our{" "}
      <Link href="/affiliate-disclosure" className="underline">
        affiliate disclosure
      </Link>
      .
    </p>
  );
}
```

`components/Nav.tsx`:

```tsx
import Link from "next/link";

const links = [
  { href: "/ai-video-tools", label: "All tools" },
  { href: "/affiliate-disclosure", label: "Disclosure" },
];

export function Nav() {
  return (
    <header className="border-b border-gray-200">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold">
          AI Video Tool Finder
        </Link>
        <ul className="flex gap-6 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

`components/Footer.tsx`:

```tsx
import { DisclosureNote } from "./DisclosureNote";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <DisclosureNote />
        <p className="mt-2 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} AI Video Tool Finder
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Wire into layout**

`app/layout.tsx` — wrap `{children}` with `<Nav />` above and `<Footer />` below, inside `<body>`.

- [ ] **Step 5: Run test, verify it passes, then build**

Run: `npm test -- components/DisclosureNote.test.tsx && npm run build`
Expected: 1 test passes, build succeeds.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add Nav, Footer, and DisclosureNote components"
```

---

### Task 6: AffiliateCta, ProductCard, ComparisonTable

**Files:**
- Create: `components/AffiliateCta.tsx`, `components/AffiliateCta.test.tsx`, `components/ProductCard.tsx`, `components/ComparisonTable.tsx`, `components/ComparisonTable.test.tsx`

**Interfaces:**
- Consumes: `Product` type (Task 3).
- Produces: `AffiliateCta`, `ProductCard`, `ComparisonTable` (used by hub page, recommendation/comparison templates).

- [ ] **Step 1: Write failing test for AffiliateCta**

`components/AffiliateCta.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AffiliateCta } from "./AffiliateCta";
import type { Product } from "@/data/products";

const product: Product = {
  name: "VEED",
  slug: "veed",
  category: [],
  pricing: "",
  freePlan: true,
  mainFeatures: [],
  targetUsers: "",
  pros: [],
  cons: [],
  affiliateUrl: "https://affiliate.example.com",
  officialUrl: "https://official.example.com",
  affiliateStatus: "pending",
  lastVerified: "2026-01-01",
};

describe("AffiliateCta", () => {
  it("always links through the /go/[slug] redirect route, never the raw URL", () => {
    render(<AffiliateCta product={product} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/go/veed");
  });

  it("uses a custom label when provided", () => {
    render(<AffiliateCta product={product} label="Try VEED free" />);
    expect(screen.getByRole("link", { name: "Try VEED free" })).toBeInTheDocument();
  });

  it("defaults to a generic visit label", () => {
    render(<AffiliateCta product={product} />);
    expect(screen.getByRole("link", { name: /visit veed/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- components/AffiliateCta.test.tsx`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement AffiliateCta**

`components/AffiliateCta.tsx`:

```tsx
import type { Product } from "@/data/products";

export function AffiliateCta({ product, label }: { product: Product; label?: string }) {
  return (
    <a
      href={`/go/${product.slug}`}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
    >
      {label ?? `Visit ${product.name}`}
    </a>
  );
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npm test -- components/AffiliateCta.test.tsx`
Expected: 3 tests pass.

- [ ] **Step 5: Write failing test for ComparisonTable**

`components/ComparisonTable.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComparisonTable } from "./ComparisonTable";
import type { Product } from "@/data/products";

const products: Product[] = [
  {
    name: "VEED",
    slug: "veed",
    category: [],
    pricing: "Free plan; paid from $12/mo",
    freePlan: true,
    mainFeatures: ["Auto captions"],
    targetUsers: "Creators",
    pros: ["Fast"],
    cons: ["Watermark on free plan"],
    affiliateUrl: "https://a.example.com",
    officialUrl: "https://o.example.com",
    affiliateStatus: "pending",
    lastVerified: "2026-01-01",
  },
  {
    name: "Descript",
    slug: "descript",
    category: [],
    pricing: "Free plan; paid from $12/mo",
    freePlan: true,
    mainFeatures: ["Transcript editing"],
    targetUsers: "Podcasters",
    pros: ["Text-based editing"],
    cons: ["Limited free minutes"],
    affiliateUrl: "https://a2.example.com",
    officialUrl: "https://o2.example.com",
    affiliateStatus: "pending",
    lastVerified: "2026-01-01",
  },
];

describe("ComparisonTable", () => {
  it("renders one column per product with name and pricing", () => {
    render(<ComparisonTable products={products} />);
    expect(screen.getByText("VEED")).toBeInTheDocument();
    expect(screen.getByText("Descript")).toBeInTheDocument();
    expect(screen.getAllByText(/Free plan; paid from \$12\/mo/)).toHaveLength(2);
  });

  it("renders a CTA linking through /go/[slug] for every product", () => {
    render(<ComparisonTable products={products} />);
    expect(screen.getByRole("link", { name: /visit veed/i })).toHaveAttribute("href", "/go/veed");
    expect(screen.getByRole("link", { name: /visit descript/i })).toHaveAttribute("href", "/go/descript");
  });
});
```

- [ ] **Step 6: Run test, verify it fails**

Run: `npm test -- components/ComparisonTable.test.tsx`
Expected: FAIL — module doesn't exist.

- [ ] **Step 7: Implement ComparisonTable and ProductCard**

`components/ComparisonTable.tsx`:

```tsx
import type { Product } from "@/data/products";
import { AffiliateCta } from "./AffiliateCta";

const rows: { label: string; render: (p: Product) => React.ReactNode }[] = [
  { label: "Pricing", render: (p) => p.pricing },
  { label: "Free plan", render: (p) => (p.freePlan ? "Yes" : "No") },
  { label: "Main features", render: (p) => (
    <ul className="list-disc pl-4">
      {p.mainFeatures.map((f) => (
        <li key={f}>{f}</li>
      ))}
    </ul>
  ) },
  { label: "Best for", render: (p) => p.targetUsers },
  { label: "Pros", render: (p) => (
    <ul className="list-disc pl-4">
      {p.pros.map((pro) => (
        <li key={pro}>{pro}</li>
      ))}
    </ul>
  ) },
  { label: "Cons", render: (p) => (
    <ul className="list-disc pl-4">
      {p.cons.map((con) => (
        <li key={con}>{con}</li>
      ))}
    </ul>
  ) },
];

export function ComparisonTable({ products }: { products: Product[] }) {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr>
          <th className="border-b border-gray-200 py-2 pr-4"></th>
          {products.map((p) => (
            <th key={p.slug} className="border-b border-gray-200 py-2 pr-4 align-bottom">
              <div className="text-base font-semibold">{p.name}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row" className="border-b border-gray-100 py-3 pr-4 align-top font-medium text-gray-500">
              {row.label}
            </th>
            {products.map((p) => (
              <td key={p.slug} className="border-b border-gray-100 py-3 pr-4 align-top">
                {row.render(p)}
              </td>
            ))}
          </tr>
        ))}
        <tr>
          <th scope="row" className="py-3 pr-4"></th>
          {products.map((p) => (
            <td key={p.slug} className="py-3 pr-4">
              <AffiliateCta product={p} />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
```

`components/ProductCard.tsx`:

```tsx
import type { Product } from "@/data/products";
import { AffiliateCta } from "./AffiliateCta";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="rounded-lg border border-gray-200 p-5">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="mt-1 text-sm text-gray-500">{product.pricing}</p>
      <p className="mt-3 text-sm">{product.targetUsers}</p>
      <ul className="mt-3 list-disc pl-4 text-sm text-gray-600">
        {product.mainFeatures.slice(0, 3).map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <div className="mt-4">
        <AffiliateCta product={product} />
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Run tests, verify pass, then build**

Run: `npm test && npm run build`
Expected: all tests pass, build succeeds.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Add AffiliateCta, ProductCard, and ComparisonTable components"
```

---

### Task 7: Home page (hero + UseCaseGrid)

**Files:**
- Create: `components/UseCaseGrid.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `RecommendationPageConfig` slugs will exist from Task 9, but this task hardcodes the same 5 use-case hrefs directly (avoids a forward dependency on Task 9's data file — both read from the same fixed URL list defined in the spec's Site Structure section).

- [ ] **Step 1: Implement UseCaseGrid**

`components/UseCaseGrid.tsx`:

```tsx
import Link from "next/link";

type UseCaseItem = { href: string; label: string; description: string };

export function UseCaseGrid({ items }: { items: UseCaseItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-lg border border-gray-200 p-5 hover:border-indigo-400"
        >
          <h3 className="font-semibold">{item.label}</h3>
          <p className="mt-1 text-sm text-gray-500">{item.description}</p>
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Wire into the home page**

`app/page.tsx`:

```tsx
import { UseCaseGrid } from "@/components/UseCaseGrid";

const useCases = [
  { href: "/best-ai-video-generator-for-youtube", label: "YouTube videos", description: "Full-length YouTube content, from script to upload." },
  { href: "/best-ai-video-generator-for-faceless-youtube", label: "Faceless YouTube channels", description: "No on-camera presenter, script-to-video workflows." },
  { href: "/best-ai-video-tool-for-tiktok", label: "TikTok / Shorts", description: "Fast, vertical, short-form clips." },
  { href: "/best-ai-avatar-generator", label: "AI avatar videos", description: "A synthetic presenter without filming a person." },
  { href: "/best-ai-video-tool-for-product-ads", label: "Product ads", description: "Short promotional videos for a product or offer." },
  { href: "/best-ai-video-editor", label: "General editing", description: "Editing existing footage, captions, and cleanup." },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">AI Video Tool Finder</h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-600">
        Compare AI video generation and editing tools by what you&apos;re
        actually trying to make. No hands-on testing claims &mdash; just a
        clear breakdown of pricing, features, and trade-offs from official
        sources.
      </p>
      <div className="mt-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          What are you trying to make?
        </h2>
        <UseCaseGrid items={useCases} />
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Build and manually verify**

Run: `npm run build`
Expected: build succeeds. Then run `npm run dev` and confirm in a browser that `/` renders the hero and 6 use-case links (all will 404 until Task 9/10 add those pages — that's expected at this point).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Build home page with hero and use-case grid"
```

---

### Task 8: Hub page `/ai-video-tools`

**Files:**
- Create: `app/ai-video-tools/page.tsx`

**Interfaces:**
- Consumes: `products` (Task 3), `ProductCard` (Task 6).

- [ ] **Step 1: Implement the hub page**

`app/ai-video-tools/page.tsx`:

```tsx
import type { Metadata } from "next";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "AI Video Tools Compared | AI Video Tool Finder",
  description: "A plain breakdown of pricing, features, and trade-offs for the leading AI video generation and editing tools.",
};

export default function AiVideoToolsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">AI Video Tools</h1>
      <p className="mt-4 max-w-2xl text-gray-600">
        Short profiles of each tool we track. For a recommendation tailored
        to a specific use case, see the{" "}
        <a href="/" className="underline">
          use-case guides
        </a>
        .
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: build succeeds, `/ai-video-tools` listed as a static route.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Add /ai-video-tools hub page"
```

---

### Task 9: Recommendation page template + 5 use-case pages

**Files:**
- Create: `data/recommendation-pages.ts`, `components/RecommendationPage.tsx`, `app/best-ai-video-generator-for-youtube/page.tsx`, `app/best-ai-video-generator-for-faceless-youtube/page.tsx`, `app/best-ai-video-tool-for-tiktok/page.tsx`, `app/best-ai-avatar-generator/page.tsx`, `app/best-ai-video-tool-for-product-ads/page.tsx`

**Interfaces:**
- Consumes: `getProductsBySlugs` (Task 3), `ComparisonTable` (Task 6), `DisclosureNote` (Task 5).
- Produces: `RecommendationPage` component reused by all 5 pages above.

- [ ] **Step 1: Write the page config data**

`data/recommendation-pages.ts`:

```ts
export type RecommendationPageConfig = {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  criteria: string[];
  productSlugs: string[];
  verdict: { productSlug: string; text: string }[];
};

export const recommendationPages: RecommendationPageConfig[] = [
  {
    slug: "best-ai-video-generator-for-youtube",
    title: "Best AI Video Generator for YouTube",
    metaDescription: "Compare AI video tools for making full-length YouTube videos, by pricing, features, and workflow.",
    intro: "For full-length YouTube videos, the tool needs to handle a full script-to-video pipeline, not just short clips: AI voice, editing, and export quality all matter more than for short-form content.",
    criteria: ["Script-to-video workflow", "AI voice quality", "Editing depth", "Export resolution and limits", "Pricing at YouTube-length video volumes"],
    productSlugs: ["invideo", "veed", "descript"],
    verdict: [
      { productSlug: "invideo", text: "Best overall for going from a script or outline to a rough-cut long-form video quickly." },
      { productSlug: "descript", text: "Best if the video is mostly talking-head footage you already recorded and want to edit fast." },
      { productSlug: "veed", text: "Good middle ground if captions and quick browser-based editing matter most." },
    ],
  },
  {
    slug: "best-ai-video-generator-for-faceless-youtube",
    title: "Best AI Video Generator for Faceless YouTube Channels",
    metaDescription: "Compare AI video tools for faceless YouTube channels: script-to-video, stock footage, and AI voiceover.",
    intro: "Faceless channels lean entirely on script-to-video generation, stock/AI footage, and AI voiceover, since there's no on-camera presenter to film or edit around.",
    criteria: ["Script-to-video generation quality", "AI voiceover options", "Stock footage/library breadth", "Repurposing existing long-form content"],
    productSlugs: ["invideo", "pictory", "runway"],
    verdict: [
      { productSlug: "invideo", text: "Best for a full script-to-video pipeline built specifically for this workflow." },
      { productSlug: "pictory", text: "Best if you're repurposing existing blog posts or long-form video into faceless shorts." },
      { productSlug: "runway", text: "Best for generative b-roll when stock footage feels too generic, used alongside another editor." },
    ],
  },
  {
    slug: "best-ai-video-tool-for-tiktok",
    title: "Best AI Video Tool for TikTok",
    metaDescription: "Compare AI video tools for TikTok and Shorts: fast turnaround, captions, and vertical export.",
    intro: "TikTok rewards speed and captions over polish: the best tools here get from idea to a captioned vertical clip in minutes.",
    criteria: ["Turnaround speed", "Auto-caption quality", "Vertical/9:16 export", "Trend-friendly templates"],
    productSlugs: ["veed", "invideo"],
    verdict: [
      { productSlug: "veed", text: "Best for fast, caption-first vertical clips edited directly in the browser." },
      { productSlug: "invideo", text: "Best if you want templated short-form videos generated from a script or prompt." },
    ],
  },
  {
    slug: "best-ai-avatar-generator",
    title: "Best AI Avatar Generator",
    metaDescription: "Compare AI avatar video tools for presenter-style videos without filming a person.",
    intro: "AI avatar tools stand in for a human presenter. The main trade-offs are avatar realism, language coverage, and how much a custom avatar costs.",
    criteria: ["Avatar realism", "Number of languages/voices", "Custom avatar creation", "Pricing per minute of output"],
    productSlugs: ["heygen", "synthesia"],
    verdict: [
      { productSlug: "heygen", text: "Best avatar realism and value for creators, with a usable free tier to test first." },
      { productSlug: "synthesia", text: "Best for corporate training/onboarding video at scale, with no free plan." },
    ],
  },
  {
    slug: "best-ai-video-tool-for-product-ads",
    title: "Best AI Video Tool for Product Ads",
    metaDescription: "Compare AI video tools for short promotional and product ad videos.",
    intro: "Product ads are short, need to hit a clear call to action, and often need multiple variants fast for testing.",
    criteria: ["Speed to first draft", "Template variety for ads", "Ability to produce multiple variants", "Export quality for paid placements"],
    productSlugs: ["invideo", "runway", "heygen"],
    verdict: [
      { productSlug: "invideo", text: "Best for producing several ad variants quickly from templates." },
      { productSlug: "runway", text: "Best for a distinctive generative-AI look that stands out from templated ads." },
      { productSlug: "heygen", text: "Best when the ad needs a presenter talking directly to camera without filming one." },
    ],
  },
];
```

- [ ] **Step 2: Implement the template**

`components/RecommendationPage.tsx`:

```tsx
import { getProductsBySlugs, getProductBySlug } from "@/lib/products";
import { ComparisonTable } from "./ComparisonTable";
import { DisclosureNote } from "./DisclosureNote";
import type { RecommendationPageConfig } from "@/data/recommendation-pages";

export function RecommendationPage({ config }: { config: RecommendationPageConfig }) {
  const products = getProductsBySlugs(config.productSlugs);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">{config.title}</h1>
      <p className="mt-4 max-w-3xl text-gray-600">{config.intro}</p>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-gray-400">
        What matters here
      </h2>
      <ul className="mt-3 list-disc pl-5 text-gray-700">
        {config.criteria.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>

      <div className="mt-10 overflow-x-auto">
        <ComparisonTable products={products} />
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Verdict
      </h2>
      <div className="mt-3 space-y-3">
        {config.verdict.map((v) => {
          const product = getProductBySlug(v.productSlug);
          if (!product) return null;
          return (
            <p key={v.productSlug}>
              <strong>{product.name}:</strong> {v.text}
            </p>
          );
        })}
      </div>

      <div className="mt-10">
        <DisclosureNote />
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Wire up the 5 pages**

Each page file follows this exact pattern (shown for `best-ai-video-generator-for-youtube`; repeat for the other 4 slugs listed in Files above, matching each `metadata` to its config entry):

`app/best-ai-video-generator-for-youtube/page.tsx`:

```tsx
import type { Metadata } from "next";
import { RecommendationPage } from "@/components/RecommendationPage";
import { recommendationPages } from "@/data/recommendation-pages";

const config = recommendationPages.find((p) => p.slug === "best-ai-video-generator-for-youtube")!;

export const metadata: Metadata = {
  title: `${config.title} | AI Video Tool Finder`,
  description: config.metaDescription,
};

export default function Page() {
  return <RecommendationPage config={config} />;
}
```

Repeat for:
- `app/best-ai-video-generator-for-faceless-youtube/page.tsx` (slug `best-ai-video-generator-for-faceless-youtube`)
- `app/best-ai-video-tool-for-tiktok/page.tsx` (slug `best-ai-video-tool-for-tiktok`)
- `app/best-ai-avatar-generator/page.tsx` (slug `best-ai-avatar-generator`)
- `app/best-ai-video-tool-for-product-ads/page.tsx` (slug `best-ai-video-tool-for-product-ads`)

- [ ] **Step 4: Build and verify all 5 routes render**

Run: `npm run build`
Expected: build succeeds, all 5 routes listed as static routes with no runtime errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add recommendation page template and 5 use-case pages"
```

---

### Task 10: Comparison page template + 2 tool-vs-tool pages

**Files:**
- Create: `data/comparison-pages.ts`, `components/ComparisonPage.tsx`, `app/invideo-vs-pictory/page.tsx`, `app/veed-vs-descript/page.tsx`

**Interfaces:**
- Consumes: `getProductsBySlugs` (Task 3), `ComparisonTable` (Task 6), `DisclosureNote` (Task 5).

- [ ] **Step 1: Write the page config data**

`data/comparison-pages.ts`:

```ts
export type ComparisonPageConfig = {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  productSlugA: string;
  productSlugB: string;
  verdict: string;
};

export const comparisonPages: ComparisonPageConfig[] = [
  {
    slug: "invideo-vs-pictory",
    title: "InVideo vs Pictory",
    metaDescription: "InVideo vs Pictory compared on pricing, features, AI capabilities, and best use cases.",
    intro: "Both InVideo and Pictory target script-to-video and repurposing workflows, but they optimize for different starting points.",
    productSlugA: "invideo",
    productSlugB: "pictory",
    verdict: "Pick InVideo if you're starting from a script or prompt and want a broad template library. Pick Pictory if you're starting from existing long-form content (a blog post or a long video) that you want to turn into shorter videos.",
  },
  {
    slug: "veed-vs-descript",
    title: "VEED vs Descript",
    metaDescription: "VEED vs Descript compared on pricing, features, editing style, and best use cases.",
    intro: "VEED and Descript are both editors with strong caption/transcript tooling, but they differ in editing paradigm: timeline-based versus transcript-based.",
    productSlugA: "veed",
    productSlugB: "descript",
    verdict: "Pick VEED for fast, browser-based timeline editing with strong auto-captions. Pick Descript if you'd rather edit by editing a text transcript, especially for podcast or talking-head content.",
  },
];
```

- [ ] **Step 2: Implement the template**

`components/ComparisonPage.tsx`:

```tsx
import { getProductBySlug } from "@/lib/products";
import { ComparisonTable } from "./ComparisonTable";
import { DisclosureNote } from "./DisclosureNote";
import type { ComparisonPageConfig } from "@/data/comparison-pages";

export function ComparisonPage({ config }: { config: ComparisonPageConfig }) {
  const productA = getProductBySlug(config.productSlugA);
  const productB = getProductBySlug(config.productSlugB);
  const products = [productA, productB].filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">{config.title}</h1>
      <p className="mt-4 max-w-3xl text-gray-600">{config.intro}</p>

      <div className="mt-10 overflow-x-auto">
        <ComparisonTable products={products} />
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Verdict
      </h2>
      <p className="mt-3 max-w-3xl">{config.verdict}</p>

      <div className="mt-10">
        <DisclosureNote />
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Wire up the 2 pages**

`app/invideo-vs-pictory/page.tsx`:

```tsx
import type { Metadata } from "next";
import { ComparisonPage } from "@/components/ComparisonPage";
import { comparisonPages } from "@/data/comparison-pages";

const config = comparisonPages.find((p) => p.slug === "invideo-vs-pictory")!;

export const metadata: Metadata = {
  title: `${config.title} | AI Video Tool Finder`,
  description: config.metaDescription,
};

export default function Page() {
  return <ComparisonPage config={config} />;
}
```

Repeat identically for `app/veed-vs-descript/page.tsx` with slug `veed-vs-descript`.

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: build succeeds, both routes render as static routes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add comparison page template and 2 tool-vs-tool pages"
```

---

### Task 11: Affiliate disclosure page

**Files:**
- Create: `app/affiliate-disclosure/page.tsx`

- [ ] **Step 1: Implement the page**

`app/affiliate-disclosure/page.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | AI Video Tool Finder",
  description: "How AI Video Tool Finder makes money and how that affects the recommendations on this site.",
};

export default function AffiliateDisclosurePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Affiliate Disclosure</h1>
      <div className="mt-6 space-y-4 text-gray-700">
        <p>
          AI Video Tool Finder is supported by affiliate relationships. When
          you click a &quot;Visit&quot; link on this site and sign up for a
          product, we may earn a commission, at no extra cost to you.
        </p>
        <p>
          Not every product listed on this site has an active affiliate
          relationship with us. Where we don&apos;t yet have one, the link
          simply goes to the product&apos;s official site directly, and we
          earn nothing from your click.
        </p>
        <p>
          Affiliate relationships never determine which products we list or
          how we describe their pricing, features, or trade-offs. We have
          not personally tested every product on this site; comparisons are
          based on each product&apos;s current public pricing pages and
          documentation, checked at the date shown on each page.
        </p>
        <p>
          If you have questions about a specific recommendation or spot
          outdated information, feel free to reach out.
        </p>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: build succeeds, route renders.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Add affiliate disclosure page"
```

---

### Task 12: SEO basics + Vercel Web Analytics wiring

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`
- Modify: `app/layout.tsx` (add `<Analytics />`, root `metadata` with `metadataBase`)

**Interfaces:**
- Produces: `@vercel/analytics` installed (satisfies the `import { track } from "@vercel/analytics/server"` used in Task 4's route handler if not already installed there).

- [ ] **Step 1: Install analytics package**

```bash
npm install @vercel/analytics
```

- [ ] **Step 2: Add Analytics to the root layout**

In `app/layout.tsx`, import `{ Analytics } from "@vercel/analytics/next"` and render `<Analytics />` once inside `<body>`, alongside `Nav`/`Footer`/`children`. Also set on the exported `metadata`:

```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://aivideofinder.com"),
  title: { default: "AI Video Tool Finder", template: "%s" },
  description: "Compare AI video generation and editing tools by use case.",
};
```

- [ ] **Step 3: Add sitemap and robots**

`app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { recommendationPages } from "@/data/recommendation-pages";
import { comparisonPages } from "@/data/comparison-pages";

const base = "https://aivideofinder.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/ai-video-tools", "/affiliate-disclosure"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const recommendationRoutes = recommendationPages.map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: new Date(),
  }));

  const comparisonRoutes = comparisonPages.map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...recommendationRoutes, ...comparisonRoutes];
}
```

`app/robots.ts`:

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://aivideofinder.com/sitemap.xml",
  };
}
```

- [ ] **Step 4: Build and verify**

Run: `npm test && npm run build`
Expected: all tests pass, build succeeds, `/sitemap.xml` and `/robots.txt` listed as routes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add SEO sitemap/robots and Vercel Web Analytics"
```

---

### Task 13: Deploy to Vercel (free Hobby tier)

**Files:**
- Create: `README.md` (deployment + affiliate-status update instructions)

**Interfaces:**
- None — this is an account/deployment action, not code. Requires the user's own GitHub and Vercel accounts (authentication is a user action per this session's safety rules, not something to automate).

- [ ] **Step 1: Push the repo to GitHub**

Confirm with the user which GitHub account/repo name to use (their `TomAlkalai` account, per git config), then:

```bash
git remote add origin https://github.com/TomAlkalai/<repo-name>.git
git push -u origin master
```

(Ask the user to create the empty GitHub repo first, or use `gh repo create` if the `gh` CLI is authenticated — confirm before creating anything on their account.)

- [ ] **Step 2: Connect the repo on Vercel (user action)**

Direct the user to vercel.com, sign in with GitHub, "Add New Project", import the repo, keep all defaults (Next.js is auto-detected), and deploy on the **free Hobby plan** — do not select a paid team/plan. This step requires the user's own login, so it isn't something to run on their behalf.

- [ ] **Step 3: Point the domain**

In the Vercel project's Settings → Domains, add `aivideofinder.com`. Vercel will show the DNS records (A/CNAME) to add at GoDaddy. Direct the user to add those records in their GoDaddy DNS panel — do not attempt to log into GoDaddy on their behalf.

- [ ] **Step 4: Write the README**

`README.md`:

```markdown
# AI Video Tool Finder

Affiliate comparison site for AI video generation/editing tools. See
`docs/superpowers/specs/2026-09-22-ai-video-finder-design.md` for the full
design spec.

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
this repo. Pushing to `master` triggers an automatic redeploy.
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add deployment README"
```

- [ ] **Step 6: Verify the live site**

Once the user confirms the Vercel deployment finished, open the deployed URL (Vercel's `*.vercel.app` URL, or `aivideofinder.com` once DNS propagates) and check: home page loads, one use-case page loads, one `/go/[slug]` link redirects to the correct official URL, and `/affiliate-disclosure` loads.

---

## Self-Review Notes

- **Spec coverage:** Tech stack (Task 1, 12, 13), product data model (Task 3), affiliate link handling incl. `/go/[slug]` and honesty mechanic (Task 4, README in Task 13), site structure — all 9 content routes plus disclosure (Tasks 7-11), design/UX baseline via Tailwind + spacing choices (all page tasks), shared components (Tasks 5-6, 9-10), open items (affiliate status flips) documented in README (Task 13). Recommendation-engine non-goal is not built anywhere in this plan, matching spec section 9.
- **Placeholder scan:** all data values, copy, and code are concrete; the one deliberately-deferred detail (exact affiliate URLs) is explicitly modeled as the `"pending"` state the spec requires, not a TODO.
- **Type consistency:** `Product`, `RecommendationPageConfig`, `ComparisonPageConfig` fields match across `data/*.ts`, `lib/*.ts`, and every component/page that consumes them.
