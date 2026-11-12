# PawFavoritees — Architecture (local dev phase)

## Stack
- **Frontend**: Next.js 15 (App Router, JS), React 19, Tailwind CSS v4, Zustand (cart)
- **Commerce backend (planned)**: WordPress + WooCommerce (hosting par install hoga)
- **Data layer**: `lib/provider.js` — adapter pattern

## Provider pattern (important!)
`provider.listProducts()` / `provider.getProduct(slug)` abhi **MockProvider** use karta hai
(`lib/provider.js`). Jab WooCommerce hosting available hogi to `WooCommerceProvider` likha
jayega jo **same interface** se WooCommerce **Store API** (`/wp-json/store/v1/products`,
cart, checkout) ko call karega. Koi page/component change nahi hoga — sirf provider switch.

## WooCommerce integration plan (Phase 6)
- Customer-facing: WooCommerce **Store API** (no keys needed, session cart)
- Admin/integrations: WooCommerce **REST API** (keys server-side env only — NEVER client bundle)
- Checkout: gateway compatibility pehle prove karenge (WooPayments/Stripe/PayPal), phir `/checkout` wire karenge
- Payment webhooks: signature verification + order status reconciliation (no false success)

## Pages (live now)
- `/` homepage (hero, shop-by-pet, best sellers, promo, new arrivals, why-us, trending, reviews, newsletter)
- `/shop` — filters (category/price), sorting, search via `?q=`
- `/product/[slug]` — gallery placeholder, price/discount, specs, related, AddToCart
- `/cart` — Zustand persisted cart, free-shipping progress, summary
- `/checkout` — Phase 6 stub
- `/api/products` — provider-backed JSON API
- SEO: metadata, sitemap.xml, robots.txt, OG tags

## Run
- Dev: `npm run dev` → http://localhost:3000
- Build: `npm run build && npm start`
