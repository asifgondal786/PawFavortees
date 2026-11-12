"use client";
// Live search suggestions — /api/products?q= se debounce fetch.
// Click → product page; Enter → /shop?q= full results.
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBox({ big = false }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        const data = await res.json();
        setResults((data.products || []).slice(0, 6));
        setOpen(true);
      } catch {} // abort ignore
    }, 250);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [q]);

  useEffect(() => {
    const onDoc = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const go = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div ref={boxRef} className="relative flex-1 max-w-md">
      <form onSubmit={go} className="flex">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search for toys, food, beds…"
          aria-label="Search products"
          className={`w-full rounded-l-full border border-sage-300 bg-white px-4 outline-none focus:border-forest-500 ${big ? "py-3 text-base" : "py-2 text-sm"}`}
        />
        <button className={`rounded-r-full bg-forest-600 text-white text-sm font-semibold hover:bg-forest-700 transition ${big ? "px-6 py-3" : "px-4 py-2"}`}>
          Go
        </button>
      </form>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-sage-300/60 overflow-hidden z-50">
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => { setOpen(false); setQ(""); router.push(`/product/${p.slug}`); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-cream-100 text-left transition"
            >
              <span className="text-xl">{p.emoji}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold truncate">{p.name}</span>
                <span className="text-xs text-sage-500">{p.subcategory} · {p.brand}</span>
              </span>
              <span className="font-heading font-bold text-forest-700 text-sm">${p.price.toFixed(2)}</span>
            </button>
          ))}
          <div className="border-t border-sage-300/40 px-4 py-2.5 text-xs">
            <button onClick={go} className="text-forest-600 font-semibold hover:underline">
              See all results for &ldquo;{q}&rdquo; →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
