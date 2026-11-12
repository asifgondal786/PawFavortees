"use client";
import Link from "next/link";
import { useCart, useWishlist } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import SearchBox from "@/components/SearchBox";

const NAV = [
  { href: "/shop?category=dogs", label: "Dogs", emoji: "🐶" },
  { href: "/shop?category=cats", label: "Cats", emoji: "🐱" },
  { href: "/shop?sort=rating", label: "Deals", emoji: "🏷️" },
];

export default function Header() {
  const items = useCart((s) => s.items);
  const count = items.reduce((n, i) => n + i.qty, 0);
  const wishCount = useWishlist((s) => s.slugs.length);
  const user = useAuth((s) => s.user);

  return (
    <header className="sticky top-0 z-50">
      {/* announcement bar */}
      <div className="bg-forest-700 text-cream-100 text-center text-xs sm:text-sm py-2 px-3">
        🚚 FREE SHIPPING on qualifying orders · Love Them. Spoil Them. 🐾
      </div>

      <div className="bg-cream-50/95 backdrop-blur border-b border-sage-300/60">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🐾</span>
            <span className="font-heading font-extrabold text-xl text-forest-700 tracking-tight">
              Paw<span className="text-sand-500">Favoritees</span>
            </span>
          </Link>

          <div className="hidden md:block flex-1 max-w-md mx-auto">
            <SearchBox />
          </div>

          <nav className="hidden lg:flex items-center gap-4 ml-auto">
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} className="text-sm font-semibold text-charcoal-700 hover:text-forest-600 transition">
                {n.emoji} {n.label}
              </Link>
            ))}
          </nav>

          <Link href={user ? "/account" : "/login"} className="ml-auto lg:ml-0 hidden sm:flex items-center gap-2 rounded-full border border-sage-300 text-charcoal-700 px-3.5 py-2 text-sm font-semibold hover:border-forest-500 transition">
            👤 {user ? user.firstName : "Login"}
          </Link>
          <Link href="/wishlist" className="relative flex items-center gap-2 rounded-full border border-sage-300 text-charcoal-700 px-3.5 py-2 text-sm font-semibold hover:border-forest-500 transition">
            {wishCount > 0 ? "❤️" : "🤍"} Wishlist
            {wishCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-forest-600 text-cream-50 text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {wishCount}
              </span>
            )}
          </Link>
          <Link href="/cart" className="ml-auto sm:ml-0 relative flex items-center gap-2 rounded-full bg-forest-600 text-white px-4 py-2 text-sm font-semibold hover:bg-forest-700 transition">
            🛒 Cart
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-sand-500 text-charcoal-900 text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>

        {/* mobile nav */}
        <div className="lg:hidden flex gap-4 overflow-x-auto px-4 pb-2 text-sm font-semibold text-charcoal-700">
          {NAV.map((n) => (
            <Link key={n.label} href={n.href} className="whitespace-nowrap hover:text-forest-600">
              {n.emoji} {n.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
