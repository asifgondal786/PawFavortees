"use client";
import Link from "next/link";
import { useCart } from "@/lib/store";

export default function CartPage() {
  const { items, remove, setQty, clear } = useCart();
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const FREE_SHIP = 49;
  const progress = Math.min(100, (subtotal / FREE_SHIP) * 100);
  const remaining = Math.max(0, FREE_SHIP - subtotal);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl mb-8">Your Cart 🛒</h1>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-sage-300 p-12 text-center">
          <p className="text-5xl mb-4">🐾</p>
          <h2 className="font-heading font-bold text-xl">Your cart is empty</h2>
          <p className="text-charcoal-700 mt-2 mb-6">Every pet deserves something special.</p>
          <Link href="/shop" className="inline-block bg-forest-600 text-white font-heading font-bold px-8 py-3 rounded-full hover:bg-forest-700 transition">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-4">
            {/* free shipping progress */}
            <div className="rounded-2xl bg-sage-100/70 p-4">
              <p className="text-sm font-semibold mb-2">
                {remaining > 0 ? `Add $${remaining.toFixed(2)} more for FREE shipping 🚚` : "🎉 You unlocked FREE shipping!"}
              </p>
              <div className="h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-forest-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {items.map((i) => (
              <div key={i.slug} className="flex gap-4 bg-white rounded-2xl border border-sage-300/50 p-4">
                <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${i.tint} flex items-center justify-center text-3xl shrink-0`}>
                  {i.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-3">
                    <h3 className="font-heading font-bold text-sm">{i.name}</h3>
                    <button onClick={() => remove(i.slug)} className="text-xs text-sage-500 hover:text-red-600 transition shrink-0">Remove</button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-sage-300 rounded-full overflow-hidden text-sm">
                      <button onClick={() => setQty(i.slug, i.qty - 1)} className="px-3 py-1.5 hover:bg-sage-100">−</button>
                      <span className="w-8 text-center font-semibold">{i.qty}</span>
                      <button onClick={() => setQty(i.slug, i.qty + 1)} className="px-3 py-1.5 hover:bg-sage-100">+</button>
                    </div>
                    <span className="font-heading font-extrabold text-forest-700">${(i.price * i.qty).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={clear} className="text-xs text-sage-500 hover:text-red-600 transition">Clear cart</button>
          </div>

          {/* summary */}
          <aside className="bg-white rounded-2xl border border-sage-300/50 p-6 h-fit lg:sticky lg:top-32">
            <h3 className="font-heading font-bold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-sage-500">Subtotal</span><span className="font-semibold">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-sage-500">Shipping</span><span className="font-semibold">{remaining <= 0 ? "FREE" : "Calculated at checkout"}</span></div>
              <div className="flex justify-between"><span className="text-sage-500">Coupon</span><span className="text-sage-500 text-xs">apply at checkout</span></div>
              <hr className="border-sage-300/50 my-2" />
              <div className="flex justify-between font-heading font-extrabold text-lg">
                <span>Total</span><span className="text-forest-700">${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <Link href="/checkout" className="block text-center bg-forest-600 text-white font-heading font-bold px-6 py-3.5 rounded-full mt-5 hover:bg-forest-700 transition">
              Proceed to Checkout
            </Link>
            <Link href="/shop" className="block text-center text-sm text-forest-600 font-semibold mt-3 hover:underline">
              ← Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
