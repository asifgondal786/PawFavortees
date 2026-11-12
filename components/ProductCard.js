import Link from "next/link";
import WishlistButton from "@/components/WishlistButton";

export default function ProductCard({ p }) {
  return (
    <Link
      href={`/product/${p.slug}`}
      className="group rounded-2xl bg-white border border-sage-300/50 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition"
    >
      <div className={`aspect-[4/3] bg-gradient-to-br ${p.tint} flex items-center justify-center relative`}>
        <span className="text-6xl group-hover:scale-110 transition-transform">{p.emoji}</span>
        {p.badge && (
          <span className="absolute top-3 left-3 bg-forest-600 text-cream-50 text-[11px] font-bold px-2.5 py-1 rounded-full">
            {p.badge}
          </span>
        )}
        {p.compareAt && (
          <span className="absolute top-3 right-3 bg-sand-500 text-charcoal-900 text-[11px] font-bold px-2.5 py-1 rounded-full">
            -{Math.round((1 - p.price / p.compareAt) * 100)}%
          </span>
        )}
        <div className="absolute bottom-3 right-3">
          <WishlistButton slug={p.slug} />
        </div>
      </div>
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-wide text-sage-500 font-semibold">{p.subcategory}</p>
        <h3 className="font-heading font-bold text-sm mt-1 leading-snug group-hover:text-forest-600 transition">{p.name}</h3>
        <div className="flex items-center gap-1 mt-1 text-xs text-charcoal-700">
          <span className="text-sand-500">★</span> {p.rating} <span className="text-sage-500">({p.reviews})</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading font-extrabold text-forest-700">${p.price.toFixed(2)}</span>
          {p.compareAt && <span className="text-xs text-sage-500 line-through">${p.compareAt.toFixed(2)}</span>}
        </div>
      </div>
    </Link>
  );
}
