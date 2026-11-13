// Order confirmation email — Resend API (server-side only).
// Key .env.local: RESEND_API_KEY=re_... (send-only restricted key bhi chalti hai).
// ⚠️ Resend TEST mode (domain verify na ho): onboarding@resend.dev se emails sirf
//    account owner (hsja838291@gmail.com) ko jati hain. Real customers ko bhejne
//    ke liye: resend.com/domains → apna domain verify → EMAIL_FROM=.env.local set karo.
// Free tier: 100 emails/day (3000/month), domain verify ke baad 50k/month.

const RESEND_API = "https://api.resend.com/emails";
const FROM = process.env.EMAIL_FROM || "PawFavoritees <onboarding@resend.dev>";

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function itemRows(items) {
  return (items || [])
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:14px;color:#1f2937;">
          ${i.emoji || "🐾"} ${i.name} <span style="color:#6b7280;">× ${i.qty}</span>
        </td>
        <td style="padding:8px 0;text-align:right;font-family:Arial,sans-serif;font-size:14px;color:#1f2937;">
          $${Number(i.price * i.qty).toFixed(2)}
        </td>
      </tr>`
    )
    .join("");
}

export function orderEmailHtml(order, items) {
  return `
  <div style="max-width:560px;margin:0 auto;font-family:Arial,sans-serif;">
    <div style="background:linear-gradient(135deg,#14532d,#166534);padding:28px;text-align:center;border-radius:16px 16px 0 0;">
      <p style="margin:0;font-size:26px;">🐾</p>
      <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;">Thanks for your order, ${(order.name || "").split(" ")[0]}!</h1>
      <p style="margin:4px 0 0;color:#bbf7d0;font-size:13px;">Your pet's happy place — order confirmed.</p>
    </div>
    <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 16px 16px;">
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#374151;margin:0 0 16px;">
        Order <b style="color:#14532d;">#${order.order_number}</b> ·
        Status: <b>paid</b> ·
        ${new Date(order.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
      </p>
      <table style="width:100%;border-collapse:collapse;">
        ${itemRows(items)}
      </table>
      <table style="width:100%;border-collapse:collapse;margin-top:12px;border-top:1px solid #e5e7eb;padding-top:10px;">
        <tr><td style="padding:3px 0;font-size:13px;color:#6b7280;font-family:Arial,sans-serif;">Subtotal</td>
            <td style="padding:3px 0;text-align:right;font-size:13px;font-family:Arial,sans-serif;">$${Number(order.subtotal).toFixed(2)}</td></tr>
        <tr><td style="padding:3px 0;font-size:13px;color:#6b7280;font-family:Arial,sans-serif;">Shipping</td>
            <td style="padding:3px 0;text-align:right;font-size:13px;font-family:Arial,sans-serif;">${Number(order.shipping) === 0 ? "FREE" : "$" + Number(order.shipping).toFixed(2)}</td></tr>
        <tr><td style="padding:3px 0;font-size:13px;color:#6b7280;font-family:Arial,sans-serif;">Tax</td>
            <td style="padding:3px 0;text-align:right;font-size:13px;font-family:Arial,sans-serif;">$${Number(order.tax).toFixed(2)}</td></tr>
        <tr><td style="padding:8px 0;font-size:16px;font-weight:bold;color:#14532d;font-family:Arial,sans-serif;">Total</td>
            <td style="padding:8px 0;text-align:right;font-size:16px;font-weight:bold;color:#14532d;font-family:Arial,sans-serif;">$${Number(order.total).toFixed(2)}</td></tr>
      </table>
      <p style="font-family:Arial,sans-serif;font-size:13px;color:#6b7280;margin:18px 0 0;">
        Shipping to: ${order.name}, ${order.address || "—"}
      </p>
      <p style="font-family:Arial,sans-serif;font-size:13px;margin:16px 0 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/track-order"
           style="color:#166534;font-weight:bold;">Track your order →</a>
      </p>
    </div>
  </div>`;
}

// Non-blocking helper — order flow fail nahi hona chahiye agar email fail ho
export async function sendOrderConfirmationEmail(order, items) {
  if (!emailConfigured()) {
    console.log(`[email] skipped (RESEND_API_KEY missing) — order ${order.order_number} to ${order.email}`);
    return { skipped: true };
  }
  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [order.email],
        subject: `Your PawFavoritees order #${order.order_number} is confirmed! 🐾`,
        html: orderEmailHtml(order, items),
      }),
    });
    const d = await res.json();
    if (!res.ok) throw new Error(d.message || "Resend failed");
    console.log(`[email] confirmation sent — order ${order.order_number}`);
    return { ok: true, id: d.id };
  } catch (e) {
    console.warn(`[email] failed for ${order.order_number}:`, e.message);
    return { error: e.message };
  }
}
