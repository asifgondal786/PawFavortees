import InfoShell, { Section } from "@/components/InfoShell";

export const metadata = {
  title: "Privacy Policy",
  description: "How PawFavoritees collects, uses and protects your personal information — including your privacy choices.",
};

export default function PrivacyPolicyPage() {
  return (
    <InfoShell
      title="Privacy Policy 🔒"
      subtitle="Aap ki privacy humare liye seriously matter karti hai. Ye policy batati hai hum kya data collect karte hain aur kyun."
      updated="November 2026"
    >
      <Section title="1. Information We Collect">
        <ul className="list-disc pl-6 space-y-2">
          <li><b>Order information:</b> name, email, phone, shipping/billing address, order details.</li>
          <li><b>Account information:</b> email, password (hashed — kabhi plain text store nahi hota).</li>
          <li><b>Usage data:</b> pages visited, products viewed — site improvement ke liye, aggregated form mein.</li>
          <li><b>Local storage:</b> cart aur wishlist aap ke browser mein store hote hain, humare servers pe nahi (jab tak account se sync na ho).</li>
        </ul>
      </Section>

      <Section title="2. How We Use Information">
        <ul className="list-disc pl-6 space-y-2">
          <li>Orders process, ship aur track karne ke liye.</li>
          <li>Customer support provide karne ke liye.</li>
          <li>Security, fraud prevention aur legal compliance ke liye.</li>
          <li>Marketing emails — <b>sirf aap ki consent par</b>, unsubscribe link har email mein.</li>
        </ul>
      </Section>

      <Section title="3. What We Never Do">
        <ul className="list-disc pl-6 space-y-2">
          <li>Card details store karna — payments gateway ke tokenized/secure flow se process hoti hain.</li>
          <li>Aap ka personal data sell karna.</li>
          <li>BinA bin k consents ke baghair marketing emails bhejna (CAN-SPAM compliant).</li>
        </ul>
      </Section>

      <Section title="4. Sharing With Service Providers">
        <p>
          Order fulfilment ke liye hum data share karte hain: payment processor, shipping carriers aur
          email service provider — sirf itni information jitni kaam ke liye zaroori hai.
        </p>
      </Section>

      <Section title="5. Your Privacy Choices">
        <ul className="list-disc pl-6 space-y-2">
          <li><b>Access &amp; correction:</b> account settings se apni information dekh aur update kar sakte hain.</li>
          <li><b>Deletion:</b> account deletion request support@pawfavoritees.com par.</li>
          <li><b>Marketing opt-out:</b> kisi bhi email ke unsubscribe link se, ya Contact page se.</li>
          <li><b>California residents:</b> CCPA/CPRA rights ke tihat access, deletion aur opt-out ke haq hain — requests email par.</li>
        </ul>
      </Section>

      <Section title="6. Data Security &amp; Retention">
        <p>
          HTTPS encryption, server-side secrets, role-based access aur regular backups humari baseline
          security practices hain. Data utne hi time tak retain hota hai jitna legal/account purposes ke liye zaroori ho.
        </p>
      </Section>

      <Section title="7. Children's Privacy">
        <p>Site 18+ users ke liye hai. Hum jaan-boojh kar 13 se kam umar ke bachon ka data collect nahi karte.</p>
      </Section>

      <Section title="8. Changes to This Policy">
        <p>Koi bhi material change yahan publish hoga aur &ldquo;Last updated&rdquo; date update ki jayegi.</p>
      </Section>
    </InfoShell>
  );
}
