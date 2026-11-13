"use client";
// Row ke actions: Edit (modal) + Active/Inactive toggle (soft delete/restore)
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ProductModal from "@/components/admin/ProductModal";

export default function ProductRowActions({ product }) {
  const [modal, setModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const toggleActive = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products?slug=${encodeURIComponent(product.slug)}`, { method: "DELETE" });
      if (res.ok) startTransition(() => router.refresh());
    } catch {}
    setBusy(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button onClick={() => setModal(true)} className="text-xs font-semibold text-forest-600 hover:underline">Edit</button>
        <button onClick={toggleActive} disabled={busy}
          className="text-xs font-semibold text-red-500 hover:underline disabled:opacity-40" title="Soft delete — DB mein history bachta hai">
          {busy ? "…" : "Remove"}
        </button>
      </div>
      {modal && <ProductModal product={product} onClose={() => setModal(false)} />}
    </>
  );
}
