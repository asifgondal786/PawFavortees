// SERVER-ONLY — WooCommerce REST API client (Phase 6 ke liye ready).
// IMPORTANT: ye file sirf server-side (route handlers, server components) mein use hogi.
// Credentials .env mein: WOO_STORE_URL, WOO_CONSUMER_KEY, WOO_CONSUMER_SECRET
// Client bundle mein ye file import NAHI hogi — secrets ka koi leak nahi hoga.
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export function getWooClient() {
  const { WOO_STORE_URL, WOO_CONSUMER_KEY, WOO_CONSUMER_SECRET } = process.env;
  if (!WOO_STORE_URL || !WOO_CONSUMER_KEY || !WOO_CONSUMER_SECRET) {
    // Local dev (hosting se pehle): client null — provider mock use karega.
    return null;
  }
  return new WooCommerceRestApi({
    url: WOO_STORE_URL,
    consumerKey: WOO_CONSUMER_KEY,
    consumerSecret: WOO_CONSUMER_SECRET,
    version: "wc/v3",
    queryStringAuth: true, // VPS + SSL ke saath https basic auth bhi possible
  });
}

// Store API (customer-facing, no keys) ke liye helper — Phase 6 cart/checkout isse hoga.
export function storeApiUrl(path) {
  const base = process.env.WOO_STORE_URL;
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/wp-json/store/v1${path}`;
}
