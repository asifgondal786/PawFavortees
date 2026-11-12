import Link from "next/link";

const COLS = [
  {
    title: "Shop",
    links: [
      ["All Products", "/shop"], ["Dogs", "/shop?category=dogs"], ["Cats", "/shop?category=cats"],
      ["Best Sellers", "/shop?sort=rating"], ["New Arrivals", "/shop?sort=latest"],
    ],
  },
  {
    title: "Help",
    links: [["Contact Us", "/contact"], ["FAQs", "/faqs"], ["Shipping", "/shipping"], ["Track Order", "/track-order"], ["Returns", "/returns"]],
  },
  {
    title: "Company",
    links: [["About Us", "/about"], ["Our Mission", "/about"], ["Privacy Policy", "/privacy-policy"], ["Terms", "/terms"], ["Blog", "/blog"], ["Admin Dashboard", "/admin"]],
  },
];

export default function Footer() {
  return (
    <footer className="bg-forest-800 text-cream-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🐾</span>
            <span className="font-heading font-extrabold text-lg">PawFavoritees</span>
          </div>
          <p className="text-sm text-cream-100/70">Love Them. Spoil Them.<br />Your pet&apos;s happy place.</p>
          <p className="text-xs text-cream-100/50 mt-4">© {new Date().getFullYear()} PawFavoritees. All rights reserved.</p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h4 className="font-heading font-bold mb-3 text-cream-200">{c.title}</h4>
            <ul className="space-y-2 text-sm text-cream-100/70">
              {c.links.map(([label, href]) => (
                <li key={label}><Link href={href} className="hover:text-cream-100 transition">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
