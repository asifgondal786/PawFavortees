"use client";
import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", topic: "Order Question", message: "" });

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Phase 8+: ye form API route / email service (e.g. Resend) se connect hoga.
  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl bg-sage-100/70 border border-sage-300/60 p-8 text-center">
        <p className="text-4xl mb-3">📬</p>
        <h3 className="font-heading font-bold text-lg">Message received!</h3>
        <p className="text-sm text-charcoal-700 mt-1">
          Thanks {form.name.split(" ")[0] || "friend"} — we&apos;ll reply to <b>{form.email}</b> within 1 business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-semibold">Your Name</span>
          <input required value={form.name} onChange={onChange("name")}
            className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Email</span>
          <input required type="email" value={form.email} onChange={onChange("email")}
            className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-semibold">Topic</span>
        <select value={form.topic} onChange={onChange("topic")}
          className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500">
          <option>Order Question</option>
          <option>Shipping &amp; Delivery</option>
          <option>Returns &amp; Refunds</option>
          <option>Product Question</option>
          <option>Wholesale / Partnership</option>
          <option>Other</option>
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Message</span>
        <textarea required rows={5} value={form.message} onChange={onChange("message")}
          placeholder="Order number likhna na bhoolen agar order ke bare mein hai…"
          className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
      </label>
      <button className="justify-self-start bg-forest-600 text-white font-heading font-bold px-8 py-3 rounded-full hover:bg-forest-700 transition">
        Send Message
      </button>
    </form>
  );
}
