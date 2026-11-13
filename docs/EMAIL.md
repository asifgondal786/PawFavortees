# Order Confirmation Email — PawFavoritees

## Status: LIVE ✅ (test mode)

Har order place hone par `app/api/orders` POST ke baad confirmation email jati hai
(`lib/email.js` → `sendOrderConfirmationEmail`). Non-blocking — email fail ho to
order flow kabhi nahi rukta (sirf server console mein warn).

## Setup jo ho chuka
- `RESEND_API_KEY` → `.env.local` (send-only restricted key — theek hai, kaam karta hai)

## ⚠️ Test mode limitation (Resend)
Jab tak domain verify NAHI hua, Resend emails sirf **account owner** ke email par
deliver karta hai (`hsja838291@gmail.com`). Customer emails 403 validation_error
denge — lekin app graceful hai (order sab kuch theek save hota hai, email skip).

## Production (domain milne par — 5 minute)
1. https://resend.com/domains → **Add Domain** → apna domain (e.g. `pawfavoritees.com`)
2. DNS records Resend de ga (DKIM/SPF/DMARC) — hosting/DNS panel mein add karo
3. Verify → phir `.env.local` mein:
   ```
   EMAIL_FROM=PawFavoritees <orders@pawfavoritees.com>
   ```
4. Restart — ab real customers ko emails jayengi

## Customization
- Template: `lib/email.js` → `orderEmailHtml()`
- Subject: `sendOrderConfirmationEmail()` mein

## Console logs
- `[email] confirmation sent — order PAW-xxx` → email gayi
- `[email] skipped (RESEND_API_KEY missing)` → key nahi (order phir bhi save)
- `[email] failed for PAW-xxx: <reason>` → 403 test-mode restriction / network issue
