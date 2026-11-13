import { AdminSidebar, AdminMobileNav } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: { default: "Admin — PawFavoritees", template: "%s | PawFavoritees Admin" },
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-cream-50">
      <AdminSidebar />
      <AdminMobileNav />
      {/* content */}
      <div className="flex-1 min-w-0 pb-20 md:pb-0">
        {children}
      </div>
    </div>
  );
}
