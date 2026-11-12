import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { provider } from "@/lib/provider";

// Reusable category landing page — blueprint section D (banner, intro, subcategories, grid).
// WooCommerce integration ke baad bhi same component chalega (provider swap only).
export default async function CategoryPage({
  category,
  title,
  emoji,
  tagline,
  intro,
  subcats = [],
  comingSoon = false,
}) {
  if (comingSoon) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-6xl mb-4">{emoji}</p>
        <h1 className="text-3xl md:text-4xl">{title}</h1>
        <p className="text-charcoal-700 max-w-md mx-auto mt-4">
          Reptile supplies — terrariums, heating, lighting aur feeding gear — launch ke thora baad aa raha hai.
        </p>
        <Link href="/shop" className="inline-block mt-8 bg-forest-600 text-white font-heading font-bold px-8 py-3 rounded-full hover:bg-forest-700 transition">
          Shop Other Pets
        </Link>
      </div>
    );
  }

  const products = await provider.listProducts({ category });

  return (
    <div>
      {/* banner */}
      <section className={`bg-gradient-to-br from-forest-700 via-forest-600 to-forest-500 text-cream-50`}>
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 text-center">
          <span className="text-5xl md:text-6xl">{emoji}</span>
          <h1 className="text-3xl md:text-5xl mt-3">{title}</h1>
          <p className="text-sand-300 font-semibold tracking-wide uppercase text-xs mt-2">{tagline}</p>
          <p className="text-cream-100/85 max-w-xl mx-auto mt-4 text-sm md:text-base">{intro}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-[250px_1fr] gap-8">
        {/* sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-32 self-start">
          <div className="rounded-2xl bg-white border border-sage-300/50 p-5">
            <h3 className="font-heading font-bold text-sm mb-3 flex items-center gap-2">🗂️ Shop by Type</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href={`/shop?category=${category}`}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-forest-600 text-white font-bold shadow-sm">
                  All {title} <span className="text-xs">{products.length}</span>
                </Link>
              </li>
              {subcats.map((s) => {
                const count = products.filter((p) => p.subcategory === s).length;
                return (
                  <li key={s}>
                    <Link href={`/shop?category=${category}&q=${encodeURIComponent(s)}`}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-charcoal-700 hover:bg-cream-100 transition">
                      {s}
                      {count > 0 && <span className="text-xs text-sage-500 font-semibold">{count}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-2xl bg-white border border-sage-300/50 p-5">
            <h3 className="font-heading font-bold text-sm mb-3 flex items-center gap-2">💰 Price</h3>
            <div className="flex flex-wrap gap-2">
              {["25", "50", "100"].map((v) => (
                <Link key={v} href={`/shop?category=${category}&maxPrice=${v}`}
                  className="px-3.5 py-1.5 rounded-full border border-sage-300 text-xs font-semibold text-charcoal-700 hover:border-forest-500 hover:text-forest-600 transition">
                  Under ${v}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-forest-600 to-forest-700 text-cream-50 p-5">
            <div className="text-2xl mb-1">🚚</div>
            <h3 className="font-heading font-bold text-sm">Free Shipping $49+</h3>
            <p className="text-xs text-cream-100/80 mt-1">Qualifying orders par free delivery aur 30-day returns.</p>
          </div>
        </aside>

        {/* products */}
        <div>
          <div className="flex items-end justify-between mb-5">
            <h2 className="text-2xl">
              {products.length} Product{products.length !== 1 ? "s" : ""}
            </h2>
            <Link href={`/shop?category=${category}`} className="text-sm font-semibold text-forest-600 hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
