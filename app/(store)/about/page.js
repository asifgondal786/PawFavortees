import Link from "next/link";
import InfoShell, { Section } from "@/components/InfoShell";

export const metadata = {
  title: "About Us - Love Them. Spoil Them.",
  description: "PawFavoritees is a USA-focused pet supplies store built by pet parents, for pet parents. Learn our story, mission and values.",
};

export default function AboutPage() {
  return (
    <InfoShell
      title="About PawFavoritees 🐾"
      subtitle="Love Them. Spoil Them. — a simple promise behind every product we choose."
    >
      <Section title="Our Story">
        <p>
          PawFavoritees is a USA-focused pet supplies store built by pet parents, for pet parents.
          We saw that finding quality products is either hard or overpriced — so we created a curated
          store where every product is vetted for safety, materials, and durability.
        </p>
      </Section>

      <Section title="Our Mission">
        <p>
          Our mission is simple: give every pet parent <b>trustworthy, premium-quality, and affordable</b> pet
          products — with transparent shipping, easy returns, and real customer care.
        </p>
      </Section>

      <Section title="What Makes Us Different">
        <ul className="list-disc pl-6 space-y-2">
          <li><b>Curated, not crowded:</b> we only list products we would give to our own pets.</li>
          <li><b>Quality checked:</b> materials, safety, and durability are verified for every product.</li>
          <li><b>Fast USA shipping:</b> free shipping on qualifying orders, dispatched within 1 business day.</li>
          <li><b>Easy returns:</b> 30-day hassle-free returns — a happy pet or your money back.</li>
          <li><b>Real support:</b> no bots — real humans who love talking about pets.</li>
        </ul>
      </Section>

      <Section title="Where We're Headed">
        <p>
          This journey is just beginning. Next up: pet profiles, personalized recommendations, and
          educational guides — so shopping feels less like a transaction and more like a helpful experience.
        </p>
        <p>
          <Link href="/shop" className="text-forest-600 font-semibold hover:underline">Shop the collection →</Link>
        </p>
      </Section>
    </InfoShell>
  );
}
