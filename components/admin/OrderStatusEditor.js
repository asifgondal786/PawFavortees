"use client";
// Admin orders table ke andar status dropdown + save — PATCH /api/orders
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["paid", "processing", "shipped", "completed", "cancelled", "refunded", "failed", "pending"];

export default function OrderStatusEditor({ orderNumber, status }) {
  const [value, setValue] = useState(status);
  const [saved, setSaved] = useState(null); // "ok" | null
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const onSave = async () => {
    if (value === status) return;
    setSaving(true);
    setError("");
    setSaved(null);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, status: value }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Update failed");
      setSaved("ok");
      startTransition(() => router.refresh()); // server page fresh data se re-render
    } catch (e) {
      setError(e.message);
      setValue(status); // revert
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-1.5">
        <select value={value} onChange={(e) => { setValue(e.target.value); setSaved(null); }}
          className="rounded-lg border border-sage-300 bg-white px-2 py-1.5 text-xs font-semibold outline-none focus:border-forest-500 cursor-pointer">
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={onSave} disabled={saving || value === status}
          className="text-xs font-semibold text-forest-600 hover:underline disabled:opacity-40 disabled:cursor-not-allowed">
          {saving ? "…" : "Save"}
        </button>
      </div>
      {saved === "ok" && <span className="text-[10px] text-forest-600 font-semibold">✓ Updated</span>}
      {error && <span className="text-[10px] text-red-600">{error}</span>}
    </div>
  );
}
