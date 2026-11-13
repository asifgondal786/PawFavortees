import { getAdminProducts } from "@/lib/adminData";
import AddProductButton from "@/components/admin/AddProductButton";
import ProductRowActions from "@/components/admin/ProductRowActions";
import PageHeader from "@/components/admin/PageHeader";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="p-6 md:p-10">
      <PageHeader
        title="Products"
        subtitle={`${products.length} products · Supabase se live — add, edit, remove sab yahin`}
        actions={<AddProductButton />}
      />

      <div className="rounded-2xl bg-white border border-sage-300/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[780px]">
            <thead className="bg-sage-100/70 border-b border-sage-300/50">
              <tr className="text-left">
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Product</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Category</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Price</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Stock</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Rating</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Status</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-300/40">
              {products.map((p) => (
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
                    <span className="font-bold text-forest-700">${Number(p.price).toFixed(2)}</span>
                    {p.compareAt && <span className="text-xs text-sage-500 line-through ml-2">${Number(p.compareAt).toFixed(2)}</span>}
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
                  <td className="px-5 py-3">
                    <ProductRowActions product={p} />
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sage-500">Koi product nahi — pehla product add karo!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-sage-500 mt-4">
        ℹ️ Remove soft delete hai (DB mein history bachta hai) — Phase 6: WooCommerce catalog se two-way sync hoga.
      </p>
    </div>
  );
}
