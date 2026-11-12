import Link from "next/link";

export const metadata = {
  title: "Request a Return",
  description: "Start a return or exchange — 30-day hassle-free returns at PawFavoritees.",
};

// Phase 7+: WooCommerce order lookup + RMA creation API se connect hoga.
export default function ReturnsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl mb-2">Request a Return ↩️</h1>
      <p className="text-charcoal-700 text-sm mb-8">30-day hassle-free returns — RMA request system Phase 7 mein live hoga.</p>

      <div className="rounded-3xl border border-dashed border-sage-300 p-8 md:p-10 text-center">
        <p className="text-5xl mb-4">📦</p>
        <h2 className="font-heading font-bold text-lg">Returns open soon</h2>
        <p className="text-charcoal-700 text-sm mt-2 max-w-md mx-auto">
          Tab tak return request ke liye support@pawfavoritees.com par email karein — order number,
          product aur reason ke saath. Hum 1 business day mein RMA number aur return address share karte hain.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/contact" className="bg-forest-600 text-white font-heading font-bold px-7 py-3 rounded-full hover:bg-forest-700 transition text-sm">
            Contact Support
          </Link>
          <Link href="/return-policy" className="border border-sage-300 text-charcoal-700 font-heading font-bold px-7 py-3 rounded-full hover:border-forest-500 transition text-sm">
            Return Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
