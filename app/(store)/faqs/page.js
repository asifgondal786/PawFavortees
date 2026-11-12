import InfoShell, { Section } from "@/components/InfoShell";

export const metadata = {
  title: "FAQs — Frequently Asked Questions",
  description: "Shipping, returns, payment and product questions answered. PawFavoritees help center.",
};

const FAQS = [
  ["How long does shipping take?", "Orders dispatch within 1 business day. Standard delivery typically takes 3–7 business days depending on your location. Express options are shown at checkout when available."],
  ["When do I get free shipping?", "Qualifying orders ship free — the threshold is shown in your cart with a live progress bar. We periodically run free-shipping promotions on all orders."],
  ["What is your return policy?", "We offer 30-day hassle-free returns on unused items in original packaging. See the full Return Policy page for steps and conditions."],
  ["How can I track my order?", "Once your order ships, you'll receive a confirmation email with a tracking number. You can also use the Track Order page with your order number and email."],
  ["Are your products safe for pets?", "Yes — every product is vetted for materials, safety and durability. Product pages include specifications and usage/safety information where applicable."],
  ["Do you ship outside the USA?", "Currently we focus on the USA market. International shipping may be added later as we grow."],
  ["How do I contact support?", "Use the Contact page form or email support@pawfavoritees.com — we reply within 1 business day."],
  ["Can I change or cancel my order?", "Orders can be changed or cancelled while still in processing. Once shipped, the order follows the returns process instead."],
];

export default function FaqsPage() {
  return (
    <InfoShell
      title="Frequently Asked Questions ❓"
      subtitle="Order se lekar returns tak — sab kuch yahan clear hai."
    >
      <Section title="Help Center">
        <div className="space-y-3">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group rounded-2xl bg-white border border-sage-300/50 overflow-hidden">
              <summary className="cursor-pointer list-none px-5 py-4 font-heading font-bold text-sm flex items-center justify-between hover:bg-cream-100 transition">
                {q}
                <span className="text-forest-600 group-open:rotate-45 transition-transform">＋</span>
              </summary>
              <div className="px-5 pb-4 text-sm leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </Section>
    </InfoShell>
  );
}
