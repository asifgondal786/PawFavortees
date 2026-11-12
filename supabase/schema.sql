-- ============================================================
-- PawFavoritees — Supabase schema (Postgres)
-- Run: Supabase Dashboard → SQL Editor → paste → Run
-- Ya: supabase CLI, ya project URL + service key se programmatic.
-- ============================================================

-- ---------- PRODUCTS ----------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  category    text not null check (category in ('dogs','cats','birds','fish','small-pets','reptiles')),
  subcategory text not null,
  brand       text not null,
  price       numeric(10,2) not null check (price >= 0),
  compare_at  numeric(10,2),
  rating      numeric(2,1) default 4.5,
  reviews     integer default 0,
  badge       text,
  emoji       text,
  tint        text,
  short_desc  text,
  specs       jsonb default '{}'::jsonb,
  stock       integer default 25,
  active      boolean default true,
  created_at  timestamptz default now()
);

-- ---------- CUSTOMERS ----------
create table if not exists public.customers (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  first_name  text,
  last_name   text,
  phone       text,
  created_at  timestamptz default now()
);

-- ---------- ORDERS ----------
create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  order_number text unique not null,            -- PAW-XXXXXX
  customer_id  uuid references public.customers(id),
  email        text not null,
  name         text not null,
  address      text,
  ship_method  text default 'standard',
  pay_method   text default 'card',
  status       text default 'pending' check (status in ('pending','paid','processing','shipped','completed','cancelled','refunded','failed')),
  subtotal     numeric(10,2) not null,
  shipping     numeric(10,2) default 0,
  tax          numeric(10,2) default 0,
  total        numeric(10,2) not null,
  created_at   timestamptz default now()
);

-- ---------- ORDER ITEMS ----------
create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_slug text not null,
  name         text not null,
  qty          integer not null check (qty > 0),
  price        numeric(10,2) not null
);

-- ---------- WISHLIST (per-customer, browser sync ke liye) ----------
create table if not exists public.wishlist_items (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references public.customers(id) on delete cascade,
  product_slug text not null,
  created_at   timestamptz default now(),
  unique (customer_id, product_slug)
);

-- ---------- INDEXES ----------
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_orders_email on public.orders(email);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_wishlist_customer on public.wishlist_items(customer_id);

-- ---------- RLS (Row Level Security) ----------
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlist_items enable row level security;

-- Products: sab koi active read kar sakta hai (storefront catalog)
drop policy if exists "Public read active products" on public.products;
create policy "Public read active products" on public.products
  for select using (active = true);

-- Orders/Items: server-side (service role) likhe ga; customer sirf apna email se read
drop policy if exists "Customer read own orders" on public.orders;
create policy "Customer read own orders" on public.orders
  for select using (email = current_setting('request.jwt.claim.email', true));

drop policy if exists "Customer read own order items" on public.order_items;
create policy "Customer read own order items" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.email = current_setting('request.jwt.claim.email', true))
  );

-- Note: orders INSERT/UPDATE service-role (API route) se hoga — anon insert policy intentional nahi.

-- ============================================================
-- SEED — Dogs & Cats launch products (ACTIVE_CATEGORIES ke mutabiq)
-- ============================================================
insert into public.products (slug, name, category, subcategory, brand, price, compare_at, rating, reviews, badge, emoji, tint, short_desc, specs, stock)
values
  ('everlast-dog-bed-orthopedic', 'Everlast Orthopedic Dog Bed', 'dogs', 'Dog Beds', 'PawFav Essentials', 64.99, 89.99, 4.8, 231, 'Best Seller', '🛏️', 'from-forest-100 to-sage-100', 'Memory-foam orthopedic bed with washable sherpa cover. Supports joints for senior dogs and growing puppies.', '{"Material":"Memory foam + Sherpa","Sizes":"S / M / L / XL","Care":"Machine washable cover"}', 25),
  ('ropefun-tough-dog-toy', 'RopeFun Tough Rope Toy', 'dogs', 'Dog Toys', 'RopeFun', 12.99, 17.99, 4.6, 418, null, '🪢', 'from-sand-300 to-cream-200', 'Indestructible braided cotton rope — perfect for tug, fetch and dental cleaning.', '{"Material":"Braided cotton","Size":"18 inch","Pet Size":"Medium to Large"}', 40),
  ('trailpaw-reflective-leash', 'TrailPaw Reflective Leash', 'dogs', 'Collars & Leashes', 'TrailPaw', 19.99, null, 4.7, 156, 'New', '🦮', 'from-forest-500 to-forest-700', '360° no-tangle reflective leash with padded handle. Night-walk safe.', '{"Length":"6 ft","Material":"Nylon + Reflective stitching","Clip":"Zinc alloy"}', 30),
  ('yumbox-slow-feeder-bowl', 'YumBox Slow Feeder Bowl', 'dogs', 'Feeding', 'YumBox', 16.49, 22.99, 4.5, 289, null, '🥣', 'from-cream-200 to-sand-300', 'Bloat-reducing slow feeder maze bowl. Non-slip base, dishwasher safe.', '{"Material":"Food-grade ABS","Capacity":"2 cups"}', 35),
  ('bathbuddy-pet-grooming-glove', 'BathBuddy Grooming Glove', 'dogs', 'Grooming', 'BathBuddy', 13.99, 19.99, 4.4, 205, null, '🧤', 'from-cream-100 to-sand-300', 'Dual-sided deshedding glove — brush and bond with your pet in one stroke.', '{"Side":"255 silicone tips","Fit":"One size","Wet/Dry":"Both"}', 28),
  ('cloudnine-cat-tree-tower', 'CloudNine Cat Tree Tower', 'cats', 'Scratching Posts', 'CloudNine', 79.99, 109.99, 4.9, 342, 'Best Seller', '🐾', 'from-sage-100 to-cream-100', '5-level tower with sisal posts, plush perches and a cozy hideaway condo.', '{"Height":"54 inch","Levels":5,"Material":"Sisal + Faux fur"}', 12),
  ('purrfect-interactive-laser', 'Purrfect Interactive Laser Toy', 'cats', 'Cat Toys', 'Purrfect', 14.99, null, 4.4, 197, 'New', '🔴', 'from-cream-100 to-sage-100', 'Auto-rotating laser with random patterns — 15 min auto shut-off for safety.', '{"Power":"USB-C rechargeable","Timer":"15 min auto-off"}', 33),
  ('whiskerwell-grain-free-cat-food', 'WhiskerWell Grain-Free Cat Food', 'cats', 'Cat Food', 'WhiskerWell', 42.99, 49.99, 4.8, 512, 'Best Seller', '🐟', 'from-forest-100 to-cream-200', 'Salon-quality salmon recipe, grain-free, taurine enriched for heart and vision health.', '{"Weight":"10 lb bag","LifeStage":"Adult 1-7 yrs","Protein":"38%"}', 18),
  ('scoopsmart-odor-lock-litter', 'ScoopSmart Odor-Lock Litter', 'cats', 'Cat Litter', 'ScoopSmart', 24.99, 29.99, 4.3, 263, null, '🧺', 'from-sand-300 to-cream-100', 'Clumping bentonite litter with 7-day odor lock. 99% dust free.', '{"Weight":"20 lb","Type":"Clumping","Scent":"Unscented"}', 22)
on conflict (slug) do nothing;
