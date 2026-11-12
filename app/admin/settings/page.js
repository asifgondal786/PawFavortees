import Link from "next/link";

export const metadata = { title: "Settings" };

export default function AdminSettingsPage() {
  const checklist = [
    ["WooCommerce hosting & domain", "User se pending — milte hi WordPress + WooCommerce install hoga", false],
    ["Store API connection (customer-facing)", "WooCommerceProvider likha jayega — same provider interface", false],
    ["REST API keys (.env server-side)", "lib/woocommerce.js ready hai — sirf WOO_STORE_URL + keys bharne hain", false],
    ["Payment gateway selection", "Business registration country pehle lock hogi (WooPayments Pakistan se eligible nahi)", false],
    ["Gateway headless compatibility proof", "Store API / Checkout Block support verify hoga", false],
    ["Real product/inventory sync", "Mock data → WooCommerce catalog migration", false],
    ["Email service (Resend/SMTP)", "Order confirmation + marketing emails", false],
  ];

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <h1 className="text-3xl">Settings</h1>
      <p className="text-charcoal-700 text-sm mt-1 mb-8">Store configuration — abhi demo mode, Phase 6/7 mein live settings.</p>

      <div className="rounded-2xl bg-white border border-sage-300/50 p-6 mb-6">
        <h2 className="font-heading font-bold text-lg mb-4">🚀 Go-Live Checklist</h2>
        <div className="space-y-3">
          {checklist.map(([task, note, done]) => (
            <div key={task} className="flex items-start gap-3 rounded-xl border border-sage-300/40 px-4 py-3">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${done ? "bg-forest-600 text-white" : "bg-cream-200 text-sage-500"}`}>
                {done ? "✓" : ""}
              </span>
              <div>
                <p className="text-sm font-semibold">{task}</p>
                <p className="text-xs text-sage-500">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-sage-300/50 p-6 mb-6">
        <h2 className="font-heading font-bold text-lg mb-3">🏪 Store Defaults (demo)</h2>
        <dl className="text-sm divide-y divide-sage-300/40">
          {[["Store Name", "PawFavoritees"], ["Tagline", "Love Them. Spoil Them."], ["Currency", "USD ($)"], ["Language", "English (US)"], ["Categories", "Dogs, Cats (all-pets ready)"], ["Free Shipping Threshold", "$49.00"], ["Est. Tax Rate", "8% (demo — production: state-wise)"], ["WooCommerce SDK", "✅ Installed (@woocommerce/woocommerce-rest-api)"]].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2.5">
              <dt className="text-sage-500">{k}</dt>
              <dd className="font-semibold text-charcoal-700 text-right">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-forest-600 to-forest-700 text-cream-50 p-6">
        <h2 className="font-heading font-bold text-lg mb-2">Next: Hosting Integration 🔌</h2>
        <p className="text-sm text-cream-100/85">
          Domain + hosting milte hi: WordPress/WooCommerce install → provider swap → gateway compatibility proof →
          real checkout. Koi page/component refactor nahi hoga — sirf <b>lib/provider.js</b> aur <b>lib/woocommerce.js</b> ka kaam.
        </p>
        <Link href="/contact" className="inline-block mt-4 bg-cream-50 text-forest-700 text-sm font-heading font-bold px-5 py-2.5 rounded-full hover:bg-cream-100 transition">
          Questions? Contact Page
        </Link>
      </div>
    </div>
  );
}
