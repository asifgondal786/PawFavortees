import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Orders API — Supabase-backed.
// POST: checkout se order create (service role, server-only)
// GET:  ?order=PAW-xxx&email=... → exact lookup (track-order / order-received)
//       ?email=... → order history (account page)  [demo phase — production: auth-protected]

function genOrderNumber() {
  return "PAW-" + Math.random().toString(36).slice(2, 6).toUpperCase() + Date.now().toString(36).slice(-3).toUpperCase();
}

export async function POST(request) {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim();
    const items = Array.isArray(body.items) ? body.items : [];

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
    if (!items.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

    // customer upsert (non-fatal)
    let customerId = null;
    try {
      await sb.from("customers").upsert(
        { email, first_name: name.split(" ")[0] || null, last_name: name.split(" ").slice(1).join(" ") || null },
        { onConflict: "email" }
      );
      const { data: c } = await sb.from("customers").select("id").eq("email", email).maybeSingle();
      customerId = c?.id || null;
    } catch {}

    const payload = {
      order_number: genOrderNumber(),
      customer_id: customerId,
      email,
      name,
      address: String(body.address || ""),
      ship_method: String(body.ship_method || "standard"),
      pay_method: String(body.pay_method || "card"),
      status: "paid", // demo gateway approved — Phase 6: webhook se verify hoga
      subtotal: Number(body.subtotal || 0),
      shipping: Number(body.shipping || 0),
      tax: Number(body.tax || 0),
      total: Number(body.total || 0),
    };

    // unique order_number collision par retry
    let order = null, lastErr = null;
    for (let attempt = 0; attempt < 3 && !order; attempt++) {
      const { data, error } = await sb.from("orders").insert(payload).select().single();
      if (!error) order = data;
      else { lastErr = error; payload.order_number = genOrderNumber(); }
    }
    if (!order) throw lastErr;

    const rows = items.map((i) => ({
      order_id: order.id,
      product_slug: String(i.slug || ""),
      name: String(i.name || ""),
      qty: Math.max(1, Number(i.qty || 1)),
      price: Number(i.price || 0),
    }));
    const { error: itemErr } = await sb.from("order_items").insert(rows);
    if (itemErr) throw itemErr;

    return NextResponse.json({ orderNumber: order.order_number, id: order.id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Order failed" }, { status: 500 });
  }
}

const ALLOWED_STATUSES = ["pending", "paid", "processing", "shipped", "completed", "cancelled", "refunded", "failed"];

// Admin status update — { orderNumber, status }
export async function PATCH(request) {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  try {
    const body = await request.json();
    const orderNumber = String(body.orderNumber || "").trim().toUpperCase();
    const status = String(body.status || "").trim().toLowerCase();
    if (!orderNumber) return NextResponse.json({ error: "orderNumber required" }, { status: 400 });
    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const { data, error } = await sb
      .from("orders")
      .update({ status })
      .eq("order_number", orderNumber)
      .select("order_number, status")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ ok: true, orderNumber: data.order_number, status: data.status });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Update failed" }, { status: 500 });
  }
}

export async function GET(request) {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { searchParams } = new URL(request.url);
  const orderNumber = (searchParams.get("order") || "").trim().toUpperCase();
  const email = (searchParams.get("email") || "").trim().toLowerCase();

  // exact lookup — order number + email pair (track-order)
  if (orderNumber && email) {
    const { data, error } = await sb
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", orderNumber)
      .eq("email", email)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // items ko product art (emoji/tint) se enrich karo
    const slugs = (data.order_items || []).map((i) => i.product_slug);
    if (slugs.length) {
      const { data: prods } = await sb.from("products").select("slug,emoji,tint").in("slug", slugs);
      const art = Object.fromEntries((prods || []).map((p) => [p.slug, p]));
      data.order_items = data.order_items.map((i) => ({
        ...i,
        emoji: art[i.product_slug]?.emoji || "🐾",
        tint: art[i.product_slug]?.tint || "from-sage-100 to-cream-100",
      }));
    }
    return NextResponse.json({ order: data });
  }

  // list by email — account page order history
  if (email) {
    const { data, error } = await sb
      .from("orders")
      .select("*, order_items(*)")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ orders: data || [] });
  }

  return NextResponse.json({ error: "Provide order+email, or email" }, { status: 400 });
}
