"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";

// DB row (orders + order_items) → display shape (OrderDetails/TrackOrder jaisa hi)
function dbToView(o) {
  return {
    id: o.order_number,
    date: o.created_at,
    items: o.order_items || [],
    itemCount: (o.order_items || []).reduce((n, i) => n + (i.qty || 1), 0),
    total: Number(o.total),
    status: o.status || "paid",
    source: "db",
  };
}

// localStorage backup order → display shape
function localToView(o) {
  return {
    id: o.id,
    date: o.date,
    itemCount: (o.items || []).length,
    total: Number(o.total),
    status: o.status || "paid-demo",
    source: "local",
  };
}

const STATUS_PILL = {
  paid: "bg-forest-100 text-forest-700",
  "paid-demo": "bg-forest-100 text-forest-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-blue-100 text-blue-700",
  completed: "bg-forest-100 text-forest-700",
  refunded: "bg-sand-300/60 text-charcoal-700",
  failed: "bg-red-100 text-red-700",
  pending: "bg-cream-200 text-charcoal-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AccountPage() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const [orders, setOrders] = useState(null); // null = loading
  const [source, setSource] = useState(null); // "db" | "local"

  useEffect(() => {
    if (!user?.email) return;
    let alive = true;
    (async () => {
      // 1) Server (Supabase) se history
      try {
        const res = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const d = await res.json();
          if (alive && (d.orders || []).length) {
            setOrders(d.orders.map(dbToView));
            setSource("db");
            return;
          }
        }
      } catch {}
      // 2) localStorage backup (offline/demo orders)
      let local = [];
      try { local = JSON.parse(localStorage.getItem("pawfav-orders") || "[]"); } catch {}
      if (alive) {
        setOrders(local.map(localToView).sort((a, b) => new Date(b.date) - new Date(a.date)));
        setSource(local.length ? "local" : "db");
      }
    })();
    return () => { alive = false; };
  }, [user?.email]);

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
          <p className="text-xs text-charcoal-700 mt-1">
            {orders === null ? "…" : `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`}
          </p>
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
      {orders === null ? (
        <div className="rounded-2xl bg-white border border-sage-300/50 p-10 text-center text-sage-500 text-sm">Loading orders… 🐾</div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sage-300 p-10 text-center">
          <p className="text-4xl mb-3">🛒</p>
          <p className="text-sm text-charcoal-700">No orders yet — your pet is waiting! 😺</p>
          <Link href="/shop" className="inline-block mt-4 bg-forest-600 text-white text-sm font-heading font-bold px-6 py-2.5 rounded-full hover:bg-forest-700 transition">Start Shopping</Link>
        </div>
      ) : (
        <>
          {source === "db" && (
            <p className="text-xs text-forest-600 font-semibold mb-3">✓ Live from database — har device par available</p>
          )}
          {source === "local" && (
            <p className="text-xs text-sage-500 mb-3">Is device ke local orders dikh rahe hain (database se koi match nahi hua).</p>
          )}
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="rounded-2xl bg-white border border-sage-300/50 p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-heading font-bold text-sm">#{o.id}</p>
                  <p className="text-xs text-sage-500">
                    {new Date(o.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {o.itemCount} item{o.itemCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-heading font-extrabold text-forest-700">${Number(o.total).toFixed(2)}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_PILL[o.status] || "bg-cream-200 text-charcoal-700"}`}>
                    {String(o.status).toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/track-order" className="text-xs font-semibold text-forest-600 hover:underline">Order details dekhni hain? Track order karo →</Link>
          </div>
        </>
      )}
    </div>
  );
}
