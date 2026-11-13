"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabaseConfigured } from "@/lib/supabase";

export default function RegisterPage() {
  const signUp = useAuth((s) => s.signUp);
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "", terms: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.terms) {
      setError("Please accept the Terms & Conditions and Privacy Policy.");
      return;
    }
    setLoading(true);
    try {
      const res = await signUp({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      if (res.needsConfirm) {
        // Email confirmation ON hai — user ko verify karne bolo
        setConfirmSent(true);
        setLoading(false);
        return;
      }
      router.push("/account");
    } catch (err) {
      const msg = (err.message || "").includes("already registered")
        ? "This email is already registered — please sign in."
        : err.message || "Account creation failed.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <span className="text-5xl">🐾</span>
        <h1 className="text-3xl mt-3">Create Account</h1>
        <p className="text-charcoal-700 text-sm mt-2">Join the pack — faster checkout, order history, wishlists.</p>
      </div>

      <div className="rounded-3xl bg-white border border-sage-300/50 shadow-sm p-7">
        <div className="rounded-xl bg-sage-100/70 px-4 py-2.5 text-xs text-charcoal-700 mb-5">
          💡 <b>{supabaseConfigured ? "Real authentication (Supabase)" : "Demo mode"}</b> —
          {supabaseConfigured ? " your account will be saved in the database, and works on every device." : " accounts are saved locally."}
        </div>

        {confirmSent && (
          <div className="rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-3 mb-4">
            📧 A confirmation email has been sent to <b>{form.email}</b> — click the link in your inbox, then sign in.
          </div>
        )}

        {error && <p className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 mb-4">{error}</p>}

        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-semibold">First Name</span>
              <input required value={form.firstName} onChange={set("firstName")}
                className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Last Name</span>
              <input required value={form.lastName} onChange={set("lastName")}
                className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-semibold">Email</span>
            <input required type="email" value={form.email} onChange={set("email")} placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Password</span>
            <input required type="password" value={form.password} onChange={set("password")} placeholder="Min 8 characters"
              className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Confirm Password</span>
            <input required type="password" value={form.confirm} onChange={set("confirm")}
              className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
          </label>
          <label className="flex items-start gap-2 cursor-pointer text-sm">
            <input required type="checkbox" checked={form.terms} onChange={set("terms")} className="accent-forest-600 w-4 h-4 mt-0.5" />
            <span className="text-charcoal-700">
              I agree to the <Link href="/terms" className="text-forest-600 underline">Terms &amp; Conditions</Link> and{" "}
              <Link href="/privacy-policy" className="text-forest-600 underline">Privacy Policy</Link>
            </span>
          </label>
          <button disabled={loading}
            className="bg-forest-600 text-white font-heading font-bold px-6 py-3 rounded-full hover:bg-forest-700 transition disabled:opacity-60">
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-charcoal-700 text-center mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-forest-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
