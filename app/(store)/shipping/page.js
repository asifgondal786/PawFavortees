import InfoShell, { Section } from "@/components/InfoShell";

export const metadata = {
  title: "Shipping Information",
  description: "Shipping methods, delivery times, costs and tracking — everything about PawFavoritees shipping.",
};

export default function ShippingPage() {
  return (
    <InfoShell
      title="Shipping Information 🚚"
      subtitle="Transparent shipping — koi hidden fees nahi, koi surprises nahi."
      updated="November 2026"
    >
      <Section title="Shipping Options & Times">
        <div className="overflow-hidden rounded-2xl border border-sage-300/60">
          <table className="w-full text-sm">
            <thead className="bg-sage-100/70">
              <tr>
                <th className="text-left px-5 py-3 font-heading">Method</th>
                <th className="text-left px-5 py-3 font-heading">Delivery Time</th>
                <th className="text-left px-5 py-3 font-heading">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-300/40">
              <tr><td className="px-5 py-3">Standard</td><td className="px-5 py-3">3–7 business days</td><td className="px-5 py-3">Flat rate — or FREE on qualifying orders</td></tr>
              <tr><td className="px-5 py-3">Express</td><td className="px-5 py-3">1–3 business days</td><td className="px-5 py-3">Calculated at checkout</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm">Orders dispatch within <b>1 business day</b> (Mon–Fri, excluding US federal holidays).</p>
      </Section>

      <Section title="Where We Ship">
        <p>We currently ship to all 50 US states. International shipping is planned for a later phase.</p>
      </Section>

      <Section title="Tracking Your Order">
        <p>
          Shipping ke baad aap ko email mein tracking number milta hai. Order number aur email se
          <a href="/track-order" className="text-forest-600 underline"> Track Order</a> page par bhi status dekh sakte hain.
        </p>
      </Section>

      <Section title="Damaged, Lost or Delayed Packages">
        <ul className="list-disc pl-6 space-y-2">
          <li><b>Damaged on arrival:</b> photo ke saath 48 hours ke andar contact karein — replacement ya refund turant process hoga.</li>
          <li><b>Lost in transit:</b> tracking 10 business days tak update na ho to hum replacement ship karte hain ya full refund dete hain.</li>
          <li><b>Delayed:</b> carrier delays ki soorat mein hum carrier ke saath follow-up kar ke aap ko update karte hain.</li>
        </ul>
      </Section>

      <Section title="Shipping Costs & Taxes">
        <p>
          Shipping cost aur estimated sales tax checkout par transparently show hoti hai — final amount
          confirm karne se pehle, order place karne ke baad nahi.
        </p>
      </Section>
    </InfoShell>
  );
}
