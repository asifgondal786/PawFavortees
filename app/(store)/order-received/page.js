import { Suspense } from "react";
import OrderDetails from "@/components/OrderDetails";

export const metadata = {
  title: "Order Received",
  description: "Your PawFavoritees order confirmation.",
};

export default function OrderReceivedPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-16 text-center text-sage-500">Loading order…</div>}>
      <OrderDetails />
    </Suspense>
  );
}
