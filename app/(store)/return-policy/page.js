import InfoShell, { Section } from "@/components/InfoShell";

export const metadata = {
  title: "Return & Refund Policy",
  description: "30-day hassle-free returns. How to request a return, refund timelines and conditions at PawFavoritees.",
};

export default function ReturnPolicyPage() {
  return (
    <InfoShell
      title="Return & Refund Policy 🐾"
      subtitle="30-day hassle-free returns. A happy pet — or your money back."
      updated="November 2026"
    >
      <Section title="Return Window">
        <p>
          Items can be returned within <b>30 days</b> of delivery if unused and in original packaging.
          There are no questions asked for eligible items — just tell us the reason and an RMA number will be issued.
        </p>
      </Section>

      <Section title="How to Start a Return">
        <ol className="list-decimal pl-6 space-y-2">
          <li>Send a request via the <a href="/contact" className="text-forest-600 underline">Contact page</a> or at support@pawfavoritees.com — with your order number and reason.</li>
          <li>We will share an RMA number and US return address within 1 business day.</li>
          <li>Pack the item securely and ship it with trackable shipping.</li>
          <li>Once the item is received and inspected, the refund is processed.</li>
        </ol>
      </Section>

      <Section title="Refunds">
        <ul className="list-disc pl-6 space-y-2">
          <li>Refunds are processed to the original payment method (5-10 business days).</li>
          <li>Original shipping charges are non-refundable, except for damaged/wrong item cases.</li>
          <li>For damaged or defective items, we also cover the return shipping cost.</li>
        </ul>
      </Section>

      <Section title="Non-Returnable Items">
        <ul className="list-disc pl-6 space-y-2">
          <li>Opened food, treats or consumables (for safety reasons).</li>
          <li>Gift cards (when they launch).</li>
          <li>Final-sale/clearance items — clearly marked on the product page.</li>
        </ul>
      </Section>

      <Section title="Damaged or Wrong Item?">
        <p>
          Contact us within <b>48 hours</b> of delivery with photos — we process a replacement or full refund
          right away, with both options available to you.
        </p>
      </Section>
    </InfoShell>
  );
}
