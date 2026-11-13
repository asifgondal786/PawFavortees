"use client";
// Client-side sync (store layout mein mount hota hai):
// 1) Supabase session se user restore (page refresh par)
// 2) Login hone par wishlist DB se merge (union) + DB ko push
// 3) Wishlist ke har change par DB push (fire-and-forget, offline tolerant)
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useWishlist } from "@/lib/store";

export default function AuthSync() {
  useEffect(() => {
    // 1) session restore
    useAuth.getState().restore();

    // 2) login → wishlist sync
    const unsubAuth = useAuth.subscribe((state) => {
      const email = state.user?.email;
      if (!email) return;
      (async () => {
        try {
          const res = await fetch(`/api/wishlist?email=${encodeURIComponent(email)}`);
          if (!res.ok) return;
          const d = await res.json();
          const db = d.slugs || [];
          const local = useWishlist.getState().slugs;
          const merged = [...new Set([...db, ...local])];
          // sirf tab replace karo jab difference ho (loop guard)
          const same = db.length === merged.length && db.every((s) => merged.includes(s));
          if (!same) {
            useWishlist.getState().replaceAll(merged);
          }
          // merged set DB pe push (local-only items bhi persist ho jayenge)
          if (!same || toAddOrRemove(db, merged)) {
            pushWishlist(email, merged, state.user.firstName);
          }
        } catch {}
      })();
    });

    // 3) wishlist change → DB push
    let last = useWishlist.getState().slugs.slice();
    const unsubWish = useWishlist.subscribe((state) => {
      const now = state.slugs;
      const email = useAuth.getState().user?.email;
      if (!email) { last = now.slice(); return; }
      const changed = now.length !== last.length || now.some((s) => !last.includes(s));
      last = now.slice();
      if (!changed) return;
      pushWishlist(email, now, useAuth.getState().user?.firstName);
    });

    return () => { unsubAuth(); unsubWish(); };
  }, []);

  return null;
}

function toAddOrRemove(db, merged) {
  return merged.length !== db.length;
}

function pushWishlist(email, slugs, name) {
  // fire-and-forget — offline par silent fail, agli login par merge-back hoga
  fetch("/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name: name || "", slugs }),
  }).catch(() => {});
}
