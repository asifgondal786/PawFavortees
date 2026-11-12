import Link from "next/link";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/orders", label: "Orders", icon: "🧾" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export const metadata = {
  title: { default: "Admin — PawFavoritees", template: "%s | PawFavoritees Admin" },
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-forest-900 text-cream-100 sticky top-0 h-screen">
        <div className="px-5 py-6 border-b border-cream-100/10">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <div>
              <span className="font-heading font-extrabold block leading-tight">PawFavoritees</span>
              <span className="text-[10px] uppercase tracking-widest text-sand-300 font-bold">Admin Panel</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-cream-100/80 hover:bg-cream-100/10 hover:text-cream-100 transition">
              <span className="text-base">{n.icon}</span> {n.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-cream-100/10 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-cream-100/60 hover:bg-cream-100/10 transition">
            🏬 View Storefront
          </Link>
          <div className="px-4 py-2 text-[10px] text-cream-100/40">
            Demo mode · Phase 6: WooCommerce admin se replace hoga
          </div>
        </div>
      </aside>

      {/* mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-forest-900 text-cream-100 flex">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold hover:bg-cream-100/10">
            <span className="text-base">{n.icon}</span>{n.label}
          </Link>
        ))}
      </div>

      {/* content */}
      <div className="flex-1 min-w-0 bg-cream-50 pb-20 md:pb-0">
        {children}
      </div>
    </div>
  );
}
