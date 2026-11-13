import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Wishlist sync API (service role, server-only).
// GET  ?email=...  → DB wishlist slugs
// POST {email, slugs[]} → full-set sync (new upsert, removed delete)
// wishlist_items.customer_id ← customers table (email se link)

async function customerId(sb, email, name) {
  await sb.from("customers").upsert({ email, first_name: name?.split(" ")[0] || null }, { onConflict: "email" });
  const { data } = await sb.from("customers").select("id").eq("email", email).maybeSingle();
  return data?.id || null;
}

export async function GET(request) {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const email = (new URL(request.url).searchParams.get("email") || "").trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  const { data: c } = await sb.from("customers").select("id").eq("email", email).maybeSingle();
  if (!c) return NextResponse.json({ slugs: [] });
  const { data, error } = await sb.from("wishlist_items").select("product_slug").eq("customer_id", c.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slugs: (data || []).map((r) => r.product_slug) });
}

export async function POST(request) {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "");
    const slugs = Array.isArray(body.slugs) ? [...new Set(body.slugs.map(String))] : null;
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    if (!slugs) return NextResponse.json({ error: "slugs array required" }, { status: 400 });

    const cid = await customerId(sb, email, name);
    if (!cid) return NextResponse.json({ error: "customer lookup failed" }, { status: 500 });

    const { data: existing } = await sb.from("wishlist_items").select("product_slug").eq("customer_id", cid);
    const have = new Set((existing || []).map((r) => r.product_slug));
    const want = new Set(slugs);

    // naye add karo
    const toAdd = [...want].filter((s) => !have.has(s)).map((s) => ({ customer_id: cid, product_slug: s }));
    if (toAdd.length) {
      const { error } = await sb.from("wishlist_items").upsert(toAdd, { onConflict: "customer_id,product_slug" });
      if (error) throw new Error(error.message);
    }
    // hataye gaye delete karo
    const toRemove = [...have].filter((s) => !want.has(s));
    if (toRemove.length) {
      const { error } = await sb.from("wishlist_items").delete().eq("customer_id", cid).in("product_slug", toRemove);
      if (error) throw new Error(error.message);
    }
    return NextResponse.json({ ok: true, synced: slugs.length });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Wishlist sync failed" }, { status: 500 });
  }
}
