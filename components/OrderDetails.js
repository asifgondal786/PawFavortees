"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// DB row → display shape
function dbToView(o) {
  return {
    id: o.order_number,
    date: o.created_at,
    items: (o.order_items || []).map((i) => ({
      slug: i.product_slug, name: i.name, qty: i.qty,
      price: Number(i.price), emoji: i.emoji || "🐾", tint: i.tint || "from-sage-100 to-cream-100",
    })),
    subtotal: Number(o.subtotal), shipping: Number(o.shipping), tax: Number(o.tax),
    total: Number(o.total),
    name: o.name, email: o.email, address: o.address,
    shipMethod: o.ship_method, payMethod: o.pay_method, status: o.status,
  };
}

export default function OrderDetails() {
  const sp = useSearchParams();
  const orderNo = sp.get("order");
  const email = sp.get("email");
  const [order, setOrder] = useState(null);
  const [src, setSrc] = useState(null); // "db" | "local"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (orderNo && email) {
        try {
          const res = await fetch(`/api/orders?order=${encodeURIComponent(orderNo)}&email=${encodeURIComponent(email)}`);
          if (res.ok) {
            const d = await res.json();
            if (alive) { setOrder(dbToView(d.order)); setSrc("db"); setLoading(false); return; }
          }
        } catch {} // fallback below
      }
      // localStorage backup
      const orders = JSON.parse(localStorage.getItem("pawfav-orders") || "[]");
      const o = orders.find((x) => x.id === orderNo);
      if (alive) { setOrder(o ? { ...o, items: o.items, status: o.status } : null); setSrc(o ? "local" : null); setLoading(false); }
    })();
    return () => { alive = false; };
  }, [orderNo, email]);

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-sage-500">Loading order… 🐾</div>;
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🐕💩</p>
        <h1 className="text-2xl mb-2">Order not found</h1>
        <p className="text-charcoal-700 text-sm mb-6">Order details are not available on this device.</p>
        <Link href="/shop" className="inline-block bg-forest-600 text-white font-heading font-bold px-8 py-3 rounded-full hover:bg-forest-700 transition">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-6xl mb-4">🎉🐾</p>
        <h1 className="text-3xl">Order Confirmed!</h1>
        <p className="text-charcoal-700 text-sm mt-2">
          Thanks {order.name.split(" ")[0]} — your order is placed. Confirmation email &ldquo;{order.email}&rdquo; par jayegi.
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-sage-300/50 shadow-sm p-7 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-xs text-sage-500 uppercase tracking-wide font-semibold">Order Number</p>
            <p className="font-heading font-extrabold text-xl text-forest-700">#{order.id}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${src === "db" ? "bg-forest-100 text-forest-700" : "bg-cream-200 text-charcoal-700"}`}>
            {src === "db" ? "✓ Saved in database" : "✓ Saved (local demo)"}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-sage-500 uppercase tracking-wide font-semibold mb-1">Order Date</p>
            <p>{order.date ? new Date(order.date).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "—"}</p>
          </div>
          <div>
            <p className="text-xs text-sage-500 uppercase tracking-wide font-semibold mb-1">Shipping To</p>
            <p>{order.name}<br />{order.address}</p>
          </div>
        </div>

        <div className="border-t border-sage-300/40 pt-4">
          <p className="text-xs text-sage-500 uppercase tracking-wide font-semibold mb-3">Items</p>
          <div className="space-y-2">
            {order.items.map((i) => (
              <div key={i.slug} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${i.tint} flex items-center justify-center text-lg shrink-0`}>{i.emoji}</div>
                <p className="flex-1 text-sm font-semibold">{i.name} <span className="text-sage-500 font-normal">× {i.qty}</span></p>
                <span className="text-sm font-bold">${(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-sage-300/40 pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="text-sage-500">Subtotal</span><span>${Number(order.subtotal).toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-sage-500">Shipping ({order.shipMethod})</span><span>{Number(order.shipping) === 0 ? "FREE" : `$${Number(order.shipping).toFixed(2)}`}</span></div>
          <div className="flex justify-between"><span className="text-sage-500">Tax</span><span>${Number(order.tax).toFixed(2)}</span></div>
          <div className="flex justify-between font-heading font-extrabold text-lg pt-2 border-t border-sage-300/40">
            <span>Total Paid</span><span className="text-forest-700">${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
        <Link href="/track-order" className="bg-forest-600 text-white font-heading font-bold px-7 py-3 rounded-full hover:bg-forest-700 transition text-sm text-center">Track This Order</Link>
        <Link href="/account" className="border border-sage-300 text-charcoal-700 font-heading font-bold px-7 py-3 rounded-full hover:border-forest-500 transition text-sm text-center">View My Orders</Link>
      </div>
    </div>
  );
}
