"use client";
// Password reset page — recovery email ka link yahan aata hai (#access_token=...).
// Token se session set, phir updateUser({ password }) naya password save karta hai.
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

function parseHash(hash) {
  // "#access_token=...&refresh_token=...&type=recovery" → object
  const out = {};
  hash.replace(/^#/, "").split("&").forEach((kv) => {
    const [k, v] = kv.split("=");
    if (k) out[k] = decodeURIComponent(v || "");
  });
  return out;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false); // token session set ho gaya

  useEffect(() => {
    (async () => {
      const sb = getSupabase();
      if (!sb) { setError("Auth configured nahi hai."); return; }
      try {
        // Supabase v2 default implicit flow — tokens hash fragment mein aate hain
        const h = parseHash(window.location.hash);
        if (h.access_token && h.refresh_token) {
          const { error } = await sb.auth.setSession({
            access_token: h.access_token,
            refresh_token: h.refresh_token,
          });
          if (error) throw new Error("Reset link invalid ya expire ho gaya.");
          // hash clean kar do (token page history mein na rahe)
          window.history.replaceState(null, "", window.location.pathname);
          setReady(true);
        } else if (new URLSearchParams(window.location.search).get("code")) {
          // PKCE flow fallback
          const { error } = await sb.auth.exchangeCodeForSession(window.location.href);
          if (error) throw new Error("Reset link invalid ya expire ho gaya.");
          setReady(true);
        } else {
          setError("Ye page reset link ke baghair nahi khulta. Pehle 'Forgot Password' se link lein.");
        }
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password kam se kam 8 characters ka hona chahiye.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords match nahi kar rahe.");
      return;
    }
    setLoading(true);
    try {
      const sb = getSupabase();
      const { error } = await sb.auth.updateUser({ password: form.password });
      if (error) throw new Error(error.message);
      setDone(true);
      // sign-in page par hi bhej do — user ab naye password se login karega
      await sb.auth.signOut();
      router.push("/login?reset=ok");
    } catch (err) {
      setError(err.message || "Password update fail ho gaya.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <span className="text-5xl">🔒</span>
        <h1 className="text-3xl mt-3">Set New Password</h1>
        <p className="text-charcoal-700 text-sm mt-2">Naya password choose karein — purana replace ho jayega.</p>
      </div>
      <div className="rounded-3xl bg-white border border-sage-300/50 shadow-sm p-7">
        {done ? (
          <p className="text-sm text-forest-600 font-semibold text-center">✓ Password update ho gaya — Sign In par le ja rahe hain…</p>
        ) : error ? (
          <div>
            <p className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</p>
            <Link href="/forgot-password" className="inline-block mt-5 text-forest-600 font-semibold text-sm hover:underline">
              🔑 Naya reset link lein
            </Link>
          </div>
        ) : ready ? (
          <form onSubmit={onSubmit} className="grid gap-4">
            <label className="block">
              <span className="text-sm font-semibold">New Password</span>
              <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min 8 characters"
                className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Confirm Password</span>
              <input required type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="mt-1 w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500" />
            </label>
            <button disabled={loading}
              className="bg-forest-600 text-white font-heading font-bold px-6 py-3 rounded-full hover:bg-forest-700 transition disabled:opacity-60">
              {loading ? "Updating…" : "Update Password"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-sage-500 text-center">Verifying reset link… 🐾</p>
        )}
      </div>
    </div>
  );
}
