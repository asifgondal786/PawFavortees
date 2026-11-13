// CJ Dropshipping CSV -> PawFavoritees Supabase import
// Usage: node scripts/import-cj-products.mjs <csvPath>
// - Filters rows with name + price + image
// - Downloads product images to public/products/<slug>.webp (800x800)
// - Inserts products into Supabase (specs._image holds local image path)
// Idempotent: existing slugs are skipped.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// --- load env from .env.local ---
const envSrc = readFileSync(join(root, ".env.local"), "utf8");
const env = Object.fromEntries(envSrc.split(/\r?\n/).filter((l) => l.includes("=") && !l.startsWith("#")).map((l) => {
  const i = l.indexOf("=");
  return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
}));
const SB_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SRK = env.SUPABASE_SERVICE_ROLE_KEY;
if (!SB_URL || !SRK) { console.error("Missing Supabase env"); process.exit(1); }

// --- minimal CSV parser (handles quoted fields) ---
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); if (row.some((f) => f.trim() !== "")) rows.push(row); }
  return rows;
}

const csvPath = process.argv[2] || "cjdropshipping-com-2026-11-13.csv";
const raw = readFileSync(csvPath, "utf8");
const [header, ...dataRows] = parseCsv(raw);

// --- curation: per-slug copy (English, audience-facing) ---
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
const TINTS = ["from-forest-100 to-sage-100", "from-sand-300 to-cream-200", "from-cream-200 to-sage-300", "from-sage-100 to-cream-100", "from-forest-100 to-cream-200"];
const EMOJI = "🐾";
const BRAND = "PawFav Essentials";

// hand-written short descriptions keyed by name index order (match CSV order below)
const DESCRIPTIONS = new Map([
  ["pet-hair-remover", "Reusable pet hair remover for couches, carpets and car seats — no adhesive or refills needed, just roll and empty."],
  ["cat-hair-remover-suction-pet-household-hair-remover-dog-hair-remover-cat-sticky-carpet-hair-remover-brush-pet-products", "Multi-surface hair remover brush with sticky suction pads — lifts embedded cat and dog hair from carpets and upholstery."],
  ["double-sided-clothing-pet-dust-hair-removal-brush-pet-hair-remover", "Double-sided lint and dust brush for clothing — one swipe picks up pet hair and dust, reversible for twice the coverage."],
  ["travel-portable-pet-hair-remover", "Pocket-size pet hair remover for on-the-go cleanups — ideal for car seats, jackets and hotel rooms."],
  ["pet-hair-remover-for-laundry", "Laundry pet hair catcher — drops into the washer to collect loose fur before it sticks to your clothes."],
  ["pet-hair-remover-for-laundry-2", "Compact laundry hair trap — grabs shed fur during every wash cycle, keeping clothes and the drum hair-free."],
  ["lent-remover-pet-hair-cleaner", "Gentle lint remover for pet hair on garments and furniture — restores fabric without tape or sticky paper."],
  ["home-cleaning-pet-hair-remover", "Heavy-duty home cleaning hair remover with a wide head — tackles large rugs, sofas and bedding in fewer passes."],
  ["pet-hair-remover-brush-cat-dog-hair-remover-comb-pet-hair-detaile", "Detailing comb brush for cats and dogs — glides through fur to lift shedding hair and smooth the coat."],
  ["pet-silicone-brush-and-hair-remover", "Flexible silicone brush and hair remover — safe on delicate fabrics, easy to rinse clean."],
  ["pet-cat-cleaning-comb-hair-remover", "Cat grooming comb with hair-release teeth — reduces shedding by catching loose undercoat fur."],
]);

const rows = dataRows.map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] || "").trim()])))
  .filter((r) => r.name && /^\d/.test(r.price) && r.image.includes("cjdropshipping"));

console.log(`Usable rows: ${rows.length}`);

const seen = new Map();
const products = rows.map((r, idx) => {
  let slug = slugify(r.name);
  if (seen.has(slug)) { seen.set(slug, seen.get(slug) + 1); slug = `${slug}-${seen.get(slug)}`; }
  else seen.set(slug, 1);

  // price: min of range; retail = 3x wholesale rounded to .99, compareAt = 4x
  const lo = parseFloat(r.price.split("-")[0]) || 0;
  const retail = Math.max(0.99, Math.ceil(lo * 3) - 0.01);
  const compareAt = Math.max(retail + 1, Math.ceil(lo * 4) - 0.01);

  const name = r.name.replace(/^(.*?)\s*(Pet Products)?$/i, "$1").replace(/\s+/g, " ").trim();
  const category = /cat|kitten|feline/i.test(r.name) ? "cats" : "dogs";
  const image = `/products/${slug}.webp`;
  const specs = {
    _image: image,
    "Best For": "Dogs & Cats",
    Type: "Pet Hair Removal",
    Care: "Rinse clean, air dry",
  };
  return {
    slug, name, category, subcategory: "Grooming", brand: BRAND,
    price: retail, compare_at: compareAt, rating: 4.5, reviews: 0,
    badge: "New", emoji: EMOJI, tint: TINTS[idx % TINTS.length],
    short_desc: DESCRIPTIONS.get(slug) || "Effective pet hair remover for everyday fur cleanup around the home.",
    specs, stock: 50, active: true,
    _srcImage: r.image.replace(/w_250,h_250/, "w_800,h_800"),
  };
});

// --- download images (800x800) ---
mkdirSync(join(root, "public", "products"), { recursive: true });
for (const p of products) {
  const url = p._srcImage;
  const dest = join(root, "public", p.specs._image.slice(1));
  if (existsSync(dest)) { console.log(`img exists: ${p.slug}`); continue; }
  const res = await fetch(url);
  if (!res.ok) { console.error(`IMG FAIL ${res.status}: ${url}`); continue; }
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  console.log(`img ok: ${p.slug} (800px)`);
}

// --- insert into Supabase ---
const existingRes = await fetch(`${SB_URL}/rest/v1/products?select=slug&slug=in.(${products.map((p) => `"${p.slug}"`).join(",")})`, {
  headers: { apikey: SRK, Authorization: `Bearer ${SRK}` },
});
const existingSlugs = new Set((await existingRes.json()).map((r) => r.slug));

let inserted = 0;
for (const { _srcImage, ...p } of products) {
  if (existingSlugs.has(p.slug)) { console.log(`skip existing: ${p.slug}`); continue; }
  const res = await fetch(`${SB_URL}/rest/v1/products`, {
    method: "POST",
    headers: { apikey: SRK, Authorization: `Bearer ${SRK}`, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(p),
  });
  if (res.ok) { inserted++; console.log(`inserted: ${p.slug}`); }
  else console.error(`INSERT FAIL ${res.status}: ${p.slug} -> ${(await res.text()).slice(0, 200)}`);
}
console.log(`Done. inserted=${inserted}, total=${products.length}`);
