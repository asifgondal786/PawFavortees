"use client";
// Checkout — full payment flow (demo gateway locally).
// Phase 6: ye UI WooCommerce Store API checkout + selected gateway se wire hoga.
// Abhi: card validation, processing state, order create → localStorage → confirmation page.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/store";
import { useAuth } from "@/lib/auth";

const FREE_SHIP = 49;
const SHIP_METHODS = [
  { id: "standard", label: "Standard", desc: "3–7 business days", price: null, note: "FREE on $49+" },
  { id: "express", label: "Express", desc: "1–3 business days", price: 14.99, note: null },
];
const PAY_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: "💳", desc: "Visa, Mastercard, Amex — demo payment", live: true },
  { id: "paypal", label: "PayPal", icon: "🅿️", desc: "Redirect checkout", live: false },
  { id: "wallet", label: "Apple / Google Pay", icon: "📱", desc: "Digital wallets", live: false },
];
const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const user = useAuth((s) => s.user);
  const router = useRouter();
  const [ship, setShip] = useState("standard");
  const [pay, setPay] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: user?.email || "", firstName: user?.firstName || "", lastName: user?.lastName || "",
    address1: "", address2: "", city: "", state: "", zip: "",
    cardName: "", cardNumber: "", cardExpiry: "", cardCvc: "",
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const shippingCost = ship === "express" ? 14.99 : subtotal >= FREE_SHIP ? 0 : 5.99;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + shippingCost + tax).toFixed(2);

  const validate = () => {
    const req = ["email", "firstName", "lastName", "address1", "city", "state", "zip"];
    for (const k of req) if (!form[k].trim()) return "Please fill in your contact and shipping details.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Please enter a valid email address.";
    if (!/^\d{5}(-\d{4})?$/.test(form.zip.trim())) return "Please enter a valid US ZIP code.";
    if (pay === "card") {
      const digits = form.cardNumber.replace(/\s+/g, "");
      if (!/^\d{15,16}$/.test(digits)) return "Card number 15–16 digits ka hona chahiye.";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.cardExpiry.trim())) return "Card expiry MM/YY format mein ho.";
      if (!/^\d{3,4}$/.test(form.cardCvc.trim())) return "CVC 3–4 digits ka hona chahiye.";
      if (!form.cardName.trim()) return "Cardholder ka naam zaroori hai.";
    }
    return "";
  };

  const placeOrder = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setProcessing(true);
    // Demo gateway processing — Phase 6: real gateway (Stripe/PayPal/hosted) + webhook verification.
    setTimeout(() => {
      const order = {
        id: "PAW-" + Date.now().toString(36).toUpperCase().slice(-6),
        date: new Date().toISOString(),
        items, subtotal: +subtotal.toFixed(2), shipping: shippingCost, tax, total,
        shipMethod: ship, payMethod: pay,
        email: form.email, name: `${form.firstName} ${form.lastName}`,
        address: `${form.address1}${form.address2 ? ", " + form.address2 : ""}, ${form.city}, ${form.state} ${form.zip}`,
        status: "paid-demo",
      };
      const orders = JSON.parse(localStorage.getItem("pawfav-orders") || "[]");
      orders.push(order);
      localStorage.setItem("pawfav-orders", JSON.stringify(orders));
      clear();
      router.push(`/order-received?order=${order.id}`);
    }, 1800);
  };

  if (items.length === 0 && !processing) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="text-2xl mb-2">Your cart is empty</h1>
        <p className="text-charcoal-700 text-sm mb-6">Checkout karne ke liye pehle kuch add karein.</p>
        <Link href="/shop" className="inline-block bg-forest-600 text-white font-heading font-bold px-8 py-3 rounded-full hover:bg-forest-700 transition">Go to Shop</Link>
      </div>
    );
  }

  const inputCls = "mt-1 w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500";
  const labelCls = "text-sm font-semibold";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl mb-1">Checkout</h1>
      <p className="text-charcoal-700 text-sm mb-8">
        🔒 Demo payment mode — real gateway Phase 6 mein connect hoga. Test card: <b>4242 4242 4242 4242</b>
      </p>

      <form onSubmit={placeOrder} className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        <div className="space-y-5">
          {/* contact */}
          <section className="rounded-2xl bg-white border border-sage-300/50 p-6">
            <h2 className="font-heading font-bold text-lg mb-4">1. Contact Information</h2>
            <div className="grid gap-4">
              <label className="block"><span className={labelCls}>Email</span>
                <input required type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className={inputCls} /></label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block"><span className={labelCls}>First Name</span>
                  <input required value={form.firstName} onChange={set("firstName")} className={inputCls} /></label>
                <label className="block"><span className={labelCls}>Last Name</span>
                  <input required value={form.lastName} onChange={set("lastName")} className={inputCls} /></label>
              </div>
            </div>
          </section>

          {/* shipping address */}
          <section className="rounded-2xl bg-white border border-sage-300/50 p-6">
            <h2 className="font-heading font-bold text-lg mb-4">2. Shipping Address</h2>
            <div className="grid gap-4">
              <label className="block"><span className={labelCls}>Street Address</span>
                <input required value={form.address1} onChange={set("address1")} placeholder="123 Main St" className={inputCls} /></label>
              <label className="block"><span className={labelCls}>Apartment / Unit <span className="text-sage-500 font-normal">(optional)</span></span>
                <input value={form.address2} onChange={set("address2")} placeholder="Apt 4B" className={inputCls} /></label>
              <div className="grid sm:grid-cols-3 gap-4">
                <label className="block"><span className={labelCls}>City</span>
                  <input required value={form.city} onChange={set("city")} placeholder="New York" className={inputCls} /></label>
                <label className="block"><span className={labelCls}>State</span>
                  <select required value={form.state} onChange={set("state")} className={inputCls}>
                    <option value="">Select…</option>
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select></label>
                <label className="block"><span className={labelCls}>ZIP Code</span>
                  <input required value={form.zip} onChange={set("zip")} placeholder="10001" className={inputCls} /></label>
              </div>
            </div>
          </section>

          {/* shipping method */}
          <section className="rounded-2xl bg-white border border-sage-300/50 p-6">
            <h2 className="font-heading font-bold text-lg mb-4">3. Shipping Method</h2>
            <div className="grid gap-3">
              {SHIP_METHODS.map((m) => {
                const cost = m.price === null ? (subtotal >= FREE_SHIP ? 0 : 5.99) : m.price;
                const active = ship === m.id;
                return (
                  <label key={m.id} className={`flex items-center gap-4 rounded-xl border-2 px-4 py-3 cursor-pointer transition ${active ? "border-forest-600 bg-sage-100/50" : "border-sage-300/60 hover:border-forest-500"}`}>
                    <input type="radio" name="ship" checked={active} onChange={() => setShip(m.id)} className="accent-forest-600 w-4 h-4" />
                    <div className="flex-1">
                      <span className="font-semibold text-sm">{m.label}</span>
                      <span className="text-xs text-sage-500 ml-2">{m.desc}</span>
                    </div>
                    <span className="font-heading font-bold text-sm text-forest-700">{cost === 0 ? "FREE" : `$${cost.toFixed(2)}`}</span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* payment */}
          <section className="rounded-2xl bg-white border border-sage-300/50 p-6">
            <h2 className="font-heading font-bold text-lg mb-4">4. Payment</h2>
            <div className="grid gap-3 mb-5">
              {PAY_METHODS.map((m) => {
                const active = pay === m.id;
                return (
                  <label key={m.id} className={`flex items-center gap-4 rounded-xl border-2 px-4 py-3 cursor-pointer transition ${active ? "border-forest-600 bg-sage-100/50" : "border-sage-300/60 hover:border-forest-500"} ${!m.live ? "opacity-70" : ""}`}>
                    <input type="radio" name="pay" checked={active} onChange={() => setPay(m.id)} className="accent-forest-600 w-4 h-4" />
                    <span className="text-2xl">{m.icon}</span>
                    <div className="flex-1">
                      <span className="font-semibold text-sm">{m.label}</span>
                      <span className="text-xs text-sage-500 ml-2">{m.desc}</span>
                    </div>
                    {!m.live && <span className="text-[10px] font-bold bg-sand-300 text-charcoal-900 px-2 py-1 rounded-full">PHASE 6</span>}
                  </label>
                );
              })}
            </div>

            {pay === "card" && (
              <div className="grid gap-4 rounded-xl bg-cream-100 p-5">
                <label className="block"><span className={labelCls}>Cardholder Name</span>
                  <input value={form.cardName} onChange={set("cardName")} placeholder="Name on card" className={inputCls} /></label>
                <label className="block"><span className={labelCls}>Card Number</span>
                  <input value={form.cardNumber} onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
                    setForm({ ...form, cardNumber: v });
                  }} placeholder="4242 4242 4242 4242" inputMode="numeric" className={inputCls} /></label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block"><span className={labelCls}>Expiry (MM/YY)</span>
                    <input value={form.cardExpiry} onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                      if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                      setForm({ ...form, cardExpiry: v });
                    }} placeholder="12/28" inputMode="numeric" className={inputCls} /></label>
                  <label className="block"><span className={labelCls}>CVC</span>
                    <input value={form.cardCvc} onChange={(e) => setForm({ ...form, cardCvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="123" inputMode="numeric" className={inputCls} /></label>
                </div>
                <p className="text-xs text-sage-500">🔒 Card details store nahi hote — demo processing locally hoti hai. Production mein gateway ka tokenized flow use hoga.</p>
              </div>
            )}
            {pay !== "card" && (
              <p className="rounded-xl bg-sand-300/40 px-4 py-3 text-sm text-charcoal-700">
                {PAY_METHODS.find((m) => m.id === pay).label} Phase 6 mein gateway selection ke baad enable hoga.
              </p>
            )}
          </section>
        </div>

        {/* order review */}
        <aside className="bg-white rounded-2xl border border-sage-300/50 p-6 lg:sticky lg:top-32">
          <h2 className="font-heading font-bold text-lg mb-4">Order Review</h2>
          <div className="space-y-3 mb-4 max-h-64 overflow-auto">
            {items.map((i) => (
              <div key={i.slug} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${i.tint} flex items-center justify-center text-lg shrink-0`}>{i.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{i.name}</p>
                  <p className="text-xs text-sage-500">× {i.qty}</p>
                </div>
                <span className="text-sm font-bold">${(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1.5 text-sm border-t border-sage-300/50 pt-4">
            <div className="flex justify-between"><span className="text-sage-500">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-sage-500">Shipping ({ship})</span><span>{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span className="text-sage-500">Est. Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-heading font-extrabold text-lg pt-2 border-t border-sage-300/50 mt-2">
              <span>Total</span><span className="text-forest-700">${total.toFixed(2)}</span>
            </div>
          </div>
          {error && <p className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 mt-4">{error}</p>}
          <button disabled={processing}
            className="w-full bg-forest-600 text-white font-heading font-bold px-6 py-3.5 rounded-full mt-5 hover:bg-forest-700 transition disabled:opacity-60">
            {processing ? "Processing Payment… ⏳" : `Place Order · $${total.toFixed(2)} 🛒`}
          </button>
          <p className="text-xs text-sage-500 text-center mt-3">By placing your order you agree to our <Link href="/terms" className="underline">Terms</Link>.</p>
        </aside>
      </form>
    </div>
  );
}
