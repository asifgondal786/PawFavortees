import Link from "next/link";

export const metadata = {
  title: "Blog — Pet Care Guides & Articles",
  description: "Pet care tips, buying guides and new pet parent resources from PawFavoritees.",
};

export default function BlogPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl mb-2">The PawPrint Blog 🐾</h1>
      <p className="text-charcoal-700 text-sm mb-8">Pet care guides, buying guides aur new pet parent resources.</p>

      <div className="rounded-3xl border border-dashed border-sage-300 p-8 md:p-10 text-center">
        <p className="text-5xl mb-4">✍️</p>
        <h2 className="font-heading font-bold text-lg">First articles coming soon</h2>
        <p className="text-charcoal-700 text-sm mt-2 max-w-md mx-auto">
          Launch ke saath hum publish kar rahe hain: &ldquo;New Puppy Checklist&rdquo;, &ldquo;Choosing the Right
          Dog Bed&rdquo; aur &ldquo;Cat Nutrition 101&rdquo;. Facts verified — koi fluff nahi (pun intended).
        </p>
        <Link href="/shop" className="inline-block mt-6 bg-forest-600 text-white font-heading font-bold px-7 py-3 rounded-full hover:bg-forest-700 transition text-sm">
          Shop While You Wait
        </Link>
      </div>
    </div>
  );
}
