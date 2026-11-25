# Project log — Wishlist site (ECD World rebuild)

Newest first. One entry per working session.

---

## 2026-11-25 — Mobile fixes: long product names, footer alignment, 320 px

- **Root cause of the cart overflow:** long product names ("Brown Stair (Brown Lacquer)",
  "Geometric Solids With Stand", "11 Colored Pencils…") kept their full min-content width,
  so the grid column forced the page 46 px wider than the viewport and pushed the delete
  button off-screen. Fixed by adding `min-w-0` to the grid/flex ancestors and switching
  cart/checkout names from `truncate` (nowrap) to `line-clamp-2` (wraps to two lines).
- **Header at 320 px** overflowed by 14 px. Wordmark, menu/search/wishlist/cart padding now
  scale down below `sm`, and `.wrap` drops to 1 rem side padding under 360 px.
- **Footer on mobile** is now centred (`text-center` → `md:text-left`), social pills centred,
  bottom trust bar wraps cleanly without mid-word breaks.
- **Removed test artifacts** that had been committed (`.audit-overflow.js`,
  `.repro-mobile.js`, `repro-cart.png`, `.playwright-mcp/`); added ignore rules for them.
- **Verified:** automated overflow audit across `/`, `/shop`, `/shop/sensorial`, long-name
  product pages, `/cart`, `/checkout`, `/wishlist`, `/about`, `/contact`, 404 at
  **320 / 360 / 375 / 390 px** — 0 px horizontal overflow on every combination.

---

## 2026-11-25 — Pushed to GitHub

- Remote: `https://github.com/MUIZ-UDDIN/ECD-World.git` (`origin`, branch `main`).
- Credential helper: Git Credential Manager (`manager`) configured locally; GCM 2.7.3.
- Initial commit `f950201` — 116 tracked files, ~0.9 MB (node_modules and `.next` ignored).
- Repo was empty; pushed with `git push -u origin main`.

---

## 2026-11-25 — Initial build: Next.js storefront replacing ecdworld.com

**Goal.** Client wants a code-based replacement for their WordPress/WooCommerce store,
with better UI/UX and full responsiveness.

**Decisions.**
- Stack: Next.js 16.4 / React 19.3 / TypeScript 5.9 / Tailwind 4.3 / Zustand 5.
  Chosen over plain React because the shop depends on organic search: SSG product pages,
  `next/image`, per-page metadata and JSON-LD.
- Ordering: cart + wishlist, checkout generates a WhatsApp order message. No payment
  gateway, no DB for v1 (client sells COD / bank transfer in PK).
- Data: pulled from the live WooCommerce Store API instead of scraping HTML.
- Visual: warm-wood Montessori palette (cream / forest / clay), Fraunces + Inter,
  typography-led because source images are only 420–490 px.

**Key finding.** Only 5 of 51 products have a price on the live site; 46 are ₨0. Built an
explicit "price on request" state and a quote path in the cart instead of rendering ₨0.

**Also found.** The Blocks/Toys collections are boxed retail sets ("Kids Home Toys"),
not workshop-made. Copy was corrected to distinguish workshop apparatus from curated
boxed sets, and product care sections switch by category.

**Files.**
- `scripts/fetch-catalog.mjs` → `src/data/catalog.json` + 66 WebP images in `public/products/`
- `src/lib/{catalog,cart,whatsapp,site,nav,utils}.ts`
- `src/store/use-store.ts` (persisted cart + wishlist)
- `src/components/*` (header, footer, search dialog, product card, gallery, purchase,
  cart/wishlist/checkout views, contact form)
- `src/app/*` (home, shop, category, product, cart, wishlist, checkout, about, contact,
  not-found, sitemap, robots)
- `README.md` documents setup + pre-launch TODOs.

**Verified.**
- `npm run build` → 65 routes.
- Browser: add priced + quote item, cart persistence after reload, checkout validation and
  submit → "Order ready to send".
- Responsive screenshots at 390 px and 1440 px across all main pages.

**Open / next.**
- Placeholder WhatsApp number and email in `src/lib/site.ts` — need real values.
- Higher-resolution product photography would lift the design substantially.
- Decide whether orders should be persisted beyond WhatsApp.
