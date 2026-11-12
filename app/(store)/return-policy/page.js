import InfoShell, { Section } from "@/components/InfoShell";

export const metadata = {
  title: "Return & Refund Policy",
  description: "30-day hassle-free returns. How to request a return, refund timelines and conditions at PawFavoritees.",
};

export default function ReturnPolicyPage() {
  return (
    <InfoShell
      title="Return & Refund Policy ↩️"
      subtitle="30-day hassle-free returns. Happy pets — ya paisa wapas."
      updated="November 2026"
    >
      <Section title="Return Window">
        <p>
          Delivery ke <b>30 din</b> ke andar unused, original packaging wale items return kar sakte hain.
          Kash koosi items ke liye koi questions nahi — bas reason batayein, RMA number jari hoga.
        </p>
      </Section>

      <Section title="How to Start a Return">
        <ol className="list-decimal pl-6 space-y-2">
          <li><a href="/contact" className="text-forest-600 underline">Contact page</a> se ya support@pawfavoritees.com par request bhejein — order number aur reason ke saath.</li>
          <li>Hum 1 business day mein RMA number aur US return address share karenge.</li>
          <li>Item securely pack kar ke trackable shipping se bhejein.</li>
          <li>Item receive + inspect hone ke baad refund process hota hai.</li>
        </ol>
      </Section>

      <Section title="Refunds">
        <ul className="list-disc pl-6 space-y-2">
          <li>Refund original payment method par process hota hai (5–10 business days).</li>
          <li>Original shipping charges non-refundable hain, except damaged/wrong item cases.</li>
          <li>Damaged ya defective items par return shipping ka kharcha bhi hum uthate hain.</li>
        </ul>
      </Section>

      <Section title="Non-Returnable Items">
        <ul className="list-disc pl-6 space-y-2">
          <li>Opened food, treats ya consumables (safety reasons).</li>
          <li>Gift cards (jab launch hon).</li>
          <li>Final-sale/clearance items — product page par clearly marked.</li>
        </ul>
      </Section>

      <Section title="Damaged or Wrong Item?">
        <p>
          Delivery ke <b>48 hours</b> ke andar photos ke saath contact karein — replacement ya full refund,
          dono options ke saath hum turant process karte hain.
        </p>
      </Section>
    </InfoShell>
  );
}
