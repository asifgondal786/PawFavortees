import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Admin products CRUD (service role, server-only).
// POST: create | PATCH: update by slug | DELETE ?slug= : soft delete (active=false)

const CATEGORIES = ["dogs", "cats", "birds", "fish", "small-pets", "reptiles"];
const slugify = (s) => String(s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

function clean(body) {
  const p = {};
  if (body.name !== undefined) p.name = String(body.name).trim();
  if (body.category !== undefined) {
    if (!CATEGORIES.includes(body.category)) throw new Error("Invalid category");
    p.category = body.category;
  }
  if (body.subcategory !== undefined) p.subcategory = String(body.subcategory).trim();
  if (body.brand !== undefined) p.brand = String(body.brand).trim();
  if (body.price !== undefined) p.price = Number(body.price);
  if (body.compareAt !== undefined) p.compare_at = body.compareAt ? Number(body.compareAt) : null;
  if (body.rating !== undefined) p.rating = Number(body.rating) || 4.5;
  if (body.reviews !== undefined) p.reviews = Math.max(0, Number(body.reviews) || 0);
  if (body.badge !== undefined) p.badge = body.badge ? String(body.badge).trim() : null;
  if (body.emoji !== undefined) p.emoji = String(body.emoji || "🐾").trim().slice(0, 8) || "🐾";
  if (body.tint !== undefined) p.tint = String(body.tint).trim();
  if (body.shortDesc !== undefined) p.short_desc = String(body.shortDesc).trim();
  if (body.specs !== undefined) p.specs = body.specs || {};
  if (body.stock !== undefined) p.stock = Math.max(0, Number(body.stock) || 0);
  if (p.price !== undefined && (Number.isNaN(p.price) || p.price < 0)) throw new Error("Price invalid");
  return p;
}

export async function POST(request) {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  try {
    const body = await request.json();
    const fields = clean(body);
    if (!fields.name || !fields.category || !fields.brand) {
      return NextResponse.json({ error: "Name, category aur brand zaroori hain" }, { status: 400 });
    }
    // slug unique ensure
    let slug = String(body.slug || "").trim() ? slugify(body.slug) : slugify(fields.name);
    for (let i = 0; i < 3; i++) {
      const { data: existing } = await sb.from("products").select("slug").eq("slug", slug).maybeSingle();
      if (!existing) break;
      slug = `${slugify(fields.name)}-${Math.random().toString(36).slice(2, 5)}`;
    }
    const { data, error } = await sb
      .from("products")
      .insert({ ...fields, slug, active: true })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ product: data }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Create failed" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  try {
    const body = await request.json();
    const slug = String(body.slug || "").trim();
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
    const fields = clean(body);
    delete fields.slug;
    if (!Object.keys(fields).length) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }
    const { data, error } = await sb
      .from("products")
      .update(fields)
      .eq("slug", slug)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ product: data });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const slug = (new URL(request.url).searchParams.get("slug") || "").trim();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  try {
    // soft delete — order_items/products history bachta hai
    const { data, error } = await sb
      .from("products")
      .update({ active: false })
      .eq("slug", slug)
      .select("slug, active")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ ok: true, slug: data.slug, active: data.active });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Delete failed" }, { status: 500 });
  }
}
