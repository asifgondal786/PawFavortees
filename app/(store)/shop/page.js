import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { provider } from "@/lib/provider";

const CATEGORIES = [["all", "All Products"], ["dogs", "🐶 Dogs"], ["cats", "🐱 Cats"]];
const SORTS = [["popular", "Popular"], ["latest", "Latest"], ["price-asc", "Price: Low → High"], ["price-desc", "Price: High → Low"], ["rating", "Top Rated"]];

export const metadata = { title: "Shop All Pet Supplies" };

export default async function ShopPage({ searchParams }) {
  const sp = await searchParams;
  const category = sp.category || "all";
  const sort = sp.sort || "popular";
  const q = sp.q || "";
  const maxPrice = sp.maxPrice || "";

  const products = await provider.listProducts({ category, sort, q, maxPrice });

  const qs = (over) => {
    const params = new URLSearchParams({ category, sort, q, maxPrice, ...over });
    for (const [k, v] of [...params]) if (!v || v === "all") params.delete(k);
    return `/shop?${params.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl mb-1">Shop{category !== "all" ? ` — ${CATEGORIES.find((c) => c[0] === category)?.[1] || category}` : ""}</h1>
      <p className="text-charcoal-700 text-sm mb-6">{products.length} product{products.length !== 1 ? "s" : ""}{q && ` for "${q}"`}</p>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        {/* sidebar — refined */}
        <aside className="space-y-4 lg:sticky lg:top-32 self-start">
          <div className="rounded-2xl bg-white border border-sage-300/50 p-5">
            <h3 className="font-heading font-bold text-sm mb-3 flex items-center gap-2">🐾 Category</h3>
            <ul className="space-y-1 text-sm">
              {CATEGORIES.map(([val, label]) => (
                <li key={val}>
                  <Link href={qs({ category: val })}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      category === val
                        ? "bg-forest-600 text-white font-bold shadow-sm"
                        : "text-charcoal-700 hover:bg-cream-100"
                    }`}>
                    {label}
                    {category === val && <span className="text-xs">✓</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white border border-sage-300/50 p-5">
            <h3 className="font-heading font-bold text-sm mb-3 flex items-center gap-2">💰 Max Price</h3>
            <div className="flex flex-wrap gap-2">
              {["", "25", "50", "100"].map((v) => (
                <Link key={v || "any"} href={qs({ maxPrice: v })}
                  className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold transition ${
                    (maxPrice || "") === v
                      ? "bg-forest-600 text-white border-forest-600 shadow-sm"
                      : "border-sage-300 text-charcoal-700 hover:border-forest-500 hover:text-forest-600"
                  }`}>
                  {v ? `Under $${v}` : "Any price"}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-forest-600 to-forest-700 text-cream-50 p-5">
            <div className="text-2xl mb-1">🚚</div>
            <h3 className="font-heading font-bold text-sm">Free Shipping $49+</h3>
            <p className="text-xs text-cream-100/80 mt-1">Qualifying orders par free, 1-day dispatch. 30-day returns.</p>
          </div>
        </aside>

        {/* grid */}
        <div>
          <div className="flex flex-wrap gap-2 mb-5 text-xs font-semibold">
            <span className="text-sage-500 self-center mr-1">Sort:</span>
            {SORTS.map(([val, label]) => (
              <Link key={val} href={qs({ sort: val })}
                className={`px-3 py-1.5 rounded-full border transition ${sort === val ? "bg-forest-600 text-white border-forest-600" : "border-sage-300 text-charcoal-700 hover:border-forest-500"}`}>
                {label}
              </Link>
            ))}
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-sage-300 p-12 text-center">
              <p className="text-4xl mb-3">🔍🐾</p>
              <h3 className="font-heading font-bold">No products found</h3>
              <p className="text-sm text-charcoal-700 mt-1">Try different filters, or check our <Link href="/shop" className="text-forest-600 underline">best sellers</Link>.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
