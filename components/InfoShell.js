import Link from "next/link";

// Shared layout for info/legal pages — consistent brand styling.
export default function InfoShell({ title, subtitle, updated, children }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl">{title}</h1>
        {subtitle && <p className="text-charcoal-700 mt-3 max-w-2xl">{subtitle}</p>}
        {updated && <p className="text-xs text-sage-500 mt-2">Last updated: {updated}</p>}
      </header>

      <div className="space-y-8 text-[15px] leading-relaxed text-charcoal-700">{children}</div>

      <div className="mt-14 rounded-2xl bg-sage-100/70 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-heading font-bold text-center sm:text-left">Questions? We reply within 1 business day. 🐾</p>
        <Link href="/contact" className="bg-forest-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-forest-700 transition shrink-0">
          Contact Us
        </Link>
      </div>
    </div>
  );
}

export function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-heading font-bold text-xl text-forest-700 mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
