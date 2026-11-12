import CategoryPage from "@/components/CategoryPage";

export const metadata = {
  title: "Cat Supplies — Trees, Toys, Food & Litter",
  description: "Cat trees, interactive toys, grain-free food, odor-lock litter and more. Spoil your cat with premium supplies, shipped free on qualifying orders.",
};

export default function CatsPage() {
  return (
    <CategoryPage
      category="cats"
      title="Cat Supplies"
      emoji="🐱"
      tagline="Trees · Toys · Food · Litter · Grooming"
      intro="For the pickiest family members. Climb-worthy towers, engaging toys, quality nutrition and litter that actually keeps things fresh."
      subcats={["Cat Food", "Cat Toys", "Cat Beds", "Cat Litter", "Scratching Posts", "Cat Grooming", "Carriers", "Feeding Accessories"]}
    />
  );
}
