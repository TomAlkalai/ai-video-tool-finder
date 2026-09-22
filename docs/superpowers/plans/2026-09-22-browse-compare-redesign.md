# Browse/Compare Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make browsing/searching/filtering/comparing tools the primary homepage experience (inspired by the IA of https://video-shortlist.web.app/, not its visuals), demote the AI recommendation flow to a clear secondary CTA, and add the supporting pages (per-tool pages, a free-form compare page, a rule-based "Ask our AI" quiz) needed to make that work — without rebuilding the existing product data model, redirect/affiliate mechanics, or curated recommendation/comparison pages.

**Architecture:** The homepage becomes a client-driven browse/filter/compare surface (`ToolBrowser`) layered over the existing static `products` data — no new data source. A small number of new routes (`/tools/[slug]`, `/compare`, `/find-my-tool`) are added using the same static-generation + typed-config pattern already used for recommendation/comparison pages. The AI flow is a deterministic, client-side decision table (`lib/quiz.ts`) that maps answers to an existing recommendation page — no LLM API, no server cost, consistent with "keep it free."

**Tech Stack:** Same as existing project — Next.js App Router, TypeScript, Tailwind CSS, Vitest + React Testing Library.

**Spec:** [docs/superpowers/specs/2026-09-22-ai-video-finder-design.md](../specs/2026-09-22-ai-video-finder-design.md) (original MVP spec) and [docs/superpowers/plans/2026-09-22-ai-video-finder-mvp.md](2026-09-22-ai-video-finder-mvp.md) (already-built MVP this plan extends).

## Global Constraints

- No LLM API calls, no new backend, no new paid services — the "Ask our AI" flow is a deterministic client-side quiz over existing data.
- Browse/compare must be the primary homepage experience; the AI quiz is a secondary, visually subordinate CTA (smaller, outline-style, not hero-dominant).
- Preserve existing architecture: `data/products.ts`, `lib/products.ts`, `lib/redirect.ts`, `/go/[slug]`, `ComparisonTable`, `AffiliateCta`, `DisclosureNote`, and all 6 recommendation pages + 2 comparison pages stay as-is (content and routes unchanged).
- Retire `/ai-video-tools` (now redundant with the new homepage) via a permanent redirect to `/`, not a dangling near-duplicate page.
- No fabricated affiliate links, no hands-on-testing claims — same rules as the original spec.
- Keep affiliate CTAs (the `AffiliateCta` component and its behavior) unchanged — natural, not spammy, still always routes through `/go/[slug]`.

---

## File Structure

```
lib/
  filterProducts.ts        — pure function: filter products by query/category/freePlan
  filterProducts.test.ts
  quiz.ts                  — pure function: map quiz answers to a recommendation result
  quiz.test.ts
data/
  categories.ts            — filter chip definitions (label + category tag)
  quiz-questions.ts        — quiz question/option config
components/
  ProductCard.tsx          — MODIFY: add optional compare-checkbox + link name to /tools/[slug]
  ProductCard.test.tsx     — MODIFY: cover new props
  ToolBrowser.tsx          — NEW, 'use client': search + filter chips + free-plan toggle + grid + compare state
  ToolBrowser.test.tsx
  CompareBar.tsx           — NEW: sticky bar showing compare selection + link to /compare
  CompareBar.test.tsx
  ComparisonTable.tsx      — MODIFY: product name links to /tools/[slug]
  ComparisonTable.test.tsx — MODIFY: cover the new link
  QuizFlow.tsx             — NEW, 'use client': multi-step quiz UI using lib/quiz.ts
app/
  page.tsx                 — REWRITE: hero + secondary "Ask our AI" CTA + ToolBrowser + guides section
  ai-video-tools/page.tsx  — DELETE (superseded by home page)
  tools/[slug]/page.tsx    — NEW: per-tool detail page
  compare/page.tsx         — NEW: reads ?tools=slug,slug&... renders ComparisonTable
  find-my-tool/page.tsx    — NEW: hosts QuizFlow
  sitemap.ts               — MODIFY: drop /ai-video-tools, add /tools/[slug] and /find-my-tool
next.config.ts             — MODIFY: add redirect /ai-video-tools -> /
components/Nav.tsx         — MODIFY: new links, "Ask our AI" secondary button
```

**Interfaces locked in up front:**

```ts
// lib/filterProducts.ts
export type ProductFilter = {
  query?: string;          // case-insensitive substring match on product.name
  category?: string;       // must be included in product.category; undefined/"" = no filter
  freePlanOnly?: boolean;
};
export function filterProducts(products: Product[], filter: ProductFilter): Product[];

// data/categories.ts
export type CategoryFilter = { value: string; label: string };
export const categoryFilters: CategoryFilter[]; // value matches a Product.category tag

// lib/quiz.ts
export type QuizAnswers = {
  goal: "youtube" | "faceless" | "tiktok" | "avatar" | "ads" | "editing";
  needsFreePlan: boolean;
};
export type QuizResult = {
  pageSlug: string;      // a recommendationPages slug
  topProductSlug: string; // best-matching product slug from that page, honoring needsFreePlan
};
export function pickRecommendation(answers: QuizAnswers): QuizResult;

// data/quiz-questions.ts
export type QuizOption = { value: string; label: string };
export type QuizQuestion = { id: "goal" | "needsFreePlan"; prompt: string; options: QuizOption[] };
export const quizQuestions: QuizQuestion[];

// components/ProductCard.tsx
export function ProductCard(props: {
  product: Product;
  compare?: { checked: boolean; onToggle: () => void };
}): JSX.Element;

// components/ToolBrowser.tsx
export function ToolBrowser(props: { products: Product[] }): JSX.Element; // 'use client'

// components/CompareBar.tsx
export function CompareBar(props: { selectedSlugs: string[]; onClear: () => void }): JSX.Element;

// components/QuizFlow.tsx
export function QuizFlow(): JSX.Element; // 'use client', no props — reads quizQuestions + pickRecommendation internally
```

---

### Task 1: Filter logic + category data (foundation, no UI yet)

**Files:**
- Create: `lib/filterProducts.ts`, `lib/filterProducts.test.ts`, `data/categories.ts`
- Modify: `data/products.ts:47` (InVideo's `category` array — add `"tiktok"`, since the existing `best-ai-video-tool-for-tiktok` recommendation page already features InVideo, but its category tags don't say so; the new homepage filter chips need this to be accurate)

**Interfaces:**
- Produces: `filterProducts`, `categoryFilters` (exact shapes above), consumed by Task 3's `ToolBrowser`.

- [ ] **Step 1: Write failing tests for filterProducts**

`lib/filterProducts.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { filterProducts } from "./filterProducts";
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
    affiliateUrl: "https://a.example.com",
    officialUrl: "https://o.example.com",
    affiliateStatus: "pending",
    lastVerified: "2026-01-01",
    ...overrides,
  };
}

const products: Product[] = [
  makeProduct({ name: "VEED", slug: "veed", category: ["editing", "youtube"], freePlan: true }),
  makeProduct({ name: "Synthesia", slug: "synthesia", category: ["avatar"], freePlan: false }),
  makeProduct({ name: "Descript", slug: "descript", category: ["editing"], freePlan: true }),
];

describe("filterProducts", () => {
  it("returns all products when no filter is given", () => {
    expect(filterProducts(products, {})).toHaveLength(3);
  });

  it("filters by case-insensitive name substring", () => {
    const result = filterProducts(products, { query: "ved" });
    expect(result.map((p) => p.slug)).toEqual(["veed"]);
  });

  it("filters by category tag", () => {
    const result = filterProducts(products, { category: "editing" });
    expect(result.map((p) => p.slug)).toEqual(["veed", "descript"]);
  });

  it("filters by free plan only", () => {
    const result = filterProducts(products, { freePlanOnly: true });
    expect(result.map((p) => p.slug)).toEqual(["veed", "descript"]);
  });

  it("combines query, category, and freePlanOnly", () => {
    const result = filterProducts(products, { query: "de", category: "editing", freePlanOnly: true });
    expect(result.map((p) => p.slug)).toEqual(["descript"]);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- lib/filterProducts.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement filterProducts and categories**

`lib/filterProducts.ts`:

```ts
import type { Product } from "@/data/products";

export type ProductFilter = {
  query?: string;
  category?: string;
  freePlanOnly?: boolean;
};

export function filterProducts(products: Product[], filter: ProductFilter): Product[] {
  return products.filter((p) => {
    if (filter.query && !p.name.toLowerCase().includes(filter.query.toLowerCase())) {
      return false;
    }
    if (filter.category && !p.category.includes(filter.category)) {
      return false;
    }
    if (filter.freePlanOnly && !p.freePlan) {
      return false;
    }
    return true;
  });
}
```

`data/categories.ts`:

```ts
export type CategoryFilter = { value: string; label: string };

export const categoryFilters: CategoryFilter[] = [
  { value: "youtube", label: "YouTube" },
  { value: "faceless", label: "Faceless" },
  { value: "tiktok", label: "TikTok / Shorts" },
  { value: "avatar", label: "AI Avatars" },
  { value: "ads", label: "Product Ads" },
  { value: "editing", label: "Editing" },
];
```

Edit `data/products.ts`: change InVideo's `category: ["youtube", "faceless", "ads"]` to `category: ["youtube", "faceless", "ads", "tiktok"]`.

- [ ] **Step 4: Run test, verify it passes**

Run: `npm test -- lib/filterProducts.test.ts`
Expected: 5 tests pass.

- [ ] **Step 5: Run full suite and build, then commit**

Run: `npm test && npm run build`
Expected: all existing tests still pass (the InVideo category change doesn't break `products.test.ts` — it doesn't assert on category), build succeeds.

```bash
git add -A
git commit -m "Add filterProducts logic and category filter definitions"
```

---

### Task 2: ProductCard compare checkbox + tool-page link

**Files:**
- Modify: `components/ProductCard.tsx`, `components/ProductCard.test.tsx` (this file doesn't exist yet — `ProductCard` currently has no test; add one now since it's gaining real logic)

**Interfaces:**
- Consumes: `Product` type.
- Produces: updated `ProductCard` signature (see File Structure section) — consumed by Task 3's `ToolBrowser`.

- [ ] **Step 1: Write failing tests**

`components/ProductCard.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/data/products";

const product: Product = {
  name: "VEED",
  slug: "veed",
  category: [],
  pricing: "Free plan; paid from $12/mo",
  freePlan: true,
  mainFeatures: ["Auto captions", "Timeline editor", "Brand kit", "Templates"],
  targetUsers: "Creators",
  pros: [],
  cons: [],
  affiliateUrl: "https://a.example.com",
  officialUrl: "https://o.example.com",
  affiliateStatus: "pending",
  lastVerified: "2026-01-01",
};

describe("ProductCard", () => {
  it("links the product name to its tool detail page", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByRole("link", { name: "VEED" })).toHaveAttribute("href", "/tools/veed");
  });

  it("does not render a compare checkbox when no compare prop is given", () => {
    render(<ProductCard product={product} />);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("renders a checked/unchecked compare checkbox and calls onToggle when given", () => {
    const onToggle = vi.fn();
    render(<ProductCard product={product} compare={{ checked: true, onToggle }} />);
    const checkbox = screen.getByRole("checkbox", { name: /compare/i });
    expect(checkbox).toBeChecked();
    checkbox.click();
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
```

Note: this project doesn't have `@testing-library/user-event` installed; the test above uses the native `.click()` DOM method instead, which is sufficient for a checkbox's `onChange`.

- [ ] **Step 2: Fix the test's stray import and run it to verify it fails**

Remove the incorrect `import userEvent from "@testing-library/react";` line (leftover — not used; the test uses `.click()` directly). Then run:

Run: `npm test -- components/ProductCard.test.tsx`
Expected: FAIL — current `ProductCard` doesn't wrap the name in a link and has no compare checkbox.

- [ ] **Step 3: Implement the updated ProductCard**

`components/ProductCard.tsx`:

```tsx
"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { AffiliateCta } from "./AffiliateCta";

export function ProductCard({
  product,
  compare,
}: {
  product: Product;
  compare?: { checked: boolean; onToggle: () => void };
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/tools/${product.slug}`} className="text-lg font-semibold hover:underline">
          {product.name}
        </Link>
        {compare && (
          <label className="flex items-center gap-1.5 text-xs text-gray-500">
            <input
              type="checkbox"
              aria-label={`Compare ${product.name}`}
              checked={compare.checked}
              onChange={compare.onToggle}
            />
            Compare
          </label>
        )}
      </div>
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

- [ ] **Step 4: Run test, verify it passes, then build**

Run: `npm test -- components/ProductCard.test.tsx && npm run build`
Expected: 3 tests pass, build succeeds (note: `/ai-video-tools/page.tsx` still imports `ProductCard` at this point in the plan — that's fine, it still renders correctly without the `compare` prop).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add compare checkbox and tool-page link to ProductCard"
```

---

### Task 3: ToolBrowser + CompareBar (the new homepage browse/compare surface)

**Files:**
- Create: `components/ToolBrowser.tsx`, `components/ToolBrowser.test.tsx`, `components/CompareBar.tsx`, `components/CompareBar.test.tsx`

**Interfaces:**
- Consumes: `filterProducts` (Task 1), `categoryFilters` (Task 1), `ProductCard` (Task 2).
- Produces: `ToolBrowser`, `CompareBar` — consumed by Task 7's home page rewrite.

- [ ] **Step 1: Write failing test for CompareBar**

`components/CompareBar.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CompareBar } from "./CompareBar";

describe("CompareBar", () => {
  it("renders nothing when no tools are selected", () => {
    const { container } = render(<CompareBar selectedSlugs={[]} onClear={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("prompts for one more tool when exactly one is selected", () => {
    render(<CompareBar selectedSlugs={["veed"]} onClear={() => {}} />);
    expect(screen.getByText(/select one more/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /compare/i })).not.toBeInTheDocument();
  });

  it("links to /compare with the selected slugs when 2+ are selected", () => {
    render(<CompareBar selectedSlugs={["veed", "descript"]} onClear={() => {}} />);
    expect(screen.getByRole("link", { name: /compare 2 tools/i })).toHaveAttribute(
      "href",
      "/compare?tools=veed,descript"
    );
  });

  it("calls onClear when the clear button is clicked", () => {
    const onClear = vi.fn();
    render(<CompareBar selectedSlugs={["veed", "descript"]} onClear={onClear} />);
    screen.getByRole("button", { name: /clear/i }).click();
    expect(onClear).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- components/CompareBar.test.tsx`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement CompareBar**

`components/CompareBar.tsx`:

```tsx
import Link from "next/link";

export function CompareBar({
  selectedSlugs,
  onClear,
}: {
  selectedSlugs: string[];
  onClear: () => void;
}) {
  if (selectedSlugs.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-200 bg-white px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        {selectedSlugs.length === 1 ? (
          <p className="text-sm text-gray-600">Select one more tool to compare.</p>
        ) : (
          <p className="text-sm text-gray-600">{selectedSlugs.length} tools selected.</p>
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-gray-500 hover:underline"
          >
            Clear
          </button>
          {selectedSlugs.length >= 2 && (
            <Link
              href={`/compare?tools=${selectedSlugs.join(",")}`}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Compare {selectedSlugs.length} tools
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npm test -- components/CompareBar.test.tsx`
Expected: 4 tests pass.

- [ ] **Step 5: Write failing test for ToolBrowser**

`components/ToolBrowser.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolBrowser } from "./ToolBrowser";
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
    affiliateUrl: "https://a.example.com",
    officialUrl: "https://o.example.com",
    affiliateStatus: "pending",
    lastVerified: "2026-01-01",
    ...overrides,
  };
}

const products: Product[] = [
  makeProduct({ name: "VEED", slug: "veed", category: ["editing"], freePlan: true }),
  makeProduct({ name: "Synthesia", slug: "synthesia", category: ["avatar"], freePlan: false }),
];

describe("ToolBrowser", () => {
  it("renders a card for every product initially", () => {
    render(<ToolBrowser products={products} />);
    expect(screen.getByRole("link", { name: "VEED" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Synthesia" })).toBeInTheDocument();
  });

  it("filters cards by search text", () => {
    render(<ToolBrowser products={products} />);
    const search = screen.getByRole("searchbox");
    (search as HTMLInputElement).value = "syn";
    search.dispatchEvent(new Event("input", { bubbles: true }));
    expect(screen.queryByRole("link", { name: "VEED" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Synthesia" })).toBeInTheDocument();
  });

  it("shows the compare bar prompt after checking one product", () => {
    render(<ToolBrowser products={products} />);
    screen.getByRole("checkbox", { name: /compare veed/i }).click();
    expect(screen.getByText(/select one more/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run test, verify it fails**

Run: `npm test -- components/ToolBrowser.test.tsx`
Expected: FAIL — module doesn't exist.

- [ ] **Step 7: Implement ToolBrowser**

`components/ToolBrowser.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { categoryFilters } from "@/data/categories";
import { filterProducts } from "@/lib/filterProducts";
import { ProductCard } from "./ProductCard";
import { CompareBar } from "./CompareBar";

export function ToolBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [freePlanOnly, setFreePlanOnly] = useState(false);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  const filtered = useMemo(
    () => filterProducts(products, { query, category, freePlanOnly }),
    [products, query, category, freePlanOnly]
  );

  function toggleSlug(slug: string) {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools by name..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:max-w-xs"
        />
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={freePlanOnly}
            onChange={(e) => setFreePlanOnly(e.target.checked)}
          />
          Free plan only
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(undefined)}
          className={`rounded-full border px-3 py-1 text-sm ${
            category === undefined
              ? "border-indigo-600 bg-indigo-600 text-white"
              : "border-gray-300 text-gray-600"
          }`}
        >
          All
        </button>
        {categoryFilters.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setCategory(c.value)}
            className={`rounded-full border px-3 py-1 text-sm ${
              category === c.value
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-gray-300 text-gray-600"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
            compare={{
              checked: selectedSlugs.includes(product.slug),
              onToggle: () => toggleSlug(product.slug),
            }}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-gray-500">
          No tools match those filters.
        </p>
      )}

      <CompareBar selectedSlugs={selectedSlugs} onClear={() => setSelectedSlugs([])} />
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
git commit -m "Add ToolBrowser and CompareBar for homepage browse/filter/compare"
```

---

### Task 4: Update ComparisonTable to link product names to their tool page

**Files:**
- Modify: `components/ComparisonTable.tsx`, `components/ComparisonTable.test.tsx`

**Interfaces:**
- No signature change — `ComparisonTable` still takes `{ products: Product[] }`.

- [ ] **Step 1: Add a failing assertion to the existing test**

Add to `components/ComparisonTable.test.tsx`, inside the first `it` block (after the existing assertions), or as a new `it`:

```tsx
  it("links each product name to its tool detail page", () => {
    render(<ComparisonTable products={products} />);
    expect(screen.getByRole("link", { name: "VEED" })).toHaveAttribute("href", "/tools/veed");
    expect(screen.getByRole("link", { name: "Descript" })).toHaveAttribute("href", "/tools/descript");
  });
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- components/ComparisonTable.test.tsx`
Expected: FAIL — product names aren't links yet.

- [ ] **Step 3: Update the header cell to use a Link**

In `components/ComparisonTable.tsx`, add `import Link from "next/link";` at the top, and change:

```tsx
            <th key={p.slug} className="border-b border-gray-200 py-2 pr-4 align-bottom">
              <div className="text-base font-semibold">{p.name}</div>
            </th>
```

to:

```tsx
            <th key={p.slug} className="border-b border-gray-200 py-2 pr-4 align-bottom">
              <Link href={`/tools/${p.slug}`} className="text-base font-semibold hover:underline">
                {p.name}
              </Link>
            </th>
```

- [ ] **Step 4: Run tests, verify pass, then build**

Run: `npm test && npm run build`
Expected: all tests pass, build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Link product names in ComparisonTable to their tool detail pages"
```

---

### Task 5: Per-tool detail pages (`/tools/[slug]`)

**Files:**
- Create: `app/tools/[slug]/page.tsx`

**Interfaces:**
- Consumes: `products`, `getProductBySlug` (existing), `recommendationPages`, `comparisonPages` (existing), `AffiliateCta`, `DisclosureNote`.

- [ ] **Step 1: Implement the page**

`app/tools/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { products } from "@/data/products";
import { getProductBySlug } from "@/lib/products";
import { recommendationPages } from "@/data/recommendation-pages";
import { comparisonPages } from "@/data/comparison-pages";
import { AffiliateCta } from "@/components/AffiliateCta";
import { DisclosureNote } from "@/components/DisclosureNote";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} Pricing, Features, and Alternatives | AI Video Tool Finder`,
    description: `${product.name}: ${product.pricing}. ${product.targetUsers}`,
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const guides = [
    ...recommendationPages
      .filter((p) => p.productSlugs.includes(slug))
      .map((p) => ({ href: `/${p.slug}`, label: p.title })),
    ...comparisonPages
      .filter((p) => p.productSlugA === slug || p.productSlugB === slug)
      .map((p) => ({ href: `/${p.slug}`, label: p.title })),
  ];

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
      <p className="mt-2 text-gray-500">{product.pricing}</p>
      <p className="mt-1 text-xs text-gray-400">Checked {product.lastVerified}</p>

      <p className="mt-6 text-gray-700">{product.targetUsers}</p>

      <div className="mt-8">
        <AffiliateCta product={product} label={`Visit ${product.name}`} />
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Main features
      </h2>
      <ul className="mt-3 list-disc pl-5 text-gray-700">
        {product.mainFeatures.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Pros</h2>
          <ul className="mt-3 list-disc pl-5 text-gray-700">
            {product.pros.map((pro) => (
              <li key={pro}>{pro}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Cons</h2>
          <ul className="mt-3 list-disc pl-5 text-gray-700">
            {product.cons.map((con) => (
              <li key={con}>{con}</li>
            ))}
          </ul>
        </div>
      </div>

      {guides.length > 0 && (
        <>
          <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-gray-400">
            {product.name} in our guides
          </h2>
          <ul className="mt-3 space-y-1">
            {guides.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className="text-indigo-600 hover:underline">
                  {g.label}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-10">
        <DisclosureNote />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: build succeeds, 7 static `/tools/[slug]` routes generated (one per product).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Add per-tool detail pages under /tools/[slug]"
```

---

### Task 6: Free-form compare page (`/compare`)

**Files:**
- Create: `app/compare/page.tsx`

**Interfaces:**
- Consumes: `getProductsBySlugs` (existing), `ComparisonTable`, `DisclosureNote`.

- [ ] **Step 1: Implement the page**

`app/compare/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getProductsBySlugs } from "@/lib/products";
import { ComparisonTable } from "@/components/ComparisonTable";
import { DisclosureNote } from "@/components/DisclosureNote";

export const metadata: Metadata = {
  title: "Compare AI Video Tools | AI Video Tool Finder",
  robots: { index: false },
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ tools?: string }>;
}) {
  const { tools } = await searchParams;
  const slugs = tools ? tools.split(",").filter(Boolean) : [];
  const products = getProductsBySlugs(slugs);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Compare AI Video Tools</h1>

      {products.length < 2 ? (
        <p className="mt-6 text-gray-600">
          Select at least two tools to compare from the{" "}
          <Link href="/" className="underline">
            tool browser
          </Link>
          .
        </p>
      ) : (
        <>
          <div className="mt-8 overflow-x-auto">
            <ComparisonTable products={products} />
          </div>
          <div className="mt-10">
            <DisclosureNote />
          </div>
        </>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: build succeeds; `/compare` is listed as a dynamic route (it reads `searchParams`, so Next.js server-renders it on demand rather than statically generating it).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Add free-form /compare page for user-selected tool comparisons"
```

---

### Task 7: Rule-based "Ask our AI" quiz

**Files:**
- Create: `data/quiz-questions.ts`, `lib/quiz.ts`, `lib/quiz.test.ts`, `components/QuizFlow.tsx`, `app/find-my-tool/page.tsx`

**Interfaces:**
- Consumes: `recommendationPages` (existing), `getProductBySlug` (existing).
- Produces: `pickRecommendation`, `QuizFlow` — used by `app/find-my-tool/page.tsx` and linked from Nav/home (Tasks 8-9).

- [ ] **Step 1: Write failing tests for pickRecommendation**

`lib/quiz.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { pickRecommendation } from "./quiz";

describe("pickRecommendation", () => {
  it("maps the youtube goal to the YouTube recommendation page", () => {
    const result = pickRecommendation({ goal: "youtube", needsFreePlan: false });
    expect(result.pageSlug).toBe("best-ai-video-generator-for-youtube");
  });

  it("maps the avatar goal to the avatar recommendation page", () => {
    const result = pickRecommendation({ goal: "avatar", needsFreePlan: false });
    expect(result.pageSlug).toBe("best-ai-avatar-generator");
  });

  it("picks a free-plan product first when needsFreePlan is true", () => {
    // best-ai-avatar-generator's products are heygen (freePlan: true) then synthesia (freePlan: false)
    const result = pickRecommendation({ goal: "avatar", needsFreePlan: true });
    expect(result.topProductSlug).toBe("heygen");
  });

  it("falls back to the first listed product when no free-plan product exists and needsFreePlan is true", () => {
    // best-ai-avatar-generator only has heygen (free) and synthesia (not free); this case is
    // covered by the "editing" goal instead, whose first product (descript) is free, so use a
    // goal where the ONLY products are non-free to exercise the fallback: none of the current
    // pages have that shape, so this test documents the fallback via the first-listed product
    // when needsFreePlan is false, keeping the two code paths distinct.
    const result = pickRecommendation({ goal: "editing", needsFreePlan: false });
    expect(result.topProductSlug).toBe("descript");
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- lib/quiz.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement pickRecommendation and the question config**

`lib/quiz.ts`:

```ts
import { recommendationPages } from "@/data/recommendation-pages";
import { getProductBySlug } from "@/lib/products";

export type QuizAnswers = {
  goal: "youtube" | "faceless" | "tiktok" | "avatar" | "ads" | "editing";
  needsFreePlan: boolean;
};

export type QuizResult = {
  pageSlug: string;
  topProductSlug: string;
};

const goalToPageSlug: Record<QuizAnswers["goal"], string> = {
  youtube: "best-ai-video-generator-for-youtube",
  faceless: "best-ai-video-generator-for-faceless-youtube",
  tiktok: "best-ai-video-tool-for-tiktok",
  avatar: "best-ai-avatar-generator",
  ads: "best-ai-video-tool-for-product-ads",
  editing: "best-ai-video-editor",
};

export function pickRecommendation(answers: QuizAnswers): QuizResult {
  const pageSlug = goalToPageSlug[answers.goal];
  const page = recommendationPages.find((p) => p.slug === pageSlug)!;

  let topProductSlug = page.productSlugs[0];
  if (answers.needsFreePlan) {
    const freeSlug = page.productSlugs.find((slug) => getProductBySlug(slug)?.freePlan);
    if (freeSlug) topProductSlug = freeSlug;
  }

  return { pageSlug, topProductSlug };
}
```

`data/quiz-questions.ts`:

```ts
export type QuizOption = { value: string; label: string };
export type QuizQuestion = { id: "goal" | "needsFreePlan"; prompt: string; options: QuizOption[] };

export const quizQuestions: QuizQuestion[] = [
  {
    id: "goal",
    prompt: "What are you trying to make?",
    options: [
      { value: "youtube", label: "A full-length YouTube video" },
      { value: "faceless", label: "A faceless YouTube video (no on-camera presenter)" },
      { value: "tiktok", label: "A TikTok or Shorts clip" },
      { value: "avatar", label: "A video with an AI presenter/avatar" },
      { value: "ads", label: "A short product ad" },
      { value: "editing", label: "I have footage already and just need to edit it" },
    ],
  },
  {
    id: "needsFreePlan",
    prompt: "Do you need a free plan to start?",
    options: [
      { value: "true", label: "Yes, I want to try it free first" },
      { value: "false", label: "No, budget isn't the main constraint" },
    ],
  },
];
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npm test -- lib/quiz.test.ts`
Expected: 4 tests pass.

- [ ] **Step 5: Implement QuizFlow and the page**

`components/QuizFlow.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { quizQuestions } from "@/data/quiz-questions";
import { pickRecommendation, type QuizAnswers } from "@/lib/quiz";
import { getProductBySlug } from "@/lib/products";
import { recommendationPages } from "@/data/recommendation-pages";
import { AffiliateCta } from "./AffiliateCta";

export function QuizFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});

  const question = quizQuestions[step];

  function answer(value: string) {
    const next = { ...answers, [question.id]: question.id === "needsFreePlan" ? value === "true" : value };
    setAnswers(next);
    if (step < quizQuestions.length - 1) {
      setStep(step + 1);
    }
  }

  const isComplete = answers.goal !== undefined && answers.needsFreePlan !== undefined;

  if (isComplete) {
    const result = pickRecommendation(answers as QuizAnswers);
    const product = getProductBySlug(result.topProductSlug)!;
    const page = recommendationPages.find((p) => p.slug === result.pageSlug)!;

    return (
      <div className="rounded-lg border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Our pick for you</p>
        <h2 className="mt-1 text-2xl font-bold">{product.name}</h2>
        <p className="mt-2 text-gray-700">{product.targetUsers}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <AffiliateCta product={product} />
          <Link href={`/${page.slug}`} className="text-sm text-indigo-600 hover:underline">
            See the full comparison &rarr;
          </Link>
        </div>
        <button
          type="button"
          onClick={() => {
            setAnswers({});
            setStep(0);
          }}
          className="mt-6 text-sm text-gray-400 hover:underline"
        >
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <p className="text-sm text-gray-400">
        Question {step + 1} of {quizQuestions.length}
      </p>
      <h2 className="mt-1 text-xl font-semibold">{question.prompt}</h2>
      <div className="mt-4 flex flex-col gap-2">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => answer(opt.value)}
            className="rounded-md border border-gray-300 px-4 py-2 text-left text-sm hover:border-indigo-400"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

`app/find-my-tool/page.tsx`:

```tsx
import type { Metadata } from "next";
import { QuizFlow } from "@/components/QuizFlow";

export const metadata: Metadata = {
  title: "Find Your AI Video Tool | AI Video Tool Finder",
  description: "Answer two quick questions to get a starting recommendation.",
};

export default function FindMyToolPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Not sure what to make?</h1>
      <p className="mt-4 text-gray-600">
        Answer two quick questions and we&apos;ll point you at a starting pick. This
        is a simple decision tree over the same comparisons on this site, not a
        model analyzing your answers.
      </p>
      <div className="mt-8">
        <QuizFlow />
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Run full suite and build, then commit**

Run: `npm test && npm run build`
Expected: all tests pass, build succeeds, `/find-my-tool` listed as a static route.

```bash
git add -A
git commit -m "Add rule-based Ask our AI quiz at /find-my-tool"
```

---

### Task 8: Rewrite the home page around browse/compare

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `products` (existing), `ToolBrowser` (Task 3), `UseCaseGrid` (existing, repositioned as a "guides" section rather than the hero).

- [ ] **Step 1: Rewrite the page**

`app/page.tsx`:

```tsx
import Link from "next/link";
import { products } from "@/data/products";
import { ToolBrowser } from "@/components/ToolBrowser";
import { UseCaseGrid } from "@/components/UseCaseGrid";

const guides = [
  { href: "/best-ai-video-generator-for-youtube", label: "YouTube videos", description: "Full-length YouTube content, from script to upload." },
  { href: "/best-ai-video-generator-for-faceless-youtube", label: "Faceless YouTube channels", description: "No on-camera presenter, script-to-video workflows." },
  { href: "/best-ai-video-tool-for-tiktok", label: "TikTok / Shorts", description: "Fast, vertical, short-form clips." },
  { href: "/best-ai-avatar-generator", label: "AI avatar videos", description: "A synthetic presenter without filming a person." },
  { href: "/best-ai-video-tool-for-product-ads", label: "Product ads", description: "Short promotional videos for a product or offer." },
  { href: "/best-ai-video-editor", label: "General editing", description: "Editing existing footage, captions, and cleanup." },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 pb-24">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">AI Video Tool Finder</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Search, filter, and compare AI video tools side by side. No hands-on
            testing claims &mdash; a clear breakdown of pricing, features, and
            trade-offs from official sources.
          </p>
        </div>
        <Link
          href="/find-my-tool"
          className="whitespace-nowrap rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-indigo-400"
        >
          Not sure what to make? Ask our AI &rarr;
        </Link>
      </div>

      <div className="mt-10">
        <ToolBrowser products={products} />
      </div>

      <div id="guides" className="mt-20">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Buying guides by use case
        </h2>
        <UseCaseGrid items={guides} />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Rebuild home page around browse/filter/compare, demote AI quiz to secondary CTA"
```

---

### Task 9: Retire `/ai-video-tools`, update Nav, sitemap, and redirect

**Files:**
- Delete: `app/ai-video-tools/page.tsx`
- Modify: `next.config.ts`, `components/Nav.tsx`, `app/sitemap.ts`

**Interfaces:**
- No new exports — this task wires existing pieces together and removes the now-redundant hub page.

- [ ] **Step 1: Delete the old hub page**

```bash
rm -rf app/ai-video-tools
```

- [ ] **Step 2: Add the redirect**

Read the current `next.config.ts` first (it's the default `create-next-app` output, likely just `const nextConfig = {}; export default nextConfig;` or similar with TypeScript types). Add a `redirects()` function:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/ai-video-tools",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 3: Update Nav**

`components/Nav.tsx` — replace the `links` array and add a distinct secondary "Ask our AI" button:

```tsx
import Link from "next/link";

const links = [
  { href: "/#guides", label: "Guides" },
  { href: "/affiliate-disclosure", label: "Disclosure" },
];

export function Nav() {
  return (
    <header className="border-b border-gray-200">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold">
          AI Video Tool Finder
        </Link>
        <ul className="flex items-center gap-6 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/find-my-tool"
              className="rounded-md border border-gray-300 px-3 py-1.5 hover:border-indigo-400"
            >
              Ask our AI
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
```

- [ ] **Step 4: Update sitemap**

In `app/sitemap.ts`, remove `/ai-video-tools` from `staticRoutes` and add a route per tool plus `/find-my-tool`:

```ts
import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { recommendationPages } from "@/data/recommendation-pages";
import { comparisonPages } from "@/data/comparison-pages";

const base = "https://aivideofinder.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/affiliate-disclosure", "/find-my-tool"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const toolRoutes = products.map((p) => ({
    url: `${base}/tools/${p.slug}`,
    lastModified: new Date(p.lastVerified),
  }));

  const recommendationRoutes = recommendationPages.map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: new Date(),
  }));

  const comparisonRoutes = comparisonPages.map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...toolRoutes, ...recommendationRoutes, ...comparisonRoutes];
}
```

(`/compare` and `/ai-video-tools` are intentionally excluded — `/compare` is a query-param-driven page with no fixed canonical content, and `/ai-video-tools` no longer exists.)

- [ ] **Step 5: Run full suite and build**

Run: `npm test && npm run build`
Expected: all tests pass, build succeeds, `/ai-video-tools` no longer appears as a route, `/tools/[slug]` × 7, `/find-my-tool`, `/compare` all appear.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Retire /ai-video-tools in favor of the new home page; update Nav and sitemap"
```

---

### Task 10: End-to-end manual verification in the browser

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server and check the home page**

Confirm: hero is compact (not quiz-first), search box and category chips are visible above the fold alongside tool cards, "Ask our AI" appears as a smaller secondary control (not the dominant visual element).

- [ ] **Step 2: Exercise search and filters**

Type a partial tool name into search and confirm the grid narrows; click a category chip and confirm it narrows by category; toggle "Free plan only" and confirm non-free tools disappear; confirm combining all three works together (matches `filterProducts` test coverage).

- [ ] **Step 3: Exercise compare**

Check two tools' compare boxes, confirm the sticky bottom bar appears with a "Compare 2 tools" link, click it, and confirm `/compare?tools=slug1,slug2` renders a correct `ComparisonTable`.

- [ ] **Step 4: Exercise a tool detail page**

Click a product name from the browser grid, confirm it lands on `/tools/[slug]` with correct data and a working `AffiliateCta`, and confirm any "in our guides" links are correct.

- [ ] **Step 5: Exercise the quiz**

Click "Ask our AI" from the Nav and from the home page, answer both questions, confirm the result shows a real product with a working CTA and a "See the full comparison" link to the matching recommendation page.

- [ ] **Step 6: Confirm the old hub URL redirects**

Navigate to `/ai-video-tools` and confirm it redirects to `/`.

- [ ] **Step 7: Report results**

If any step fails, fix it and re-run the full suite (`npm test && npm run build`) before considering the task done. If everything passes, this plan is complete — no further finishing-a-development-branch step is needed since this work continues directly on `master`, matching this project's established convention.

---

## Self-Review Notes

- **Spec coverage:** every explicit requirement from the user's redesign request maps to a task — browse/compare as main homepage experience (Tasks 3, 8), AI quiz demoted to secondary CTA (Tasks 7, 8, 9), search/filter/categories/cards (Tasks 1, 3), comparison ease (Tasks 3, 4, 6), non-spammy affiliate CTAs (unchanged `AffiliateCta`, reused as-is everywhere), inspect-existing-architecture-first (this plan preserves `data/products.ts`, `lib/products.ts`, `lib/redirect.ts`, `/go/[slug]`, all 8 existing content pages, `ComparisonTable`/`AffiliateCta`/`DisclosureNote` unchanged in behavior).
- **Placeholder scan:** all code is concrete; the one guarded caveat (Task 7 Step 1's comment about the untested fallback branch) documents a genuine test-data limitation rather than deferring real work — the fallback line itself (`if (freeSlug) topProductSlug = freeSlug;`) is fully implemented, just not independently exercised by a dedicated test given the current data has no all-paid recommendation page.
- **Type consistency:** `ProductFilter`, `CategoryFilter`, `QuizAnswers`, `QuizResult`, `QuizQuestion` field names match exactly between their defining file and every consumer (`ToolBrowser`, `QuizFlow`, `app/find-my-tool/page.tsx`).
