import InfoShell, { Section } from "@/components/InfoShell";

export const metadata = {
  title: "Terms and Conditions",
  description: "Terms of service for using PawFavoritees - orders, payments, accounts, returns and liability.",
};

export default function TermsPage() {
  return (
    <InfoShell
      title="Terms and Conditions 🐾"
      subtitle="By using the PawFavoritees website you agree to these terms."
      updated="November 2026"
    >
      <Section title="1. About These Terms">
        <p>
          PawFavoritees is an online pet supplies store. These terms govern the site&apos;s use, purchases
          and related services between you and PawFavoritees.
        </p>
      </Section>

      <Section title="2. Orders & Pricing">
        <ul className="list-disc pl-6 space-y-2">
          <li>All prices are in USD and applicable sales tax is added at checkout.</li>
          <li>In case of a typo in pricing or product information, we reserve the right to cancel the order.</li>
          <li>An order is accepted when payment is verified and the order status becomes &ldquo;processing&rdquo;.</li>
          <li>Stock availability is not real-time — in an out-of-stock situation a full refund is processed.</li>
        </ul>
      </Section>

      <Section title="3. Payments">
        <p>
          Payments are processed through supported secure gateways. We do not store card details.
          Failed or declined payments mean the order is not processed.
        </p>
      </Section>

      <Section title="4. Shipping & Risk">
        <p>
          Shipping estimates are informational. Risk and title transfer to the customer on delivery,
          in line with the returns policy.
        </p>
      </Section>

      <Section title="5. Returns & Refunds">
        <p>The 30-day return policy is documented in detail on the <a href="/return-policy" className="text-forest-600 underline">Return Policy</a> page, and refunds are processed accordingly.</p>
      </Section>

      <Section title="6. Accounts">
        <ul className="list-disc pl-6 space-y-2">
          <li>You are responsible for the security of your account information.</li>
          <li>Accounts may be suspended for fraud, abuse or violation of these terms.</li>
        </ul>
      </Section>

      <Section title="7. Product Information & Health Disclaimer">
        <p>
          Product descriptions are based on supplier/manufacturer data. No product is a substitute for
          veterinary advice — consult a qualified veterinarian about your pet&apos;s health.
        </p>
      </Section>

      <Section title="8. Intellectual Property">
        <p>The site&apos;s content, branding and design are the property of PawFavoritees — do not reproduce without permission.</p>
      </Section>

      <Section title="9. Limitation of Liability">
        <p>
          To the extent permitted by law, PawFavoritees&apos;s liability shall not exceed your order amount.
        </p>
      </Section>

      <Section title="10. Changes">
        <p>We may update these terms; the updated version will be published on this page.</p>
      </Section>
    </InfoShell>
  );
}
