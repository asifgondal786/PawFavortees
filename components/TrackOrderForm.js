"use client";
import Link from "next/link";
import { useState } from "react";

export default function TrackOrderForm() {
  const [form, setForm] = useState({ order: "", email: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!form.order.trim() || !form.email.trim()) {
      setError("Order number aur email dono zaroori hain.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?order=${encodeURIComponent(form.order.trim())}&email=${encodeURIComponent(form.email.trim())}`);
      if (res.ok) {
        const d = await res.json();
        setResult(d.order);
      } else if (res.status === 404) {
        setError("Is order number + email combination se koi order nahi mila. Details check karein.");
      } else {
        setError("Kuch ghalat ho gaya — thori dair baad try karein.");
      }
    } catch {
      setError("Network issue — thori dair baad try karein.");
    }
    setLoading(false);
  };

  const STATUS_PILL = {
    paid: "bg-forest-100 text-forest-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-blue-100 text-blue-700",
    completed: "bg-forest-100 text-forest-700",
    refunded: "bg-sand-300/60 text-charcoal-700",
    failed: "bg-red-100 text-red-700",
    pending: "bg-cream-200 text-charcoal-700",
    cancelled: "bg-red-100 text-red-700",
  };
  const STEPS = ["paid", "processing", "shipped", "completed"];
  const stepIdx = result ? STEPS.indexOf(result.status) : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl mb-2">Track Your Order 📦</h1>
      <p className="text-charcoal-700 text-sm mb-8">Order number aur email daal kar apni shipment ka live status dekhein.</p>

      <form onSubmit={onSubmit} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 rounded-2xl bg-white border border-sage-300/50 p-5 mb-8">
        <label className="block">
          <span className="text-xs font-semibold text-sage-500 uppercase tracking-wide">Order Number</span>
          <input value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} placeholder="PAW-XXXXXX"
            className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-sage-500 uppercase tracking-wide">Email</span>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com"
            className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
        </label>
        <button disabled={loading}
          className="self-end bg-forest-600 text-white font-heading font-bold px-6 py-2.5 rounded-full hover:bg-forest-700 transition text-sm disabled:opacity-60">
          {loading ? "…" : "Track"}
        </button>
      </form>

      {error && <p className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6">{error}</p>}

      {result && (
        <div className="rounded-3xl bg-white border border-sage-300/50 shadow-sm p-7 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-xs text-sage-500 uppercase tracking-wide font-semibold">Order</p>
              <p className="font-heading font-extrabold text-xl text-forest-700">#{result.order_number}</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_PILL[result.status] || "bg-cream-200"}`}>
              {result.status.toUpperCase()}
            </span>
          </div>

          {/* progress steps */}
          <div className="flex items-center">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i <= stepIdx ? "bg-forest-600 text-white" : "bg-cream-200 text-sage-500"}`}>
                    {i <= stepIdx ? "✓" : i + 1}
                  </span>
                  <span className="text-[10px] mt-1 capitalize font-semibold text-sage-500">{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-1 mx-1 rounded ${i < stepIdx ? "bg-forest-600" : "bg-cream-200"}`} />}
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-sage-500 uppercase tracking-wide font-semibold mb-1">Placed On</p>
              <p>{new Date(result.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
            </div>
            <div>
              <p className="text-xs text-sage-500 uppercase tracking-wide font-semibold mb-1">Shipping To</p>
              <p>{result.name}<br />{result.address}</p>
            </div>
          </div>

          <div className="border-t border-sage-300/40 pt-4 space-y-2">
            {(result.order_items || []).map((i) => (
              <div key={i.id} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${i.tint} flex items-center justify-center text-base shrink-0`}>{i.emoji}</div>
                <p className="flex-1 text-sm font-semibold">{i.name} <span className="text-sage-500 font-normal">× {i.qty}</span></p>
                <span className="text-sm font-bold">${(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-sage-300/40 pt-4 flex justify-between font-heading font-extrabold text-lg">
            <span>Total</span><span className="text-forest-700">${Number(result.total).toFixed(2)}</span>
          </div>
        </div>
      )}

      {!result && !error && (
        <div className="rounded-2xl border border-dashed border-sage-300 p-8 text-center">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-sm text-charcoal-700">Order number order confirmation email mein aur &ldquo;Order Received&rdquo; page par milta hai.</p>
          <Link href="/contact" className="inline-block mt-4 text-sm font-semibold text-forest-600 hover:underline">Order ka email nahi mila? Contact us →</Link>
        </div>
      )}
    </div>
  );
}
