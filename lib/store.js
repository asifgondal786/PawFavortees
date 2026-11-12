"use client";
// Cart store — Zustand + localStorage persist.
// Phase 6+: WooCommerce Store API cart session se sync hoga (server-side cart).
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      add: (product, qty = 1) => {
        const items = [...get().items];
        const found = items.find((i) => i.slug === product.slug);
        if (found) {
          found.qty += qty;
        } else {
          items.push({
            slug: product.slug, name: product.name, price: product.price,
            emoji: product.emoji, tint: product.tint, qty,
          });
        }
        set({ items });
      },
      remove: (slug) => set({ items: get().items.filter((i) => i.slug !== slug) }),
      setQty: (slug, qty) => {
        const items = get().items.map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, qty) } : i));
        set({ items });
      },
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.price * i.qty, 0),
    }),
    { name: "pawfav-cart" }
  )
);

// Wishlist — persisted (heart icon har product card par)
export const useWishlist = create(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) => {
        const slugs = get().slugs.includes(slug)
          ? get().slugs.filter((s) => s !== slug)
          : [...get().slugs, slug];
        set({ slugs });
      },
      remove: (slug) => set({ slugs: get().slugs.filter((s) => s !== slug) }),
      clear: () => set({ slugs: [] }),
      has: (slug) => get().slugs.includes(slug),
    }),
    { name: "pawfav-wishlist" }
  )
);
