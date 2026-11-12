import { getSupabaseAdmin, getSupabase, supabaseConfigured } from "@/lib/supabase";

// PawFavoritees — product data provider (adapter pattern)
// MOCK adapter abhi local development ke liye.
// Production: WooCommerceProvider (Store API: /wp-json/store/v1) same interface se implement hoga.

const MOCK_PRODUCTS = [
  {
    id: 1, slug: "everlast-dog-bed-orthopedic", name: "Everlast Orthopedic Dog Bed",
    category: "dogs", subcategory: "Dog Beds", brand: "PawFav Essentials",
    price: 64.99, compareAt: 89.99, rating: 4.8, reviews: 231, badge: "Best Seller",
    emoji: "🛏️", tint: "from-forest-100 to-sage-100",
    shortDesc: "Memory-foam orthopedic bed with washable sherpa cover. Supports joints for senior dogs and growing puppies.",
    specs: { Material: "Memory foam + Sherpa", Sizes: "S / M / L / XL", Care: "Machine washable cover" },
  },
  {
    id: 2, slug: "ropefun-tough-dog-toy", name: "RopeFun Tough Rope Toy",
    category: "dogs", subcategory: "Dog Toys", brand: "RopeFun",
    price: 12.99, compareAt: 17.99, rating: 4.6, reviews: 418, badge: null,
    emoji: "🪢", tint: "from-sand-300 to-cream-200",
    shortDesc: "Indestructible braided cotton rope — perfect for tug, fetch and dental cleaning.",
    specs: { Material: "Braided cotton", Size: "18 inch", "Pet Size": "Medium to Large" },
  },
  {
    id: 3, slug: "trailpaw-reflective-leash", name: "TrailPaw Reflective Leash",
    category: "dogs", subcategory: "Collars & Leashes", brand: "TrailPaw",
    price: 19.99, compareAt: null, rating: 4.7, reviews: 156, badge: "New",
    emoji: "🦮", tint: "from-forest-500 to-forest-700",
    shortDesc: "360° no-tangle reflective leash with padded handle. Night-walk safe.",
    specs: { Length: "6 ft", Material: "Nylon + Reflective stitching", Clip: "Zinc alloy" },
  },
  {
    id: 4, slug: "yumbox-slow-feeder-bowl", name: "YumBox Slow Feeder Bowl",
    category: "dogs", subcategory: "Feeding", brand: "YumBox",
    price: 16.49, compareAt: 22.99, rating: 4.5, reviews: 289, badge: null,
    emoji: "🥣", tint: "from-cream-200 to-sand-300",
    shortDesc: "Bloat-reducing slow feeder maze bowl. Non-slip base, dishwasher safe.",
    specs: { Material: "Food-grade ABS", Capacity: "2 cups" },
  },
  {
    id: 5, slug: "cloudnine-cat-tree-tower", name: "CloudNine Cat Tree Tower",
    category: "cats", subcategory: "Scratching Posts", brand: "CloudNine",
    price: 79.99, compareAt: 109.99, rating: 4.9, reviews: 342, badge: "Best Seller",
    emoji: "🐾", tint: "from-sage-100 to-cream-100",
    shortDesc: "5-level tower with sisal posts, plush perches and a cozy hideaway condo.",
    specs: { Height: "54 inch", Levels: 5, Material: "Sisal + Faux fur" },
  },
  {
    id: 6, slug: "purrfect-interactive-laser", name: "Purrfect Interactive Laser Toy",
    category: "cats", subcategory: "Cat Toys", brand: "Purrfect",
    price: 14.99, compareAt: null, rating: 4.4, reviews: 197, badge: "New",
    emoji: "🔴", tint: "from-cream-100 to-sage-100",
    shortDesc: "Auto-rotating laser with random patterns — 15 min auto shut-off for safety.",
    specs: { Power: "USB-C rechargeable", Timer: "15 min auto-off" },
  },
  {
    id: 7, slug: "whiskerwell-grain-free-cat-food", name: "WhiskerWell Grain-Free Cat Food",
    category: "cats", subcategory: "Cat Food", brand: "WhiskerWell",
    price: 42.99, compareAt: 49.99, rating: 4.8, reviews: 512, badge: "Best Seller",
    emoji: "🐟", tint: "from-forest-100 to-cream-200",
    shortDesc: "Salon-quality salmon recipe, grain-free, taurine enriched for heart and vision health.",
    specs: { Weight: "10 lb bag", LifeStage: "Adult 1-7 yrs", Protein: "38%" },
  },
  {
    id: 8, slug: "scoopsmart-odor-lock-litter", name: "ScoopSmart Odor-Lock Litter",
    category: "cats", subcategory: "Cat Litter", brand: "ScoopSmart",
    price: 24.99, compareAt: 29.99, rating: 4.3, reviews: 263, badge: null,
    emoji: "🧺", tint: "from-sand-300 to-cream-100",
    shortDesc: "Clumping bentonite litter with 7-day odor lock. 99% dust free.",
    specs: { Weight: "20 lb", Type: "Clumping", Scent: "Unscented" },
  },
  {
    id: 9, slug: "featherpal-bird-toy-set", name: "FeatherPal Bird Toy Set",
    category: "birds", subcategory: "Bird Toys", brand: "FeatherPal",
    price: 18.99, compareAt: 24.99, rating: 4.6, reviews: 88, badge: null,
    emoji: "🦜", tint: "from-cream-200 to-sage-300",
    shortDesc: "6-piece foraging and chew toy set for parakeets, cockatiels and lovebirds.",
    specs: { Pieces: 6, Fits: "Small to medium cages" },
  },
  {
    id: 10, slug: "aquapure-canister-filter", name: "AquaPure Canister Filter",
    category: "fish", subcategory: "Filters", brand: "AquaPure",
    price: 89.99, compareAt: 119.99, rating: 4.7, reviews: 141, badge: "New",
    emoji: "🐠", tint: "from-forest-100 to-sage-100",
    shortDesc: "4-stage silent canister filter for tanks up to 75 gallons. Crystal-clear water.",
    specs: { Flow: "264 GPH", Tank: "Up to 75 gal", Media: "4-stage" },
  },
  {
    id: 11, slug: "bunnyhaven-hay-feeder", name: "BunnyHaven Hay Feeder",
    category: "small-pets", subcategory: "Rabbit Supplies", brand: "BunnyHaven",
    price: 21.99, compareAt: null, rating: 4.5, reviews: 74, badge: null,
    emoji: "🐇", tint: "from-sage-100 to-cream-200",
    shortDesc: "Wall-mount timothy hay feeder that keeps hay clean and waste low.",
    specs: { Mount: "Cage wire or wall", Material: "Powder-coated steel" },
  },
  {
    id: 12, slug: "bathbuddy-pet-grooming-glove", name: "BathBuddy Grooming Glove",
    category: "dogs", subcategory: "Grooming", brand: "BathBuddy",
    price: 13.99, compareAt: 19.99, rating: 4.4, reviews: 205, badge: null,
    emoji: "🧤", tint: "from-cream-100 to-sand-300",
    shortDesc: "Dual-sided deshedding glove — brush and bond with your pet in one stroke.",
    specs: { Side: "255 silicone tips", Fit: "One size", "Wet/Dry": "Both" },
  },
];

// Launch scope: sirf Dogs & Cats. Phase 2 mein ACTIVE_CATEGORIES mein baqi add kar dena —
// data already maujood hai, koi aur change nahi chahiye.
const ACTIVE_CATEGORIES = ["dogs", "cats"];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const MockProvider = {
  name: "mock",
  async listProducts({ category, sort, maxPrice, q } = {}) {
    await delay(80); // simulate network
    let items = [...MOCK_PRODUCTS];
    items = items.filter((p) => ACTIVE_CATEGORIES.includes(p.category));
    if (category && category !== "all") items = items.filter((p) => p.category === category);
    if (maxPrice) items = items.filter((p) => p.price <= Number(maxPrice));
    if (q) {
      const needle = q.toLowerCase();
      items = items.filter(
        (p) => p.name.toLowerCase().includes(needle) || p.subcategory.toLowerCase().includes(needle) || p.brand.toLowerCase().includes(needle)
      );
    }
    switch (sort) {
      case "price-asc": items.sort((a, b) => a.price - b.price); break;
      case "price-desc": items.sort((a, b) => b.price - a.price); break;
      case "rating": items.sort((a, b) => b.rating - a.rating); break;
      case "latest": items.sort((a, b) => b.id - a.id); break;
      default: items.sort((a, b) => b.reviews - a.reviews); // popularity
    }
    return items;
  },
  async getProduct(slug) {
    await delay(50);
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
  },
  async getProductsBySlugs(slugs) {
    return MOCK_PRODUCTS.filter((p) => slugs.includes(p.slug));
  },
};

export const WooCommerceProvider = null; // Phase 6: Store API adapter (same interface)

// ---------- SupabaseProvider (app database: products table) ----------
// Row → app shape mapping (snake_case → camelCase)
function toAppProduct(row) {
  return {
    id: row.slug, // slug stable string id (UI keys ke liye)
    slug: row.slug,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory,
    brand: row.brand,
    price: Number(row.price),
    compareAt: row.compare_at ? Number(row.compare_at) : null,
    rating: Number(row.rating || 4.5),
    reviews: row.reviews || 0,
    badge: row.badge || null,
    emoji: row.emoji || "🐾",
    tint: row.tint || "from-sage-100 to-cream-100",
    shortDesc: row.short_desc || "",
    specs: row.specs || {},
  };
}

async function sbQuery(build) {
  if (!supabaseConfigured) return null;
  const sb = getSupabaseAdmin() || getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await build(sb.from("products"));
    if (error) throw new Error(error.message);
    return data;
  } catch (e) {
    console.warn("[provider] Supabase query failed, falling back to mock:", e.message);
    return null;
  }
}

export const SupabaseProvider = {
  name: "supabase",
  async listProducts(opts = {}) {
    const rows = await sbQuery((q) => {
      let query = q.select("*").eq("active", true);
      const { category, sort, maxPrice, q: term } = opts;
      if (category && category !== "all") query = query.eq("category", category);
      if (maxPrice) query = query.lte("price", Number(maxPrice));
      if (term) query = query.or(`name.ilike.%${term}%,subcategory.ilike.%${term}%,brand.ilike.%${term}%`);
      switch (sort) {
        case "price-asc": query = query.order("price", { ascending: true }); break;
        case "price-desc": query = query.order("price", { ascending: false }); break;
        case "rating": query = query.order("rating", { ascending: false }); break;
        case "latest": query = query.order("created_at", { ascending: false }); break;
        default: query = query.order("reviews", { ascending: false });
      }
      return query;
    });
    if (!rows) return null; // fallback trigger
    return rows.map(toAppProduct);
  },
  async getProduct(slug) {
    const rows = await sbQuery((q) =>
      q.select("*").eq("slug", slug).eq("active", true).limit(1)
    );
    if (!rows) return null;
    return rows.length ? toAppProduct(rows[0]) : null;
  },
  async getProductsBySlugs(slugs) {
    const rows = await sbQuery((q) => q.select("*").in("slug", slugs).eq("active", true));
    if (!rows) return null;
    return rows.map(toAppProduct);
  },
};

// ---------- Active provider: Supabase pehle, fail hone par Mock ----------
// Schema deploy hone ke baad automatically Supabase se data aayega — koi code change nahi.
export const provider = {
  name: supabaseConfigured ? "supabase" : "mock",
  async listProducts(opts) {
    const r = await SupabaseProvider.listProducts(opts);
    return r !== null ? r : MockProvider.listProducts(opts);
  },
  async getProduct(slug) {
    const r = await SupabaseProvider.getProduct(slug);
    return r !== null ? r : MockProvider.getProduct(slug);
  },
  async getProductsBySlugs(slugs) {
    const r = await SupabaseProvider.getProductsBySlugs(slugs);
    return r !== null ? r : MockProvider.getProductsBySlugs(slugs);
  },
};
