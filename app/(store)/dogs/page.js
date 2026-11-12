import CategoryPage from "@/components/CategoryPage";

export const metadata = {
  title: "Dog Supplies — Beds, Toys, Leashes, Grooming & Food",
  description: "Premium dog supplies: orthopedic beds, tough toys, reflective leashes, grooming gloves and more. Free shipping on qualifying orders.",
};

export default function DogsPage() {
  return (
    <CategoryPage
      category="dogs"
      title="Dog Supplies"
      emoji="🐶"
      tagline="Beds · Toys · Leashes · Grooming · Food"
      intro="Everything a happy dog needs — from orthopedic beds for senior pups to indestructible toys for power chewers. Handpicked, quality-checked, and shipped fast across the USA."
      subcats={["Dog Food", "Dog Toys", "Dog Beds", "Collars & Leashes", "Dog Grooming", "Dog Clothing", "Training Supplies", "Travel Accessories"]}
    />
  );
}
