import Link from "next/link";
import { SALES_14D, STATUS_STYLES, productStock, getAdminProducts, getAdminOrders } from "@/lib/adminData";
import PageHeader from "@/components/admin/PageHeader";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const products = await getAdminProducts();
  const orders = await getAdminOrders();
  const rev = orders.reduce((n, o) => n + o.total, 0);
  const ordersN = orders.length;
  const aovV = rev / Math.max(1, ordersN);
  const processingN = orders.filter((o) => o.status === "processing").length;

  const statCards = [
    { label: "Revenue", value: `$${rev.toFixed(2)}`, icon: "💵", sub: ordersN ? `${ordersN} orders se live` : "Abhi koi order nahi", up: ordersN > 0 },
    { label: "Orders", value: ordersN, icon: "🧾", sub: processingN ? `${processingN} processing` : "Sab settle ho gaye", up: true },
    { label: "Avg Order Value", value: `$${aovV.toFixed(2)}`, icon: "📈", sub: ordersN ? "Supabase se live" : "Mock data", up: ordersN > 0 },
    { label: "Products Live", value: products.length, icon: "📦", sub: "2 categories active", up: null },
  ];

  const maxSale = Math.max(...SALES_14D);
  const lowStock = products.map((p) => ({ ...p, stock: productStock(p.id) })).filter((p) => p.stock < 15);
  const topProducts = products.slice().sort((a, b) => b.reviews - a.reviews).slice(0, 5);

  return (
    <div className="p-6 md:p-10">
      <PageHeader
        title="Dashboard"
        subtitle={`${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · Store overview`}
        actions={
          <>
            <Link href="/admin/products" className="border border-sage-300 text-charcoal-700 text-sm font-semibold px-4 py-2 rounded-full hover:border-forest-500 hover:bg-white transition">Manage Products</Link>
            <Link href="/admin/orders" className="bg-forest-600 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-forest-700 shadow-sm transition">View Orders</Link>
          </>
        }
      />

      {/* stat cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-sage-300/50 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">{s.label}</span>
              <span className="text-xl">{s.icon}</span>
            </div>
            <p className="font-heading font-extrabold text-3xl text-forest-700 mt-2">{s.value}</p>
            <p className={`text-xs mt-1 font-semibold ${s.up === null ? "text-sage-500" : s.up ? "text-forest-600" : "text-red-500"}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* sales chart */}
      <div className="rounded-2xl bg-white border border-sage-300/50 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading font-bold text-lg">Sales — Last 14 Days</h2>
            <p className="text-xs text-sage-500 mt-0.5">Demo chart · Phase 6: WooCommerce sales data se replace hoga</p>
          </div>
          <span className="text-xs bg-sage-100 text-forest-700 font-bold px-3 py-1 rounded-full">Total ${rev.toFixed(2)}</span>
        </div>
        <div className="flex items-end gap-1.5 h-40">
          {SALES_14D.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <span className="text-[9px] font-bold text-forest-700 opacity-0 group-hover:opacity-100 transition">${v}</span>
              <div className="w-full rounded-t-md bg-gradient-to-t from-forest-600 to-forest-500 hover:from-forest-700 transition-all"
                style={{ height: `${Math.max(6, (v / maxSale) * 100)}%` }} />
              <span className="text-[9px] text-sage-500">{i % 2 === 0 ? new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString("en-US", { month: "numeric", day: "numeric" }) : ""}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* recent orders */}
        <div className="rounded-2xl bg-white border border-sage-300/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-lg">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-semibold text-forest-600 hover:underline">View all →</Link>
          </div>
          <div className="space-y-2">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center gap-3 rounded-xl border border-sage-300/40 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-sm">#{o.id}</p>
                  <p className="text-xs text-sage-500 truncate">{o.customer} · {o.items} item{o.items !== 1 ? "s" : ""}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                <span className="font-heading font-bold text-sm text-forest-700">${Number(o.total).toFixed(2)}</span>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-sm text-charcoal-700">Abhi tak koi order nahi — pehla order checkout se aayega. 🐾</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* top products */}
          <div className="rounded-2xl bg-white border border-sage-300/50 p-6">
            <h2 className="font-heading font-bold text-lg mb-4">Top Products</h2>
            <div className="space-y-2">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="font-heading font-extrabold text-sage-300 w-5">{i + 1}</span>
                  <span className={`w-9 h-9 rounded-lg bg-gradient-to-br ${p.tint} flex items-center justify-center text-lg shrink-0`}>{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-xs text-sage-500">★ {p.rating} · {p.reviews} reviews</p>
                  </div>
                  <span className="font-heading font-bold text-sm text-forest-700">${p.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* low stock */}
          <div className="rounded-2xl bg-white border border-sage-300/50 p-6">
            <h2 className="font-heading font-bold text-lg mb-4">⚠️ Low Stock Alerts</h2>
            {lowStock.length === 0 ? (
              <p className="text-sm text-charcoal-700">Sab stock healthy hai — koi alert nahi. ✅</p>
            ) : (
              <div className="space-y-2">
                {lowStock.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className={`w-9 h-9 rounded-lg bg-gradient-to-br ${p.tint} flex items-center justify-center text-lg shrink-0`}>{p.emoji}</span>
                    <p className="flex-1 text-sm font-semibold truncate">{p.name}</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.stock < 10 ? "bg-red-100 text-red-700" : "bg-cream-200 text-charcoal-700"}`}>
                      {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
