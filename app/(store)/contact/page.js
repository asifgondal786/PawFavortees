import InfoShell, { Section } from "@/components/InfoShell";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us",
  description: "Questions about an order, shipping, returns or products? Contact the PawFavoritees team — we reply within 1 business day.",
};

export default function ContactPage() {
  return (
    <InfoShell
      title="Contact Us 💬"
      subtitle="Real humans, real answers — 7 days a week."
    >
      <Section title="Get in Touch">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white border border-sage-300/50 p-5">
            <div className="text-2xl mb-2">📧</div>
            <h3 className="font-heading font-bold text-sm">Email</h3>
            <p className="text-sm mt-1">support@pawfavoritees.com</p>
          </div>
          <div className="rounded-2xl bg-white border border-sage-300/50 p-5">
            <div className="text-2xl mb-2">🕐</div>
            <h3 className="font-heading font-bold text-sm">Hours</h3>
            <p className="text-sm mt-1">Mon–Sun, 9am–6pm (ET)</p>
          </div>
          <div className="rounded-2xl bg-white border border-sage-300/50 p-5">
            <div className="text-2xl mb-2">📍</div>
            <h3 className="font-heading font-bold text-sm">Returns</h3>
            <p className="text-sm mt-1">US return address — see <a href="/return-policy" className="text-forest-600 underline">Return Policy</a></p>
          </div>
        </div>
      </Section>

      <Section title="Send Us a Message">
        <ContactForm />
      </Section>
    </InfoShell>
  );
}
