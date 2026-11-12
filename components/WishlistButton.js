"use client";
import { useWishlist } from "@/lib/store";

export default function WishlistButton({ slug, className = "" }) {
  const slugs = useWishlist((s) => s.slugs);
  const toggle = useWishlist((s) => s.toggle);
  const active = slugs.includes(slug);

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Link ke andar ho to navigation na ho
        e.stopPropagation();
        toggle(slug);
      }}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`w-9 h-9 rounded-full bg-white/95 shadow-sm border border-sage-300/50 flex items-center justify-center text-base hover:scale-110 active:scale-95 transition ${className}`}
    >
      {active ? "❤️" : "🤍"}
    </button>
  );
}
