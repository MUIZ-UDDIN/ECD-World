# ECD World — storefront rebuild

A ground-up rebuild of [ecdworld.com](https://ecdworld.com) — a Pakistan-based maker of
Montessori / early-childhood materials. The live site is a WooCommerce theme; this is a
code-based storefront with a warmer, editorial design built around the actual catalogue.

## Stack

| Layer      | Choice                                            |
| ---------- | ------------------------------------------------- |
| Framework  | **Next.js 16.4** (App Router, Turbopack)          |
| UI         | **React 19.3** + **TypeScript 5.9** (strict)      |
| Styling    | **Tailwind CSS 4.3** — CSS-first `@theme` tokens  |
| State      | **Zustand 5** + `persist` (localStorage)          |
| Icons      | lucide-react                                      |
| Images     | `next/image`, local WebP assets                   |
| Fonts      | Fraunces (display) + Inter (text) via `next/font` |

No backend, no database, no auth. Cart and wishlist live in the browser; orders are sent
to the workshop over WhatsApp.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (statically renders 65 routes)
npm start
```

## Catalogue data

```bash
npm run fetch:catalog
```

The script in `scripts/fetch-catalog.mjs`:

1. Pulls all products from the public WooCommerce Store API
   (`https://ecdworld.com/wp-json/wc/store/v1/products`).
2. Decodes HTML entities and converts WordPress HTML into clean paragraphs.
3. Normalises prices — **only 5 of 51 products have a price on the live site**, so the
   rest are stored as `price: null` and rendered as *Price on request* rather than `₨ 0`.
4. Downloads each product image, resizes to max 1400 px and re-encodes to WebP in
   `public/products/` (66 files, ~0.6 MB total).
5. Writes `src/data/catalog.json`.

Re-running it is safe — it replaces `public/products` and the JSON wholesale.

## Ordering model

Two paths, deliberately:

- **Priced pieces** (blocks/toys, ready to ship) → normal cart → checkout.
- **Made-to-order pieces** (46 workshop items) → added to the same cart and flagged
  *price on request*; the order message asks for a quote.

Checkout validates name / phone / city / address, then builds a formatted WhatsApp
message containing line items, subtotal, the count of quote items, delivery details and
payment preference. There is **no payment gateway and no order record** — the order exists
in the WhatsApp thread. That is intentional for v1 and matches how this kind of retailer
actually sells.

## Before launch

Everything brand/contact related is in **`src/lib/site.ts`**:

- `whatsapp` / `whatsappDisplay` — currently a placeholder `+92 300 000 0000`
- `email` — placeholder `hello@ecdworld.com`
- `address`, `hours`
- `socials` — Instagram and most social links on the live site are placeholders too

Also replace:

- `metadataBase` in `src/app/layout.tsx` if the production domain differs.
- The **Store / Product JSON-LD** uses `https://ecdworld.com`.

## Structure

```
src/
  app/
    layout.tsx              fonts, metadata, header/footer, Store JSON-LD
    page.tsx                home: hero collage, collections, featured, editorial band
    shop/page.tsx           full catalogue + quick index
    shop/[category]/        collection pages (SSG)
    product/[slug]/         product detail (SSG, 51 pages)
    cart/ wishlist/ checkout/
    about/ contact/
    sitemap.ts robots.ts not-found.tsx
    globals.css             Tailwind theme tokens, base styles
  components/               header, footer, cards, gallery, cart/checkout/wishlist views
  lib/
    catalog.ts              typed catalogue access + price helpers
    cart.ts                 line resolution and totals
    whatsapp.ts             message builders + wa.me links
    site.ts                 brand, contact, category copy  ← edit this first
    nav.ts                  navigation model
  store/use-store.ts        Zustand cart + wishlist (persisted)
  data/catalog.json         generated — do not edit by hand
```

## Design notes

- **Warm-wood palette**: cream `#fbf8f3`, deep forest `#1b3a2c`, fired clay `#a9532f`.
- **Typography-led layout** because the source imagery is 420–490 px. Product shots are
  framed small inside generous whitespace rather than blown up full-bleed.
- **Fully responsive** from 320 px up: 2-column product grid on phones, 3 at md, 4 at xl;
  condensed toolbar with filters/sort on their own row on mobile; full-screen forest-green
  mobile menu.
- **Accessibility**: skip link, labelled form fields with inline errors, `aria-pressed` on
  wishlist toggles, focus-visible rings, keyboard-operable search dialog (`⌘K` / `Ctrl+K`),
  reduced-motion support.

## Accuracy warning (important)

The **Blocks** and **Toys** collections are boxed retail sets (`Kids Home Toys`), not
workshop-made pieces. The copy distinguishes "workshop-made apparatus" from a "small,
carefully chosen set of blocks and toys", and product care details switch by category.
Do not reintroduce blanket "100% solid wood / all handcrafted" claims — they would be
false for those four products.

## Verified

- `npm run build` — 65 routes, all static except `/shop` (reads `?q=`).
- Cart: add priced item, add quote item, quantity stepper, persistence across reload.
- Checkout: validation blocks empty submits; valid submit produces the confirmation state
  and opens `wa.me`.
- Wishlist: toggle, move-to-cart, empty state.
- Responsive checks at 390 px and 1440 px for home, shop, product, cart, checkout, about,
  contact, 404.

## Possible next steps

1. Real contact details + higher-resolution photography (biggest visual win).
2. Persist orders somewhere (email, Google Sheet, or a small DB) so nothing depends on the
   customer actually pressing send in WhatsApp.
3. Payment gateway (JazzCash / EasyPaisa / Stripe) if they want prepaid orders.
4. Analytics + consent banner.
5. A tiny CMS (Sanity/Payload) so the client can add products without a developer.
