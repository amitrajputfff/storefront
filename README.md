# ZEEVARA — Storefront

A premium, headless-Shopify-ready ecommerce storefront for ZEEVARA ("Discover more everyday"), built with Next.js App Router. Every product, review, and collection is currently mock data — the app is structured so swapping in the real Shopify Storefront API is a data-layer-only change (see [Connecting to Shopify](#connecting-to-shopify)).

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4 (CSS-first config, no `tailwind.config.ts`)
- shadcn/ui (Base UI variant, "Nova" preset)
- Aceternity UI / Magic UI components pulled in via the shadcn registry (`bento-grid`, `animated-testimonials`, `marquee`, `number-ticker`, `sticky-banner`) and Tailark blocks (`faqs`, `call-to-action`) for the sections they naturally fit, restyled to the brand's black/white/neutral palette
- `motion` (Framer Motion's current package), `zustand` (cart/wishlist/recently-viewed/UI state), `next-themes` (dark mode), `react-hook-form` + `zod` (forms), `sonner` (toasts), `embla-carousel-react`

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build (also runs generateStaticParams for all products/collections)
npm run start   # serve the production build
npm run lint
```

## Project Structure

```
src/
  app/                 routes (App Router)
  components/
    ui/                shadcn/Aceternity/Magic UI primitives
    layout/             header, mega menu, mobile nav, footer
    home/                homepage sections
    product/             product card, gallery, buy box, reviews, quick view
    cart/                cart drawer + line items
    collection/          filters, sort, search
    shared/              motion primitives, price display, empty states
  stores/              zustand stores (cart, wishlist, recently-viewed, ui)
  mock/                mock catalog, collections, reviews, nav — the "backend"
  types/               Product/Variant/Collection/Cart/etc, shaped to map onto
                       Shopify Storefront API types
  lib/                 utils, formatting, JSON-LD builders, Shopify adapter notes
```

## Mock Data

`src/mock/products/index.ts` is the **only** import surface pages/components should use for product data (`getAllProducts`, `getProductByHandle`, `getProductsByCategory`, `getRelatedProducts`, `searchProducts`). Category-specific files (`mock/products/home-decor.ts`, etc.) are internal — never import them directly from a component. This is what makes the eventual Shopify swap contained to one file.

Product photography is sourced from curated, content-checked `images.unsplash.com` URLs (`mock/images.ts`) — stable direct CDN links, not the deprecated `source.unsplash.com` random-redirect service. These should be replaced with real product photography or Shopify CDN URLs before a real launch.

## Logo Assets

The header/footer currently render a coded text lockup (serif "ZEEVARA" + divider + tracked-out tagline) since no exported logo files exist yet. Once available, drop them into:

```
public/logo/
  zeevara-mark.svg       (icon-only Z monogram)
  zeevara-lockup.svg     (Z + wordmark + tagline)
```

and swap the coded lockup in `components/layout/site-header.tsx` (and the footer) for an `next/image` reference — flagged with a comment at that spot in the code.

## Connecting to Shopify

Nothing here talks to a real backend yet — cart, wishlist, reviews, and checkout are all mocked (see `lib/shopify-adapter.ts` for the intended mapping notes). To wire in the real Storefront API:

1. Replace the accessor functions in `mock/products/index.ts` and `mock/collections.ts` with GraphQL calls returning the same `Product`/`Collection` shapes.
2. Swap the cart drawer's mock "Checkout" confirmation for a real `checkoutCreate`/redirect flow.
3. Keep everything else — components only ever consume the typed `Product`/`Cart`/`Collection` shapes, not the mock internals.

## Known Limitations (by design, for this mock phase)

- No real authentication — the header's account icon is visual only.
- Checkout is a styled confirmation state, not a real payment flow.
- Reviews are procedurally generated from a small template pool (`mock/reviews.ts`), not user-submitted.
- Unsplash-hotlinked images are fine for development but should be self-hosted or replaced with Shopify CDN assets before a real production launch.
