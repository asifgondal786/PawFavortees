import InfoShell, { Section } from "@/components/InfoShell";

export const metadata = {
  title: "Privacy Policy",
  description: "How PawFavoritees collects, uses and protects your personal information - including your privacy choices.",
};

export default function PrivacyPolicyPage() {
  return (
    <InfoShell
      title="Privacy Policy 🐾"
      subtitle="Your privacy matters to us. This policy explains what data we collect and why."
      updated="November 2026"
    >
      <Section title="1. Information We Collect">
        <ul className="list-disc pl-6 space-y-2">
          <li><b>Order information:</b> name, email, phone, shipping/billing address, order details.</li>
          <li><b>Account information:</b> email, password (hashed — never stored in plain text).</li>
          <li><b>Usage data:</b> pages visited, products viewed — in aggregated form, for site improvement.</li>
          <li><b>Local storage:</b> cart and wishlist are stored in your browser, not on our servers (unless synced with an account).</li>
        </ul>
      </Section>

      <Section title="2. How We Use Information">
        <ul className="list-disc pl-6 space-y-2">
          <li>To process, ship and track orders.</li>
          <li>To provide customer support.</li>
          <li>For security, fraud prevention and legal compliance.</li>
          <li>Marketing emails — <b>only with your consent</b>, with an unsubscribe link in every email.</li>
        </ul>
      </Section>

      <Section title="3. What We Never Do">
        <ul className="list-disc pl-6 space-y-2">
          <li>Store card details — payments are processed through the gateway&apos;s tokenized/secure flow.</li>
          <li>Sell your personal data.</li>
          <li>Send marketing emails without consent (CAN-SPAM compliant).</li>
        </ul>
      </Section>

      <Section title="4. Sharing With Service Providers">
        <p>
          To fulfil orders we share data with: payment processor, shipping carriers and
          our email service provider — only the information necessary for the job.
        </p>
      </Section>

      <Section title="5. Your Privacy Choices">
        <ul className="list-disc pl-6 space-y-2">
          <li><b>Access &amp; correction:</b> view and update your information in account settings.</li>
          <li><b>Deletion:</b> request account deletion at support@pawfavoritees.com.</li>
          <li><b>Marketing opt-out:</b> via the unsubscribe link in any email, or through the Contact page.</li>
          <li><b>California residents:</b> under CCPA/CPRA you have the right to access, deletion and opt-out — requests by email.</li>
        </ul>
      </Section>

      <Section title="6. Data Security &amp; Retention">
        <p>
          HTTPS encryption, server-side secrets, role-based access and regular backups are our baseline
          security practices. Data is retained only as long as necessary for legal/account purposes.
        </p>
      </Section>

      <Section title="7. Children's Privacy">
        <p>The site is intended for users 18+. We do not knowingly collect data from children under 13.</p>
      </Section>

      <Section title="8. Changes to This Policy">
        <p>Any material change will be published here and the &ldquo;Last updated&rdquo; date will be refreshed.</p>
      </Section>
    </InfoShell>
  );
}
