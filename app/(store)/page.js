import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { provider } from "@/lib/provider";

const PETS = [
  { label: "Dogs", emoji: "🐶", href: "/shop?category=dogs", desc: "Beds, toys, leashes" },
  { label: "Cats", emoji: "🐱", href: "/shop?category=cats", desc: "Trees, food, litter" },
];

const WHY = [
  { icon: "🚚", title: "Fast USA Shipping", desc: "Free shipping on qualifying orders, dispatched within 1 business day." },
  { icon: "🛡️", title: "Quality Checked", desc: "Every product vetted for safety, materials and durability." },
  { icon: "↩️", title: "Easy Returns", desc: "30-day hassle-free returns. Happy pets or your money back." },
  { icon: "💛", title: "Made for Pet Parents", desc: "Curated by people who spoil their pets too." },
];

const REVIEWS = [
  { name: "Sarah M.", pet: "Golden Retriever mom", text: "The orthopedic bed changed our senior dog's mornings. Quality is unreal for the price.", stars: 5 },
  { name: "James T.", pet: "2 cat dad", text: "Cat tower is sturdy, no wobble, and both cats fight over the top perch. Fast shipping!", stars: 5 },
  { name: "Priya K.", pet: "Cockatiel owner", text: "Bird toy set keeps Nimo busy for hours. Will definitely order again.", stars: 4 },
];

export default async function HomePage() {
  const [popular, latest, deals] = await Promise.all([
    provider.listProducts({ sort: "rating" }),
    provider.listProducts({ sort: "latest" }),
    provider.listProducts({ sort: "price-asc" }),
  ]);
  // Sections mutually exclusive: koi product homepage par sirf ek section mein dikhe
  const pickUnique = (source, taken, n) => {
    const picked = [];
    for (const p of source) {
      if (picked.length >= n) break;
      if (taken.has(p.id) || picked.some((x) => x.id === p.id)) continue;
      picked.push(p);
    }
    picked.forEach((p) => taken.add(p.id));
    return picked;
  };
  const used = new Set();
  const bestSellers = pickUnique(
    popular.filter((p) => p.badge === "Best Seller").concat(popular),
    used, 4
  );
  const newArrivals = pickUnique(latest, used, 4);
  const trending = pickUnique(popular, used, 4);

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-br from-forest-700 via-forest-600 to-forest-500 text-cream-50">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sand-300 font-semibold tracking-wide uppercase text-sm mb-3">🐾 Your pet&apos;s happy place</p>
            <h1 className="text-4xl md:text-6xl leading-tight font-extrabold">
              Everything Your Pet Loves, <span className="text-sand-300">All in One Place.</span>
            </h1>
            <p className="mt-5 text-cream-100/85 max-w-md text-lg">
              Premium beds, toys, food and gear — handpicked for the goodest dogs and the pickiest cats.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/shop" className="bg-sand-500 text-charcoal-900 font-heading font-bold px-7 py-3.5 rounded-full hover:bg-sand-300 transition shadow-lg">
                Shop Now
              </Link>
              <Link href="/shop?sort=rating" className="border-2 border-cream-100/40 text-cream-50 font-heading font-bold px-7 py-3.5 rounded-full hover:bg-cream-100/10 transition">
                Explore Collections
              </Link>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-4 max-w-sm">
            {PETS.map((p) => (
              <div key={p.label} className="bg-cream-50/10 backdrop-blur rounded-3xl p-8 flex flex-col items-center text-center hover:bg-cream-50/20 transition cursor-pointer">
                <span className="text-6xl mb-2">{p.emoji}</span>
                <span className="font-heading font-bold text-lg">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP BY PET */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl md:text-3xl mb-6">Shop by Pet</h2>
        <div className="grid grid-cols-2 max-w-md mx-auto gap-3">
          {PETS.map((p) => (
            <Link key={p.label} href={p.href} className="rounded-2xl bg-white border border-sage-300/50 p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition">
              <div className="text-4xl mb-2">{p.emoji}</div>
              <div className="font-heading font-bold text-sm">{p.label}</div>
              <div className="text-[11px] text-sage-500">{p.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl">Best Sellers 🔥</h2>
          <Link href="/shop" className="text-sm font-semibold text-forest-600 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bestSellers.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <div className="rounded-3xl bg-gradient-to-r from-sand-500 to-cream-200 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-4xl text-charcoal-900">Spoil Season Sale 🎉</h2>
            <p className="text-charcoal-700 mt-2">Up to 30% off beds, towers and grooming gear. No code needed.</p>
          </div>
          <Link href="/shop" className="bg-forest-700 text-cream-50 font-heading font-bold px-8 py-3.5 rounded-full hover:bg-forest-600 transition shrink-0">
            Shop the Sale
          </Link>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl">New Arrivals ✨</h2>
          <Link href="/shop?sort=latest" className="text-sm font-semibold text-forest-600 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newArrivals.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-sage-100/60 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl mb-8 text-center">Why Pet Parents Choose PawFavoritees</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY.map((w) => (
              <div key={w.title} className="bg-white rounded-2xl p-6 border border-sage-300/50">
                <div className="text-3xl mb-3">{w.icon}</div>
                <h3 className="font-heading font-bold">{w.title}</h3>
                <p className="text-sm text-charcoal-700 mt-1">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl md:text-3xl mb-6">Trending This Week 📈</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trending.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-forest-800 text-cream-100 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl mb-8 text-center">Happy Pets, Happy Parents 💚</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-cream-50/5 rounded-2xl p-6 border border-cream-100/10">
                <div className="text-sand-300 mb-2">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</div>
                <p className="text-sm text-cream-100/85">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-3 font-heading font-bold text-sm">{r.name}</p>
                <p className="text-xs text-cream-100/60">{r.pet}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="rounded-3xl border-2 border-dashed border-sage-300 bg-cream-100 p-8 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl">Join the Pack 🐾</h2>
          <p className="text-charcoal-700 mt-2 mb-6">Get 10% off your first order plus early access to new arrivals.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" required placeholder="Your email address"
              className="flex-1 rounded-full border border-sage-300 bg-white px-5 py-3 text-sm outline-none focus:border-forest-500" />
            <button className="bg-forest-600 text-white font-heading font-bold px-7 py-3 rounded-full hover:bg-forest-700 transition">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
