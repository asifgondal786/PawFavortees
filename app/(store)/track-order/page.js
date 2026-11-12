import Link from "next/link";

export const metadata = {
  title: "Track Order",
  description: "Track your PawFavoritees order with your order number and email.",
};

// Phase 7+: WooCommerce order lookup API se connect hoga (order number + email verification).
export default function TrackOrderPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl mb-2">Track Your Order 📦</h1>
      <p className="text-charcoal-700 text-sm mb-8">Order number aur email daal kar apni shipment ka status dekhein.</p>

      <div className="rounded-3xl border border-dashed border-sage-300 p-8 md:p-10 text-center">
        <p className="text-5xl mb-4">🚚</p>
        <h2 className="font-heading font-bold text-lg">Coming with Phase 7</h2>
        <p className="text-charcoal-700 text-sm mt-2 max-w-md mx-auto">
          Live order tracking WooCommerce Store API se connect hoga jab backend integration hogi.
          Abhi ke liye shipping confirmation email mein tracking number milta hai.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/contact" className="bg-forest-600 text-white font-heading font-bold px-7 py-3 rounded-full hover:bg-forest-700 transition text-sm">
            Ask About My Order
          </Link>
          <Link href="/shipping" className="border border-sage-300 text-charcoal-700 font-heading font-bold px-7 py-3 rounded-full hover:border-forest-500 transition text-sm">
            Shipping Info
          </Link>
        </div>
      </div>
    </div>
  );
}
