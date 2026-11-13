"use client";
import Link from "next/link";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const sb = getSupabase();
    if (!sb) {
      // no env — demo fallback
      setSent(true);
      return;
    }
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (error) throw new Error(error.message);
      setSent(true);
    } catch (err) {
      setError(err.message || "Reset email nahi bhej saken.");
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="rounded-3xl bg-white border border-sage-300/50 shadow-sm p-10">
          <p className="text-5xl mb-4">📧</p>
          <h1 className="text-2xl">Check your inbox</h1>
          <p className="text-sm text-charcoal-700 mt-3">
            Reset link <b>{email}</b> par bhej diya gaya hai. Spam folder bhi check kar lein.
          </p>
          <Link href="/login" className="inline-block mt-6 text-forest-600 font-semibold text-sm hover:underline">
            ← Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <span className="text-5xl">🔑</span>
        <h1 className="text-3xl mt-3">Forgot Password</h1>
        <p className="text-charcoal-700 text-sm mt-2">Apna email daalein — hum reset link bhej denge.</p>
      </div>
      <div className="rounded-3xl bg-white border border-sage-300/50 shadow-sm p-7">
        {error && <p className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 mb-4">{error}</p>}
        <form onSubmit={onSubmit} className="grid gap-4">
          <label className="block">
            <span className="text-sm font-semibold">Email</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
          </label>
          <button disabled={loading}
            className="bg-forest-600 text-white font-heading font-bold px-6 py-3 rounded-full hover:bg-forest-700 transition disabled:opacity-60">
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
        <p className="text-sm text-center mt-5">
          <Link href="/login" className="text-forest-600 font-semibold hover:underline">← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
