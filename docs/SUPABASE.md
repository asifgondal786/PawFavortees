# Supabase Database Setup — PawFavoritees

## Kya ho raha hai
PawFavoritees ka **app database** (products, customers, orders, order_items, wishlist) Supabase Postgres par deploy hoga.
⚠️ Note: WooCommerce (Phase 6) ka apna **MySQL** hota hai jo hosting ke saath aayega — Supabase wo replace nahi karta,
ye hamari **app-level data** + future customer accounts ke liye hai. Dono ka role docs/ARCHITECTURE.md mein documented hai.

## Steps (5 minute)

1. **Project banao:** https://supabase.com/dashboard → org `mcqnyfdsouiaszwosjib` → *New Project*
   - Name: `pawfavoritees`
   - Region: apas mein close (e.g. `ap-south-1` Mumbai ya `us-east-1`)
   - DB password save kar lena.

2. **Schema run karo:** Project → **SQL Editor** → `supabase/schema.sql` ka poora content paste → **Run**
   - Ye banata hai: `products`, `customers`, `orders`, `order_items`, `wishlist_items`
   - RLS policies + **9 seed products** (Dogs & Cats) automatically insert ho jate hain.

3. **Keys lo:** Project → **Project Settings → API**
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ (server only, share na karo)

4. **.env.local banao:** project root mein `.env.example` copy kar ke `.env.local` banao aur values bharo.

5. Mujhe **Project URL + anon key** yahan share karo (service role key optional hai, main sirf tab use karunga jab orders write karne hon).
   Main connection test karke `lib/provider.js` mein `SupabaseProvider` wire kar dunga — MockProvider se same interface.

## Alternative: SQL mujhe run karne do
Agar tum **service_role key** (ya database connection string) share karo to main schema khud run kar dunga aur
connection verify kar ke provider switch kar dunga — tumhe SQL Editor khodna nahi padega.

## Security notes
- `service_role` key **kabhi** client-side code mein use nahi hogi — sirf API routes (`lib/supabase.js` → `getSupabaseAdmin`).
- RLS enabled hai: products public read, orders sirf apne email se read.
- `.env.local` `.gitignore` mein hai — git par push nahi hoga.
