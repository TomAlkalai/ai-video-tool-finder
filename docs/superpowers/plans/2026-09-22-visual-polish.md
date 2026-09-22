# Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the site look like a finished, credible SaaS/product site instead of an unstyled AI-generated template, with the comparison table specifically redesigned to be scannable at a glance.

**Architecture:** This is a styling-only pass — no data model, routing, or component-interface changes. Every task edits `className` strings and, where a visual indicator needs one, adds small presentational markup (icons). No task changes visible text content of any element a test asserts on, so the existing 34 tests must stay green throughout.

**Tech Stack:** Same as existing project — Tailwind CSS v4 (CSS-first `@theme` config), no new dependencies (icons are inline SVG, not a library).

**Root causes found during inspection** (why the site currently reads as "AI-generated/unfinished"):
1. `app/globals.css` still has the unmodified `create-next-app` dark-mode media query, which flips the page to a near-black background — but every component uses fixed Tailwind grays (`border-gray-200`, `bg-white`, `text-gray-600`) that assume a light background. The result: near-invisible hairline borders and cards that don't visually read as cards at all. This is the direct cause of the "thin pixel-like outlines" and "floating" complaints.
2. `body { font-family: Arial, Helvetica, sans-serif; }` in `globals.css` hard-overrides the Geist font that's loaded via `next/font` in `layout.tsx` — the custom font is loaded but never actually rendered, so typography defaults to generic Arial.
3. No real color system: gray shades, `indigo-600`, and `rounded-full`/`rounded-lg`/`rounded-md` are used inconsistently across components with no shared vocabulary.

## Global Constraints

- Do not change any visible text content, ARIA labels, hrefs, or element roles that the existing test suite asserts on (product names, pricing strings, "Visit {name}", "Compare N tools", "Select one more...", search input role, checkbox `aria-label`s). Verify with `npm test` after every task.
- No new npm dependencies — icons are hand-written inline SVG.
- Keep the visual language restrained: one accent color, a neutral palette, and (for the comparison table) green/amber/slate as the only semantic colors — not "colorful."
- Preserve all existing routes, data, and component props/interfaces.

---

## Design decisions (applied consistently in every task below)

- **Theme:** light-only. Remove the `prefers-color-scheme: dark` branch entirely rather than half-supporting it — every component is written assuming light mode, so a real dark mode is future work, not a one-line media query.
- **Font:** fix the Arial override so Geist actually renders.
- **Surfaces:** page background is a very light neutral (`bg-slate-50`); cards/panels are solid `bg-white` with a subtle `shadow-sm` and a light `border-slate-200` — the white-on-slate-50 contrast plus shadow is what makes a card read as "solid," not the border alone.
- **Radius:** standardize on `rounded-lg` for cards/inputs/buttons; category filter chips move from `rounded-full` pills to `rounded-md` rectangular toggles (less "bubble").
- **Color roles:** primary buttons (`AffiliateCta`, main compare CTA) become solid dark neutral (`bg-slate-900 hover:bg-slate-800 text-white`) instead of bright indigo — reads as a deliberate, premium SaaS choice rather than a default template color. A single accent (`blue-600`) is reserved for links and the active/selected filter state. Comparison semantics use `green-600`/`green-50` (positive), `amber-600`/`amber-50` (trade-off/warning), `slate-400` (neutral/absent) — nothing else.
- **Typography scale:** `h1` → `text-4xl sm:text-5xl font-bold tracking-tight text-slate-900`; section eyebrows → `text-xs font-semibold uppercase tracking-wide text-slate-500` (darker than the previous `text-gray-400`, which was too low-contrast to read as a real label); body copy → `text-slate-600`.
- **Comparison table:** sticky-looking header row (`bg-slate-50`, bottom border), alternating row tint (`even:bg-slate-50/60`) for scan-ability, a light vertical divider between product columns, a green check-circle for `freePlan: true` / a slate dash for `false`, a green check icon per pro bullet, an amber icon per con bullet.
- **Pricing note:** the plan deliberately does NOT add an auto-computed "cheapest" badge — `pricing` is a free-text display string (e.g. "Free plan; paid plans from ~$12/mo billed annually"), not a structured number, so regex-parsing a dollar figure out of it to auto-rank would be fragile and could misrepresent a price. The reliable, data-backed indicators are `freePlan` (boolean) and `pros`/`cons` (curated arrays) — those get the visual treatment instead.

---

## File Structure

```
components/
  icons.tsx              — NEW: CheckIcon, DashIcon, WarningIcon (inline SVG, no deps)
app/
  globals.css             — MODIFY: remove dark-mode branch, fix font override, define page/surface tokens
  layout.tsx               — MODIFY: apply font-sans + bg-surface-muted to body
components/
  Nav.tsx                  — MODIFY: solid header styling
  Footer.tsx                — MODIFY: spacing/color polish
  ProductCard.tsx          — MODIFY: solid card, spacing, button color
  ToolBrowser.tsx           — MODIFY: chip styling (rounded-md, not full), input styling, section spacing
  CompareBar.tsx            — MODIFY: solid surface, color polish
  ComparisonTable.tsx       — MODIFY: full visual redesign (header, striping, icons)
  AffiliateCta.tsx           — MODIFY: primary button color (slate-900)
  DisclosureNote.tsx        — MODIFY: minor color/spacing polish
  UseCaseGrid.tsx            — MODIFY: card styling to match ProductCard system
  RecommendationPage.tsx     — MODIFY: typography/spacing polish
  ComparisonPage.tsx         — MODIFY: typography/spacing polish
  QuizFlow.tsx               — MODIFY: card/button styling
app/page.tsx                 — MODIFY: hero spacing/typography
app/tools/[slug]/page.tsx     — MODIFY: typography/spacing polish
app/affiliate-disclosure/page.tsx — MODIFY: typography/spacing polish
app/compare/page.tsx           — MODIFY: minor spacing polish
```

---

### Task 1: Foundation — globals.css, layout font fix, icon primitives

- [ ] Rewrite `app/globals.css` to remove the dark-mode branch and the Arial override, and set `--background`/`--foreground` for a single light theme.
- [ ] Update `app/layout.tsx`: add `font-sans bg-slate-50 text-slate-900` to the `body` className (or equivalent via the CSS vars) so Geist actually renders and the page has its light neutral background everywhere, not just where a component happens to set `bg-white`.
- [ ] Create `components/icons.tsx` with `CheckIcon`, `DashIcon`, `WarningIcon` — small `currentColor` SVGs, sized via a `className` prop, no text content (so they never affect any element's accessible name).
- [ ] Run `npm test && npm run build` — must stay green (no component logic touched yet, just base styles).
- [ ] Commit: "Fix broken dark-mode/font styling; add base design tokens and icon primitives"

### Task 2: Nav, Footer, AffiliateCta, DisclosureNote

- [ ] `Nav.tsx`: solid `bg-white border-b border-slate-200`, tighten spacing, active/secondary link colors from the new palette.
- [ ] `Footer.tsx`: `bg-white border-t border-slate-200`, spacing polish.
- [ ] `AffiliateCta.tsx`: primary button becomes `bg-slate-900 hover:bg-slate-800 text-white rounded-lg` (same text/href logic, no prop or output-text change).
- [ ] `DisclosureNote.tsx`: `text-slate-500`, link in accent blue.
- [ ] Run `npm test && npm run build`.
- [ ] Commit: "Polish Nav, Footer, AffiliateCta, and DisclosureNote styling"

### Task 3: ProductCard, ToolBrowser, CompareBar

- [ ] `ProductCard.tsx`: solid white card, `shadow-sm`, `rounded-lg`, tighter internal spacing, consistent heading/body type scale.
- [ ] `ToolBrowser.tsx`: search input gets a real focus ring and consistent border color; category chips become `rounded-md` toggle buttons (selected = solid slate-900, unselected = white with slate-200 border) instead of `rounded-full` indigo pills; "Free plan only" toggle spacing polish.
- [ ] `CompareBar.tsx`: solid surface with a stronger shadow (`shadow-lg` is already there — keep, just align colors/spacing to the new system), primary action button matches the new primary button color.
- [ ] Run `npm test && npm run build`.
- [ ] Commit: "Polish ProductCard, ToolBrowser, and CompareBar styling"

### Task 4: ComparisonTable redesign (highest priority)

- [ ] Header row: `bg-slate-50`, `border-b border-slate-200`, product name links use the new type scale.
- [ ] Row striping: `even:bg-slate-50/60` on body rows for scan-ability.
- [ ] Column separation: light vertical divider (`border-l border-slate-100`) between product columns so the eye can track a column down the table.
- [ ] "Free plan" row: replace plain "Yes"/"No" text with an icon indicator — `CheckIcon` in a small green circle (`bg-green-50 text-green-600`) + "Yes" for true, `DashIcon` in a slate circle (`bg-slate-100 text-slate-400`) + "No" for false.
- [ ] "Pros" row: each bullet gets a small green `CheckIcon` instead of a plain disc marker (`flex items-start gap-2`, icon `text-green-600` shrink-0).
- [ ] "Cons" row: each bullet gets a small amber `WarningIcon` instead of a plain disc marker (`text-amber-600`).
- [ ] Keep pricing and "Best for" rows as plain text (per the pricing-parsing decision above) but apply the new type scale for readability.
- [ ] Update `components/ComparisonTable.test.tsx` only if a selector needs adjusting because of the icon markup — the existing three tests (name/pricing text, CTA links, name links) must still pass unmodified in intent; if the "Free plan" cell's text content changes shape, add a small test confirming the Yes/No text is still present for both truth values (extends coverage, doesn't reduce it).
- [ ] Run `npm test -- components/ComparisonTable.test.tsx`, then `npm test && npm run build`.
- [ ] Commit: "Redesign ComparisonTable with icon-based visual indicators for pros/cons/free-plan"

### Task 5: Page-level polish (hero, guides grid, recommendation/comparison templates, tool page, disclosure, quiz)

- [ ] `app/page.tsx`: hero spacing/type scale, `UseCaseGrid` card styling aligned to `ProductCard`'s new look.
- [ ] `UseCaseGrid.tsx`: solid white cards, `shadow-sm`, consistent hover state (border → accent, not full color fill).
- [ ] `RecommendationPage.tsx` / `ComparisonPage.tsx`: heading scale, section-eyebrow color (`text-slate-500` not `text-gray-400`), spacing rhythm.
- [ ] `app/tools/[slug]/page.tsx`: same type scale, spacing.
- [ ] `app/affiliate-disclosure/page.tsx`: same type scale, spacing.
- [ ] `app/compare/page.tsx`: minor spacing polish, consistent with `ComparisonPage.tsx`.
- [ ] `QuizFlow.tsx`: card styling matches the new system (`bg-white shadow-sm rounded-lg`), option buttons get a real hover/focus state instead of a bare border-color change.
- [ ] Run `npm test && npm run build`.
- [ ] Commit: "Apply visual polish across remaining pages and templates"

### Task 6: Verify in the browser

- [ ] Start the dev server; screenshot home, a recommendation page, `/compare` with 2 tools selected, a `/tools/[slug]` page, and `/find-my-tool`.
- [ ] Confirm: no near-invisible borders, no dark-mode flip, Geist font is actually rendering (check computed font-family via a quick page inspection if in doubt), category chips are rectangular not pill-shaped, comparison table free-plan/pros/cons rows show icons and are scannable at a glance.
- [ ] Run the full suite one final time (`npm test && npm run build`) and push.

---

## Self-Review Notes

- **Spec coverage:** every bullet in the user's request maps to a task — thin outlines/floating cards (Task 1 root-cause fix + Task 3 card styling), excessive rounding (Task 3 chips), spacing/typography/hierarchy (Tasks 2, 3, 5), consistent color system (Task 1 palette decisions applied throughout), solid/intentional cards (Task 1 + 3), no gradients/flashy effects (design decisions explicitly avoid them), comparison table visual indicators (Task 4, the most detailed task, matching "most important: comparison").
- **Placeholder scan:** no TBDs; the one explicit non-decision (no auto-computed "cheapest" badge) is a reasoned engineering call documented above, not a deferral.
- **Risk check:** the plan's Global Constraints section calls out the specific test assertions (product names, pricing text, CTA labels, ARIA labels) that must not change, and each task ends with `npm test` to catch a regression immediately rather than at the end.
