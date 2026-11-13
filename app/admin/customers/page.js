import { ADMIN_CUSTOMERS } from "@/lib/adminData";
import PageHeader from "@/components/admin/PageHeader";

export const metadata = { title: "Customers" };

export default function AdminCustomersPage() {
  const totalSpent = ADMIN_CUSTOMERS.reduce((n, c) => n + c.spent, 0);

  return (
    <div className="p-6 md:p-10">
      <PageHeader
        title="Customers"
        subtitle={`${ADMIN_CUSTOMERS.length} customers · $${totalSpent.toFixed(2)} lifetime value · Demo data — Phase 7: Supabase auth users se sync hoga`}
      />

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          ["Total Customers", ADMIN_CUSTOMERS.length, "👥"],
          ["Lifetime Value", `$${totalSpent.toFixed(0)}`, "💵"],
          ["Avg per Customer", `$${(totalSpent / ADMIN_CUSTOMERS.length).toFixed(2)}`, "📈"],
        ].map(([label, value, icon]) => (
          <div key={label} className="rounded-2xl bg-white border border-sage-300/50 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">{label}</span>
              <span className="text-xl">{icon}</span>
            </div>
            <p className="font-heading font-extrabold text-3xl text-forest-700 mt-2">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-sage-300/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-sage-100/70 border-b border-sage-300/50">
              <tr className="text-left">
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Customer</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Location</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Orders</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Total Spent</th>
                <th className="px-5 py-3 text-[10.5px] font-bold text-sage-500 uppercase tracking-[0.12em]">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-300/40">
              {ADMIN_CUSTOMERS.slice().sort((a, b) => b.spent - a.spent).map((c) => (
                <tr key={c.email} className="hover:bg-cream-100/50 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-sage-100 text-forest-700 flex items-center justify-center font-heading font-bold text-xs shrink-0">
                        {c.name.split(" ").map((w) => w[0]).join("")}
                      </span>
                      <div>
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-xs text-sage-500">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-charcoal-700">{c.location}</td>
                  <td className="px-5 py-3 text-charcoal-700">{c.orders}</td>
                  <td className="px-5 py-3 font-heading font-bold text-forest-700">${c.spent.toFixed(2)}</td>
                  <td className="px-5 py-3 text-charcoal-700">{new Date(c.joined).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
