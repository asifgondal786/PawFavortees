import { ADMIN_CUSTOMERS } from "@/lib/adminData";

export const metadata = { title: "Customers" };

export default function AdminCustomersPage() {
  const totalSpent = ADMIN_CUSTOMERS.reduce((n, c) => n + c.spent, 0);

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl">Customers</h1>
      <p className="text-charcoal-700 text-sm mt-1 mb-8">
        {ADMIN_CUSTOMERS.length} customers · ${totalSpent.toFixed(2)} lifetime value · Phase 7: WooCommerce customers se sync hoga
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl bg-white border border-sage-300/50 p-5">
          <span className="text-xs font-semibold text-sage-500 uppercase tracking-wide">Total Customers</span>
          <p className="font-heading font-extrabold text-3xl text-forest-700 mt-2">{ADMIN_CUSTOMERS.length}</p>
        </div>
        <div className="rounded-2xl bg-white border border-sage-300/50 p-5">
          <span className="text-xs font-semibold text-sage-500 uppercase tracking-wide">Lifetime Value</span>
          <p className="font-heading font-extrabold text-3xl text-forest-700 mt-2">${totalSpent.toFixed(0)}</p>
        </div>
        <div className="rounded-2xl bg-white border border-sage-300/50 p-5">
          <span className="text-xs font-semibold text-sage-500 uppercase tracking-wide">Avg per Customer</span>
          <p className="font-heading font-extrabold text-3xl text-forest-700 mt-2">${(totalSpent / ADMIN_CUSTOMERS.length).toFixed(2)}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-sage-300/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-sage-100/70">
              <tr className="text-left">
                <th className="px-5 py-3 font-heading">Customer</th>
                <th className="px-5 py-3 font-heading">Location</th>
                <th className="px-5 py-3 font-heading">Orders</th>
                <th className="px-5 py-3 font-heading">Total Spent</th>
                <th className="px-5 py-3 font-heading">Joined</th>
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
