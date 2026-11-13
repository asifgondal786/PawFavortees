"use client";
// Auth — Supabase email/password auth (real).
// Supabase configured nahi ho to demo localStorage mode chalega (offline dev).
// Persisted: page refresh ke baad bhi login state rehta hai.
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getSupabase } from "@/lib/supabase";

// Supabase user row → app user shape
function userFrom(su, fallback = {}) {
  const meta = su?.user_metadata || {};
  const email = su?.email || fallback.email || "";
  const first = meta.first_name || fallback.firstName || (email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1));
  return { firstName: first, lastName: meta.last_name || fallback.lastName || "", email };
}

export const useAuth = create(
  persist(
    (set, get) => ({
      user: null, // { firstName, lastName, email }
      login: (user) => set({ user }),
      isLoggedIn: () => Boolean(get().user),

      // Real sign-in (Supabase). Error throw karta hai — page pe dikhate hain.
      async signIn(email, password) {
        const sb = getSupabase();
        if (!sb) {
          // demo fallback (no env)
          const name = email.split("@")[0];
          const u = { firstName: name.charAt(0).toUpperCase() + name.slice(1), lastName: "", email };
          set({ user: u });
          return u;
        }
        const { data, error } = await sb.auth.signInWithPassword({ email, password });
        if (error) {
          const msg = error.message === "Invalid login credentials"
            ? "Email ya password ghalat hai."
            : error.message;
          throw new Error(msg);
        }
        const u = userFrom(data.user);
        set({ user: u });
        return u;
      },

      // Real sign-up (Supabase). Email confirmation ON ho to needsConfirm true aata hai.
      async signUp(payload) {
        const sb = getSupabase();
        if (!sb) {
          const u = { firstName: payload.firstName, lastName: payload.lastName, email: payload.email };
          set({ user: u });
          return { user: u, needsConfirm: false };
        }
        const { data, error } = await sb.auth.signUp({
          email: payload.email,
          password: payload.password,
          options: { data: { first_name: payload.firstName, last_name: payload.lastName } },
        });
        if (error) throw new Error(error.message);
        if (!data.session) return { needsConfirm: true }; // confirm email pending
        const u = userFrom(data.user, payload);
        set({ user: u });
        return { user: u, needsConfirm: false };
      },

      async logout() {
        const sb = getSupabase();
        if (sb) { try { await sb.auth.signOut(); } catch {} }
        set({ user: null });
      },

      // Page load par Supabase session se user restore karo (store empty ho)
      async restore() {
        if (get().user) return;
        const sb = getSupabase();
        if (!sb) return;
        try {
          const { data } = await sb.auth.getSession();
          if (data?.session?.user) set({ user: userFrom(data.session.user) });
        } catch {}
      },
    }),
    { name: "pawfav-auth" }
  )
);
