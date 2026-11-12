import { NextResponse } from "next/server";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <p className="text-6xl mb-4">🐕💩</p>
      <h1 className="text-3xl mb-3">404 — Page Not Found</h1>
      <p className="text-charcoal-700 mb-8">Looks like this page buried itself. Let&apos;s dig our way back home.</p>
      <a href="/" className="inline-block bg-forest-600 text-white font-heading font-bold px-8 py-3 rounded-full hover:bg-forest-700 transition">
        Back to Home
      </a>
    </div>
  );
}
