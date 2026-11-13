"use client";
// Create/Edit product modal — POST/PATCH /api/admin/products, phir router.refresh()
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [["dogs", "🐶 Dogs"], ["cats", "🐱 Cats"]];
const TINTS = [
  ["from-forest-100 to-sage-100", "Green / Sage"],
  ["from-sand-300 to-cream-200", "Sand / Cream"],
  ["from-cream-100 to-sand-300", "Cream / Sand"],
  ["from-forest-500 to-forest-700", "Forest"],
  ["from-sage-100 to-cream-100", "Sage / Cream"],
  ["from-cream-200 to-sand-300", "Cream200 / Sand"],
  ["from-cream-100 to-sage-100", "Cream / Sage"],
  ["from-forest-100 to-cream-200", "Forest / Cream"],
];
const SUBCATS = {
  dogs: ["Dog Beds", "Dog Toys", "Collars & Leashes", "Feeding", "Grooming", "Dog Food", "Training"],
  cats: ["Scratching Posts", "Cat Toys", "Cat Food", "Cat Litter", "Grooming", "Beds & Furniture"],
};

export default function ProductModal({ product = null, onClose }) {
  const router = useRouter();
  const editing = Boolean(product);
  const [form, setForm] = useState({
    name: product?.name || "",
    category: product?.category || "dogs",
    subcategory: product?.subcategory || SUBCATS.dogs[0],
    brand: product?.brand || "PawFav Essentials",
    price: product?.price ?? "",
    compareAt: product?.compareAt ?? "",
    rating: product?.rating ?? 4.5,
    reviews: product?.reviews ?? 0,
    badge: product?.badge || "",
    emoji: product?.emoji || "🐾",
    tint: product?.tint || TINTS[0][0],
    stock: product?.stock ?? 25,
    shortDesc: product?.shortDesc || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const method = editing ? "PATCH" : "POST";
      const body = editing ? { ...form, slug: product.slug } : form;
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Save failed");
      onClose();
      router.refresh();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto" onClick={onClose}>
      <div className="rounded-3xl bg-white w-full max-w-2xl p-7 my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-heading font-extrabold">{editing ? `Edit — ${product.name}` : "+ New Product"}</h2>
          <button onClick={onClose} className="text-sage-500 hover:text-red-500 text-xl leading-none">✕</button>
        </div>

        {error && <p className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 mb-4">{error}</p>}

        <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-sage-500 uppercase">Name *</span>
            <input required value={form.name} onChange={set("name")}
              className="mt-1 w-full rounded-xl border border-sage-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-sage-500 uppercase">Category *</span>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: SUBCATS[e.target.value][0] })}
              className="mt-1 w-full rounded-xl border border-sage-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500">
              {CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-sage-500 uppercase">Subcategory</span>
            <select value={form.subcategory} onChange={set("subcategory")}
              className="mt-1 w-full rounded-xl border border-sage-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500">
              {(SUBCATS[form.category] || []).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-sage-500 uppercase">Brand *</span>
            <input required value={form.brand} onChange={set("brand")}
              className="mt-1 w-full rounded-xl border border-sage-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-sage-500 uppercase">Stock</span>
            <input type="number" min="0" value={form.stock} onChange={set("stock")}
              className="mt-1 w-full rounded-xl border border-sage-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-sage-500 uppercase">Price ($) *</span>
            <input required type="number" step="0.01" min="0" value={form.price} onChange={set("price")} placeholder="19.99"
              className="mt-1 w-full rounded-xl border border-sage-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-sage-500 uppercase">Compare At ($) — optional</span>
            <input type="number" step="0.01" min="0" value={form.compareAt} onChange={set("compareAt")} placeholder="29.99"
              className="mt-1 w-full rounded-xl border border-sage-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-sage-500 uppercase">Rating</span>
            <input type="number" step="0.1" min="1" max="5" value={form.rating} onChange={set("rating")}
              className="mt-1 w-full rounded-xl border border-sage-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-sage-500 uppercase">Reviews</span>
            <input type="number" min="0" value={form.reviews} onChange={set("reviews")}
              className="mt-1 w-full rounded-xl border border-sage-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-sage-500 uppercase">Emoji</span>
            <input value={form.emoji} onChange={set("emoji")} maxLength="8" placeholder="🐾"
              className="mt-1 w-full rounded-xl border border-sage-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-sage-500 uppercase">Badge — optional</span>
            <input value={form.badge} onChange={set("badge")} placeholder="Best Seller / New"
              className="mt-1 w-full rounded-xl border border-sage-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-sage-500 uppercase">Art (gradient tint)</span>
            <div className="mt-1 flex flex-wrap gap-2">
              {TINTS.map(([v, l]) => (
                <button type="button" key={v} onClick={() => setForm({ ...form, tint: v })} title={l}
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${v} border-2 transition ${form.tint === v ? "border-forest-600 scale-110" : "border-transparent hover:border-sage-300"}`} />
              ))}
            </div>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-sage-500 uppercase">Short Description</span>
            <textarea value={form.shortDesc} onChange={set("shortDesc")} rows="3" maxLength="200"
              className="mt-1 w-full rounded-xl border border-sage-300 px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
          </label>

          <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose}
              className="border border-sage-300 text-charcoal-700 text-sm font-semibold px-5 py-2.5 rounded-full hover:border-forest-500 transition">
              Cancel
            </button>
            <button disabled={saving}
              className="bg-forest-600 text-white text-sm font-heading font-bold px-6 py-2.5 rounded-full hover:bg-forest-700 transition disabled:opacity-60">
              {saving ? "Saving…" : editing ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
