import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import AddToCart from "@/components/AddToCart";
import WishlistButton from "@/components/WishlistButton";
import { provider } from "@/lib/provider";

export async function generateMetadata({ params }) {
  const p = await provider.getProduct((await params).slug);
  if (!p) return { title: "Product Not Found" };
  return { title: p.name, description: p.shortDesc };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const p = await provider.getProduct(slug);
  if (!p) notFound();

  const related = (await provider.listProducts({ category: p.category })).filter((r) => r.id !== p.id).slice(0, 4);
  const discount = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* breadcrumbs */}
      <nav className="text-xs text-sage-500 mb-6 flex gap-1.5">
        <Link href="/" className="hover:text-forest-600">Home</Link> /
        <Link href={`/shop?category=${p.category}`} className="hover:text-forest-600">{p.category}</Link> /
        <span className="text-charcoal-700">{p.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* gallery placeholder */}
        <div className={`aspect-square rounded-3xl bg-gradient-to-br ${p.tint} flex items-center justify-center relative overflow-hidden`}>
          <span className="text-[9rem]">{p.emoji}</span>
          {discount > 0 && (
            <span className="absolute top-5 left-5 bg-sand-500 text-charcoal-900 font-bold px-4 py-1.5 rounded-full text-sm">
              Save {discount}%
            </span>
          )}
        </div>

        {/* info */}
        <div>
          <p className="text-xs uppercase tracking-wide text-sage-500 font-semibold">{p.brand} · {p.subcategory}</p>
          <h1 className="text-3xl md:text-4xl mt-2">{p.name}</h1>
          <div className="flex items-center gap-2 mt-3 text-sm">
            <span className="text-sand-500 text-lg">{"★".repeat(Math.round(p.rating))}{"☆".repeat(5 - Math.round(p.rating))}</span>
            <span className="font-semibold">{p.rating}</span>
            <span className="text-sage-500">({p.reviews} reviews)</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-heading font-extrabold text-4xl text-forest-700">${p.price.toFixed(2)}</span>
            {p.compareAt && <span className="text-lg text-sage-500 line-through">${p.compareAt.toFixed(2)}</span>}
          </div>
          <p className="text-sm text-forest-700 font-semibold mt-1">
            ✅ In Stock — ships within 1 business day
          </p>

          <p className="text-charcoal-700 mt-5 leading-relaxed">{p.shortDesc}</p>

          <AddToCart product={{ slug: p.slug, name: p.name, price: p.price, emoji: p.emoji, tint: p.tint }} />
          <div className="mt-3 flex items-center gap-2 text-sm">
            <WishlistButton slug={p.slug} />
            <span className="text-sage-500">Add to wishlist for later</span>
          </div>

          {/* shipping estimate */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-sage-100/70 p-4">🚚 <b>Free shipping</b><br /><span className="text-xs text-charcoal-700">on orders $49+</span></div>
            <div className="rounded-xl bg-sage-100/70 p-4">↩️ <b>30-day returns</b><br /><span className="text-xs text-charcoal-700">no questions asked</span></div>
          </div>

          {/* specs */}
          <div className="mt-6 rounded-2xl border border-sage-300/60 overflow-hidden">
            <h3 className="font-heading font-bold bg-sage-100/70 px-5 py-3">Specifications</h3>
            <dl className="divide-y divide-sage-300/40 text-sm">
              {Object.entries(p.specs).map(([k, v]) => (
                <div key={k} className="flex justify-between px-5 py-2.5">
                  <dt className="text-sage-500">{k}</dt>
                  <dd className="font-semibold text-charcoal-700">{String(v)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* related */}
      <section className="mt-16">
        <h2 className="text-2xl mb-6">You Might Also Like 🐾</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {related.map((r) => <ProductCard key={r.id} p={r} />)}
        </div>
      </section>
    </div>
  );
}
