import { NextResponse } from "next/server";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/cart", "/checkout", "/api/"] }],
    sitemap: "https://pawfavoritees.com/sitemap.xml",
  };
}
