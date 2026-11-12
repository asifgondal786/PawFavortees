import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import SearchBox from "@/components/SearchBox";
import { provider } from "@/lib/provider";

export const metadata = {
  title: "Search Pet Supplies",
  description: "Search thousands of pet supplies — toys, food, beds, grooming and more.",
};

export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;
  const q = sp.q || "";
  const results = q ? await provider.listProducts({ q }) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl mb-2">Search 🔍</h1>
      <p className="text-charcoal-700 text-sm mb-6">Type at least 2 letters — suggestions appear instantly.</p>

      <div className="max-w-xl mb-10">
        <SearchBox big />
      </div>

      {q && (
        <>
          <h2 className="text-2xl mb-5">
            {results.length > 0
              ? `${results.length} result${results.length !== 1 ? "s" : ""} for “${q}”`
              : `No results for “${q}”`}
          </h2>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-sage-300 p-12 text-center">
              <p className="text-4xl mb-3">🐾🔍</p>
              <h3 className="font-heading font-bold">We couldn&apos;t find that</h3>
              <p className="text-sm text-charcoal-700 mt-1 mb-4">Check the spelling, or browse our best sellers instead.</p>
              <Link href="/shop" className="inline-block bg-forest-600 text-white font-heading font-bold px-7 py-2.5 rounded-full hover:bg-forest-700 transition">
                Shop All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
