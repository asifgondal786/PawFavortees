// Admin dashboard data — orders Supabase se (real), baaki Phase 6: WooCommerce REST API se aayega.
// Products provider se aate hain (same source of truth).
import { provider } from "@/lib/provider";
import { getSupabaseAdmin, supabaseConfigured } from "@/lib/supabase";

export const ADMIN_ORDERS = [
  { id: "PAW-8F3K2A", date: "2026-11-11T14:22:00", customer: "Sarah Mitchell", email: "sarah.m@gmail.com", items: 3, total: 128.47, status: "processing" },
  { id: "PAW-7D2M9X", date: "2026-11-11T09:05:00", customer: "James Turner", email: "jturner88@yahoo.com", items: 1, total: 79.99, status: "processing" },
  { id: "PAW-5Q1P4L", date: "2026-11-10T18:41:00", customer: "Priya Kapoor", email: "priya.k@outlook.com", items: 2, total: 33.98, status: "completed" },
  { id: "PAW-4T8N7B", date: "2026-11-10T11:12:00", customer: "Mike Rodriguez", email: "mikerod@gmail.com", items: 4, total: 204.96, status: "completed" },
  { id: "PAW-3Z6H1W", date: "2026-11-09T20:33:00", customer: "Emily Chen", email: "emchen@gmail.com", items: 1, total: 64.99, status: "completed" },
  { id: "PAW-2K9C5R", date: "2026-11-08T16:50:00", customer: "David Okafor", email: "d.okafor@gmail.com", items: 2, total: 57.98, status: "refunded" },
  { id: "PAW-1M4J8F", date: "2026-11-07T13:27:00", customer: "Jessica Lane", email: "jlane@gmail.com", items: 1, total: 42.99, status: "completed" },
  { id: "PAW-0V2X6D", date: "2026-11-06T10:18:00", customer: "Carlos Mendez", email: "cmendez@gmail.com", items: 5, total: 189.95, status: "completed" },
  { id: "PAW-9B7L3G", date: "2026-11-05T19:44:00", customer: "Amanda Foster", email: "afoster@gmail.com", items: 1, total: 89.99, status: "failed" },
  { id: "PAW-8N1T4P", date: "2026-11-05T08:31:00", customer: "Ryan Brooks", email: "rbrooks@gmail.com", items: 2, total: 27.98, status: "completed" },
];

// DB order row (orders + order_items join) ko admin table shape mein normalize karo.
// Mock rows aur DB rows dono se chalta hai.
export function normalizeOrder(row) {
  const items = row.order_items || [];
  return {
    id: row.order_number || row.id,
    date: row.created_at || row.date || new Date().toISOString(),
    customer: row.name || row.customer || "—",
    email: row.email,
    items: items.length
      ? items.reduce((n, i) => n + (i.qty || 1), 0)
      : row.items ?? 0,
    total: Number(row.total || 0),
    status: row.status || "pending",
    address: row.address || null,
    raw: row,
  };
}

// Real orders (Supabase) — service role server-side query. Fail hone par mock list.
export async function getAdminOrders() {
  const sb = getSupabaseAdmin();
  if (!supabaseConfigured || !sb) return ADMIN_ORDERS;
  try {
    const { data, error } = await sb
      .from("orders")
      .select("*, order_items(qty, name, price)")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data.map(normalizeOrder);
  } catch (e) {
    console.warn("[adminData] Supabase orders fetch failed, mock fallback:", e.message);
    return ADMIN_ORDERS;
  }
}

export const ADMIN_CUSTOMERS = [
  { name: "Sarah Mitchell", email: "sarah.m@gmail.com", orders: 6, spent: 512.43, joined: "2026-03-14", location: "TX" },
  { name: "James Turner", email: "jturner88@yahoo.com", orders: 4, spent: 347.96, joined: "2026-04-02", location: "FL" },
  { name: "Priya Kapoor", email: "priya.k@outlook.com", orders: 3, spent: 89.97, joined: "2026-06-21", location: "NJ" },
  { name: "Mike Rodriguez", email: "mikerod@gmail.com", orders: 5, spent: 465.90, joined: "2026-02-09", location: "CA" },
  { name: "Emily Chen", email: "emchen@gmail.com", orders: 2, spent: 129.98, joined: "2026-07-30", location: "WA" },
  { name: "David Okafor", email: "d.okafor@gmail.com", orders: 3, spent: 167.97, joined: "2026-05-17", location: "GA" },
  { name: "Jessica Lane", email: "jlane@gmail.com", orders: 2, spent: 85.98, joined: "2026-08-05", location: "OH" },
  { name: "Carlos Mendez", email: "cmendez@gmail.com", orders: 7, spent: 604.91, joined: "2026-01-28", location: "AZ" },
  { name: "Amanda Foster", email: "afoster@gmail.com", orders: 1, spent: 89.99, joined: "2026-09-12", location: "NC" },
  { name: "Ryan Brooks", email: "rbrooks@gmail.com", orders: 4, spent: 174.94, joined: "2026-04-25", location: "PA" },
];

// Last 14 days revenue (USD) — dashboard chart
export const SALES_14D = [
  42, 68, 55, 120, 95, 74, 130, 88, 64, 142, 110, 97, 156, 128.47,
];

// Deterministic mock stock per product (Phase 6: WooCommerce inventory se aayega)
// String slug bhi chale — stable hash
export function productStock(key) {
  const s = String(key);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return 5 + (h % 40);
}

export async function getAdminProducts() {
  const products = await provider.listProducts();
  // DB stock missing ho (purane rows) to hash fallback
  return products.map((p) => (p.stock == null ? { ...p, stock: productStock(p.id) } : p));
}

export function revenue() {
  return SALES_14D.reduce((a, b) => a + b, 0);
}

export function ordersCount() {
  return ADMIN_ORDERS.length;
}

export function aov() {
  return revenue() / Math.max(1, ADMIN_ORDERS.length);
}

export const STATUS_STYLES = {
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-forest-100 text-forest-700",
  paid: "bg-forest-100 text-forest-700",
  refunded: "bg-sand-300/60 text-charcoal-700",
  failed: "bg-red-100 text-red-700",
  pending: "bg-cream-200 text-charcoal-700",
};
