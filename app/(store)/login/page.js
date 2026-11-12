"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const login = useAuth((s) => s.login);
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Email aur password dono zaroori hain.");
      return;
    }
    setLoading(true);
    // Demo login — Phase 7: WooCommerce customer auth (JWT/session) se replace hoga.
    setTimeout(() => {
      const name = form.email.split("@")[0];
      const firstName = name.charAt(0).toUpperCase() + name.slice(1);
      login({ firstName, lastName: "", email: form.email });
      router.push("/account");
    }, 900);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <span className="text-5xl">🐾</span>
        <h1 className="text-3xl mt-3">Welcome Back</h1>
        <p className="text-charcoal-700 text-sm mt-2">Sign in to track orders, save wishlists and check out faster.</p>
      </div>

      <div className="rounded-3xl bg-white border border-sage-300/50 shadow-sm p-7">
        <div className="rounded-xl bg-sage-100/70 px-4 py-2.5 text-xs text-charcoal-700 mb-5">
          💡 <b>Demo mode:</b> koi bhi email/password chalega — Phase 7 mein real accounts connect honge.
        </div>

        {error && <p className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 mb-4">{error}</p>}

        <form onSubmit={onSubmit} className="grid gap-4">
          <label className="block">
            <span className="text-sm font-semibold">Email</span>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Password</span>
            <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
          </label>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                className="accent-forest-600 w-4 h-4" />
              <span className="text-charcoal-700">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-forest-600 font-semibold hover:underline">Forgot password?</Link>
          </div>
          <button disabled={loading}
            className="bg-forest-600 text-white font-heading font-bold px-6 py-3 rounded-full hover:bg-forest-700 transition disabled:opacity-60">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-charcoal-700 text-center mt-5">
          New to PawFavoritees?{" "}
          <Link href="/register" className="text-forest-600 font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
