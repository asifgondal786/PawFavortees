"use client";
// "+ Add Product" button — ProductModal kholta hai
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ProductModal from "@/components/admin/ProductModal";

export default function AddProductButton() {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="bg-forest-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-forest-700 transition">
        + Add Product
      </button>
      {open && (
        <ProductModal
          onClose={() => { setOpen(false); startTransition(() => router.refresh()); }}
        />
      )}
    </>
  );
}
