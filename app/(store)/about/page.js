import Link from "next/link";
import InfoShell, { Section } from "@/components/InfoShell";

export const metadata = {
  title: "About Us — Love Them. Spoil Them.",
  description: "PawFavoritees is a USA-focused pet supplies store built by pet parents, for pet parents. Learn our story, mission and values.",
};

export default function AboutPage() {
  return (
    <InfoShell
      title="About PawFavoritees 🐾"
      subtitle="Love Them. Spoil Them. — ek simple promise jo har product choice ke peeche hai."
    >
      <Section title="Our Story">
        <p>
          PawFavoritees ek USA-targeted pet supplies store hai jo pet parents ke liye pet parents ne banaya hai.
          Hum ne dekha ke quality products dhoondhna ya to mushkil hai ya overpriced — is liye hum ne ek
          curated store banaya jahan har product safety, materials aur durability ke hisab se vetted hota hai.
        </p>
      </Section>

      <Section title="Our Mission">
        <p>
          Humara mission simple hai: har pet parent ko <b>trustworthy, premium-quality aur affordable</b> pet
          products dena — transparent shipping, easy returns aur real customer care ke saath.
        </p>
      </Section>

      <Section title="What Makes Us Different">
        <ul className="list-disc pl-6 space-y-2">
          <li><b>Curated, not crowded:</b> hum sirf wo products list karte hain jo hum khud apne pets ko denge.</li>
          <li><b>Quality checked:</b> materials, safety aur durability har product ke liye verify hoti hai.</li>
          <li><b>Fast USA shipping:</b> qualifying orders par free shipping, 1 business day dispatch.</li>
          <li><b>Easy returns:</b> 30-day hassle-free returns — happy pets ya paisa wapas.</li>
          <li><b>Real support:</b> koi bot nahi, real humans jo pets ke bare mein josh se baat karte hain.</li>
        </ul>
      </Section>

      <Section title="Where We're Headed">
        <p>
          Ye journey abhi shuru ho rahi hai. Aage hum pet profiles, personalized recommendations aur
          educational guides add kar rahe hain taake shopping sirf transaction nahi — ek helpful experience lage.
        </p>
        <p>
          <Link href="/shop" className="text-forest-600 font-semibold hover:underline">Shop the collection →</Link>
        </p>
      </Section>
    </InfoShell>
  );
}
