"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/store";

export default function AddToCart({ product }) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="mt-7">
      <div className="flex gap-3 items-stretch">
        <div className="flex items-center border border-sage-300 rounded-full overflow-hidden">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 text-lg hover:bg-sage-100 transition">−</button>
          <span className="w-10 text-center font-semibold">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="px-4 py-3 text-lg hover:bg-sage-100 transition">+</button>
        </div>
        <button onClick={onAdd}
          className="flex-1 bg-forest-600 text-white font-heading font-bold px-8 rounded-full hover:bg-forest-700 transition">
          Add to Cart 🛒
        </button>
      </div>
      <div className="mt-3 flex items-center gap-3">
        {added ? (
          <span className="text-sm text-forest-700 font-semibold">✓ Added to cart!</span>
        ) : (
          <Link href="/cart" className="text-sm text-forest-600 font-semibold hover:underline">Go to cart →</Link>
        )}
      </div>
    </div>
  );
}
