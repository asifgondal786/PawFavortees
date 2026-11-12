"use client";
// Auth store — local demo (Phase 7 mein WooCommerce customer accounts se replace hoga).
// Persisted: page refresh ke baad bhi login state rehta hai.
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuth = create(
  persist(
    (set, get) => ({
      user: null, // { firstName, lastName, email }
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      isLoggedIn: () => Boolean(get().user),
    }),
    { name: "pawfav-auth" }
  )
);
