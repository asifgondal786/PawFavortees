"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function AccountPage() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const orders = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("pawfav-orders") || "[]") : [];

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">👤</p>
        <h1 className="text-2xl">You&apos;re not signed in</h1>
        <p className="text-charcoal-700 text-sm mt-2 mb-6">Sign in to view your account and order history.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="bg-forest-600 text-white font-heading font-bold px-7 py-3 rounded-full hover:bg-forest-700 transition text-sm">Sign In</Link>
          <Link href="/register" className="border border-sage-300 text-charcoal-700 font-heading font-bold px-7 py-3 rounded-full hover:border-forest-500 transition text-sm">Create Account</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl">Hi, {user.firstName} 👋</h1>
          <p className="text-charcoal-700 text-sm mt-1">{user.email}</p>
        </div>
        <button onClick={logout} className="border border-sage-300 text-charcoal-700 text-sm font-semibold px-5 py-2.5 rounded-full hover:border-red-400 hover:text-red-600 transition">
          Log out
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="rounded-2xl bg-white border border-sage-300/50 p-5">
          <div className="text-2xl mb-2">📦</div>
          <h3 className="font-heading font-bold text-sm">Orders</h3>
          <p className="text-xs text-charcoal-700 mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
        </div>
        <div className="rounded-2xl bg-white border border-sage-300/50 p-5">
          <div className="text-2xl mb-2">🤍</div>
          <h3 className="font-heading font-bold text-sm">Wishlist</h3>
          <Link href="/wishlist" className="text-xs text-forest-600 font-semibold hover:underline mt-1 inline-block">View saved items →</Link>
        </div>
        <div className="rounded-2xl bg-white border border-sage-300/50 p-5">
          <div className="text-2xl mb-2">⚙️</div>
          <h3 className="font-heading font-bold text-sm">Account Details</h3>
          <p className="text-xs text-charcoal-700 mt-1">Phase 7 mein editable honge</p>
        </div>
      </div>

      <h2 className="text-xl mb-4">Order History</h2>
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sage-300 p-10 text-center">
          <p className="text-4xl mb-3">🛒</p>
          <p className="text-sm text-charcoal-700">No orders yet — your pet is waiting! 😺</p>
          <Link href="/shop" className="inline-block mt-4 bg-forest-600 text-white text-sm font-heading font-bold px-6 py-2.5 rounded-full hover:bg-forest-700 transition">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.slice().reverse().map((o) => (
            <div key={o.id} className="rounded-2xl bg-white border border-sage-300/50 p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-heading font-bold text-sm">#{o.id}</p>
                <p className="text-xs text-sage-500">{new Date(o.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {o.items.length} item{o.items.length !== 1 ? "s" : ""}</p>
              </div>
              <div className="text-right">
                <p className="font-heading font-extrabold text-forest-700">${o.total.toFixed(2)}</p>
                <p className="text-xs text-forest-600 font-semibold">✓ Paid (demo)</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
