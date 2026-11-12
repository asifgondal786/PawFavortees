"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import WishlistButton from "@/components/WishlistButton";
import { useWishlist } from "@/lib/store";

export default function WishlistPage() {
  const slugs = useWishlist((s) => s.slugs);
  const clear = useWishlist((s) => s.clear);
  const [all, setAll] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setAll(d.products || []))
      .catch(() => {});
  }, []);

  const items = all.filter((p) => slugs.includes(p.slug));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl">Your Wishlist ❤️</h1>
          <p className="text-charcoal-700 text-sm mt-1">
            {items.length > 0 ? `${items.length} saved item${items.length !== 1 ? "s" : ""}` : "Save products you love — they stay here on this device."}
          </p>
        </div>
        {items.length > 0 && (
          <button onClick={clear} className="text-xs text-sage-500 hover:text-red-600 transition">Clear wishlist</button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-sage-300 p-12 text-center">
          <p className="text-5xl mb-4">🤍</p>
          <h2 className="font-heading font-bold text-xl">Nothing saved yet</h2>
          <p className="text-charcoal-700 mt-2 mb-6">Tap the heart on any product to save it for later.</p>
          <Link href="/shop" className="inline-block bg-forest-600 text-white font-heading font-bold px-8 py-3 rounded-full hover:bg-forest-700 transition">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((p) => (
            <div key={p.id} className="relative">
              <ProductCard p={p} />
              <div className="absolute top-3 right-3 z-10 md:hidden">
                <WishlistButton slug={p.slug} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
