import Link from "next/link";
import { getAdminOrders, STATUS_STYLES } from "@/lib/adminData";
import OrderStatusEditor from "@/components/admin/OrderStatusEditor";
import PageHeader from "@/components/admin/PageHeader";

export const metadata = { title: "Orders" };

const FILTERS = [["all", "All"], ["paid", "Paid"], ["processing", "Processing"], ["completed", "Completed"], ["refunded", "Refunded"], ["failed", "Failed"]];

export default async function AdminOrdersPage({ searchParams }) {
  const sp = await searchParams;
  const status = sp.status || "all";
  const all = await getAdminOrders();
  const orders = status === "all" ? all : all.filter((o) => o.status === status);
  const total = orders.reduce((n, o) => n + o.total, 0);

  return (
    <div className="p-6 md:p-10">
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} order${orders.length !== 1 ? "s" : ""} · ${status !== "all" ? `${status} — ` : ""}$${total.toFixed(2)} value · Supabase se live`}
      />

      {/* status filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map(([val, label]) => (
          <Link key={val} href={val === "all" ? "/admin/orders" : `/admin/orders?status=${val}`}
            className={`px-4 py-1.5 rounded-full border text-xs font-semibold transition ${
              status === val ? "bg-forest-600 text-white border-forest-600" : "border-sage-300 text-charcoal-700 hover:border-forest-500"
            }`}>
            {label}
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-sage-300/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-sage-100/70 border-b border-sage-300/50">
              <tr className="text-left">
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Order</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Customer</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Date</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Items</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Total</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Status</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-300/40">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-cream-100/50 transition">
                  <td className="px-5 py-3 font-heading font-bold">#{o.id}</td>
                  <td className="px-5 py-3">
                    <p className="font-semibold">{o.customer}</p>
                    <p className="text-xs text-sage-500">{o.email}</p>
                  </td>
                  <td className="px-5 py-3 text-charcoal-700">
                    {new Date(o.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    <span className="text-xs text-sage-500 ml-1">{new Date(o.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>
                  </td>
                  <td className="px-5 py-3 text-charcoal-700">{o.items}</td>
                  <td className="px-5 py-3 font-heading font-bold text-forest-700">${o.total.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <OrderStatusEditor orderNumber={o.id} status={o.status} />
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sage-500">Is status mein koi order nahi.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
