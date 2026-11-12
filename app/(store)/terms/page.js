import InfoShell, { Section } from "@/components/InfoShell";

export const metadata = {
  title: "Terms and Conditions",
  description: "Terms of service for using PawFavoritees — orders, payments, accounts, returns and liability.",
};

export default function TermsPage() {
  return (
    <InfoShell
      title="Terms and Conditions 📋"
      subtitle="PawFavoritees website use karne se aap in terms se agree karte hain."
      updated="November 2026"
    >
      <Section title="1. About These Terms">
        <p>
          PawFavoritees ek online pet supplies store hai. Ye terms aap aur PawFavoritees ke darmiyan
          site ke use, purchases aur related services ko govern karte hain.
        </p>
      </Section>

      <Section title="2. Orders & Pricing">
        <ul className="list-disc pl-6 space-y-2">
          <li>Saari prices USD mein hain aur applicable sales tax checkout par add hoti hai.</li>
          <li>Pricing ya product information ki typo ki soorat mein hum order cancel karne ka haq rakhte hain.</li>
          <li>Order acceptance tab hota hai jab payment verify aur order status &ldquo;processing&rdquo; ho jaye.</li>
          <li>Stock availability real-time nahi hoti — out-of-stock situation mein full refund process hota hai.</li>
        </ul>
      </Section>

      <Section title="3. Payments">
        <p>
          Payments supported secure gateways ke through process hoti hain. Hum card details store nahi
          karte. Failed ya declined payments ke liye order process nahi hota.
        </p>
      </Section>

      <Section title="4. Shipping & Risk">
        <p>
          Shipping estimate informational hai. Risk aur title delivery par customer ko transfer hota hai,
          returns policy ke mutabiq.
        </p>
      </Section>

      <Section title="5. Returns & Refunds">
        <p>30-day return policy <a href="/return-policy" className="text-forest-600 underline">Return Policy</a> page par detail se document ki gayi hai aur isi ke tihat refunds process hote hain.</p>
      </Section>

      <Section title="6. Accounts">
        <ul className="list-disc pl-6 space-y-2">
          <li>Aap account information ki security ke liye responsible hain.</li>
          <li>Fraud, abuse ya terms ki violation par account suspend ho sakta hai.</li>
        </ul>
      </Section>

      <Section title="7. Product Information & Health Disclaimer">
        <p>
          Product descriptions supplier/manufacturer data par based hain. Koi bhi product veterinary
          advice ka substitute nahi hai — pet ki health ke mamlaat mein qualified veterinarian se consult karein.
        </p>
      </Section>

      <Section title="8. Intellectual Property">
        <p>Site ka content, branding aur design PawFavoritees ki property hai — bina permission reproduce nahi karein.</p>
      </Section>

      <Section title="9. Limitation of Liability">
        <p>
          Qanoon ke injaaz ke darmiyan, PawFavoritees ki liability aap ke order amount se zyada nahi hogi.
        </p>
      </Section>

      <Section title="10. Changes">
        <p>Hum in terms ko update kar sakte hain; updated version isi page par publish hoga.</p>
      </Section>
    </InfoShell>
  );
}
