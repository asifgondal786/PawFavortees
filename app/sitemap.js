import { provider } from "@/lib/provider";

export default async function sitemap() {
  const base = "https://pawfavoritees.com";
  const products = await provider.listProducts();
  const staticPages = ["", "/shop", "/search", "/cart", "/checkout", "/about", "/contact", "/faqs", "/blog", "/shipping", "/privacy-policy", "/terms", "/return-policy", "/track-order", "/wishlist", "/login", "/register", "/dogs", "/cats"];
  return [
    ...staticPages.map((p) => ({ url: base + p, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 })),
    ...products.map((p) => ({ url: `${base}/product/${p.slug}`, changeFrequency: "weekly", priority: 0.8 })),
  ];
}
