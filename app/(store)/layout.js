import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Storefront route group — header/footer sirf customer-facing pages par.
// /admin ka apna alag layout hai (app/admin/layout.js).
export default function StoreLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </>
  );
}
