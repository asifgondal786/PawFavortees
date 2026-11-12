import { NextResponse } from "next/server";
import { provider } from "@/lib/provider";

// Public products API — frontend/pages isi ko use karenge.
// Phase 6+: provider switch to WooCommerceProvider (Store API) — same response shape.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const products = await provider.listProducts({
    category: searchParams.get("category") || undefined,
    sort: searchParams.get("sort") || undefined,
    q: searchParams.get("q") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
  });
  return NextResponse.json({
    source: provider.name,
    count: products.length,
    products,
  });
}
