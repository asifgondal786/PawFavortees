import { getAdminProducts, productStock } from "@/lib/adminData";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const products = await getAdminProducts();
  const rows = products.map((p) => ({ ...p, stock: productStock(p.id) }));

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
        <div>
          <h1 className="text-3xl">Products</h1>
          <p className="text-charcoal-700 text-sm mt-1">{rows.length} products · Phase 6: WooCommerce catalog se sync hoga</p>
        </div>
        <button className="bg-forest-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-forest-700 transition cursor-not-allowed opacity-60" title="Phase 6 — WooCommerce product creation API se connect hoga">
          + Add Product
        </button>
      </div>

      <div className="rounded-2xl bg-white border border-sage-300/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-sage-100/70">
              <tr className="text-left">
                <th className="px-5 py-3 font-heading">Product</th>
                <th className="px-5 py-3 font-heading">Category</th>
                <th className="px-5 py-3 font-heading">Price</th>
                <th className="px-5 py-3 font-heading">Stock</th>
                <th className="px-5 py-3 font-heading">Rating</th>
                <th className="px-5 py-3 font-heading">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-300/40">
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-cream-100/50 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-lg bg-gradient-to-br ${p.tint} flex items-center justify-center text-lg shrink-0`}>{p.emoji}</span>
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-sage-500">{p.brand} · {p.subcategory}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 capitalize text-charcoal-700">{p.category}</td>
                  <td className="px-5 py-3">
                    <span className="font-bold text-forest-700">${p.price.toFixed(2)}</span>
                    {p.compareAt && <span className="text-xs text-sage-500 line-through ml-2">${p.compareAt.toFixed(2)}</span>}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      p.stock < 10 ? "bg-red-100 text-red-700" : p.stock < 15 ? "bg-cream-200 text-charcoal-700" : "bg-forest-100 text-forest-700"
                    }`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3"><span className="text-sand-500">★</span> {p.rating} <span className="text-xs text-sage-500">({p.reviews})</span></td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-forest-100 text-forest-700">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-sage-500 mt-4">
        ℹ️ Edit/Delete operations Phase 6 mein WooCommerce REST API se enable honge — read-only demo abhi.
      </p>
    </div>
  );
}
