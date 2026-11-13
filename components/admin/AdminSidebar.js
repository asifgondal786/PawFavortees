"use client";
// Admin chrome — desktop sidebar + mobile bottom nav (pathname-aware active states).
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "▦", exact: true },
  { href: "/admin/orders", label: "Orders", icon: "▤" },
  { href: "/admin/products", label: "Products", icon: "◈" },
  { href: "/admin/customers", label: "Customers", icon: "◉" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

function isActive(pathname, item) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-forest-900 text-cream-100 sticky top-0 h-screen border-r border-black/20">
      {/* brand */}
      <div className="px-5 py-5 border-b border-cream-100/10">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <span className="text-2xl group-hover:scale-110 transition-transform">🐾</span>
          <div className="leading-tight">
            <span className="font-heading font-extrabold text-[15px] tracking-tight text-cream-50 block">PawFavoritees</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-cream-100/50 font-semibold">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* main nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-cream-100/35">Store Management</p>
        <ul className="space-y-0.5">
          {NAV.map((n) => {
            const active = isActive(pathname, n);
            return (
              <li key={n.href}>
                <Link href={n.href} aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all ${
                    active
                      ? "bg-forest-600 text-white shadow-sm"
                      : "text-cream-100/65 hover:text-cream-100 hover:bg-cream-100/10"
                  }`}>
                  <span className={`text-[15px] w-5 text-center shrink-0 ${active ? "opacity-100" : "opacity-70"}`}>{n.icon}</span>
                  {n.label}
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cream-100" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* footer */}
      <div className="px-3 py-4 border-t border-cream-100/10 space-y-1">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-cream-100/60 hover:text-cream-100 hover:bg-cream-100/10 transition">
          <span className="text-[15px] w-5 text-center opacity-70">↗</span> View Storefront
        </Link>
        <p className="px-3 pt-2 text-[10px] leading-relaxed text-cream-100/35">
          Data: Supabase (live) · Phase 6: WooCommerce sync
        </p>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-forest-900 border-t border-black/20 flex text-cream-100">
      {NAV.map((n) => {
        const active = isActive(pathname, n);
        return (
          <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 ${active ? "bg-forest-600" : "hover:bg-cream-100/10"} transition-colors`}>
            <span className={`text-base ${active ? "opacity-100" : "opacity-75"}`}>{n.icon}</span>
            <span className={`text-[9.5px] font-semibold tracking-wide ${active ? "text-white" : "text-cream-100/70"}`}>{n.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
