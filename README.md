# Adzepa Essentials

A fashion storefront for African wax print bomber jackets and fabric, with a
full admin panel and WhatsApp checkout instead of a payment gateway.

**Stack:** Next.js 15 (App Router) · Prisma · Prisma Postgres · Tailwind CSS

---

## 1. What's included

- **Storefront**: home, shop (filter/sort by category), product detail pages
  with size selection, cart, and WhatsApp checkout.
- **Database-backed catalog**: categories, products, images, size variants
  with live stock, all editable from the admin panel — nothing is hardcoded.
- **Orders**: every checkout is saved to the database (with a server-side
  stock check) before the customer is handed off to WhatsApp, so you have a
  permanent record even though payment is confirmed over chat.
- **Admin panel** at `/admin`: dashboard, order list with status updates,
  full product CRUD (image uploads, price, sizes/stock, featured/visible toggles),
  and category management. Protected by a signed-cookie login.
- **SEO basics**: sitemap.xml, robots.txt, per-page metadata.

## 2. Content to replace before launch

This is real, working code seeded with realistic placeholder content based
on your actual product photos. Before going live, replace:

- **WhatsApp number** — `NEXT_PUBLIC_WHATSAPP_NUMBER` in your environment
  variables (currently a placeholder).
- **Product names, descriptions, prices** — written as realistic examples
  in `prisma/seed.ts`; edit there before first deploy, or edit directly in
  `/admin/products` after.
- **Currency** — defaults to Ghanaian Cedi (GHS) in `src/lib/money.ts`. If
  that's wrong for your market, change `CURRENCY` and `LOCALE` there.
- **About page copy** (`src/app/about/page.tsx`) and **FAQ answers**
  (`src/app/faq/page.tsx`) — clearly marked as placeholder in-page.
- **Admin login credentials** — `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars.

## 3. Local setup

```bash
npm install
cp .env.example .env
# edit .env with your real DATABASE_URL, WhatsApp number, and admin login
npx prisma db push      # creates tables in your database
npm run db:seed         # loads the starter catalog
npm run dev
```

Visit `http://localhost:3000` for the store and `http://localhost:3000/admin`
for the dashboard (log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set).

## 4. Database (Prisma Postgres)

This project uses [Prisma Postgres](https://www.prisma.io/postgres) — to
Prisma Client it's just a regular PostgreSQL database behind a connection
string, so nothing in `schema.prisma` or `src/lib/db.ts` needs to change to
use it.

1. Create a database — no account required to start:
   ```bash
   npx create-db@latest
   ```
   This prints a `postgres://...@db.prisma.io:5432/postgres?sslmode=require`
   connection string plus a **claim URL**. Open the claim URL to keep the
   database in your Prisma workspace (otherwise it's temporary). You can
   also create/manage databases at [console.prisma.io](https://console.prisma.io).
2. Paste the connection string into `DATABASE_URL` in `.env`.
3. Run `npx prisma db push` to create tables, then `npm run db:seed`.

Prisma Postgres includes built-in connection pooling out of the box, so the
Neon-style cold-start/pooling workarounds aren't needed here. It also
supports an edge-compatible driver and query caching if you later want
those — see the [Prisma Postgres docs](https://www.prisma.io/docs/postgres)
for `cacheStrategy` and the serverless driver.

## 5. Deploying (Vercel)

1. Push this project to a GitHub repo.
2. Import it into Vercel.
3. Add the environment variables from `.env.example` in Vercel's project
   settings (Production + Preview) — including your Prisma Postgres
   `DATABASE_URL`. (Prisma Postgres is also listed in the Vercel Marketplace
   under the Storage tab, which wires up `DATABASE_URL` automatically if you
   prefer to provision it from inside Vercel instead of the Prisma CLI.)
4. Deploy. For an existing database, apply the additive order-receipt
  migration with `npx prisma migrate deploy` against your production
  `DATABASE_URL`. For a new database, `npx prisma db push` is still suitable
  before the first deploy.

I can also provision the Prisma Postgres database and deploy this to Vercel
directly for you — just say the word and confirm which accounts to use.

## 6. Project structure

```
src/
  app/
    (storefront pages: page.tsx, shop/, product/[slug]/, cart/, about/, faq/)
    admin/            — dashboard, products, categories, orders (protected)
    api/
      orders/         — public: creates orders from checkout
      admin/          — protected: product/category/order CRUD
  components/         — shared UI (Header, Footer, ProductCard, cart form...)
  components/admin/   — admin-only UI
  lib/
    db.ts             — Prisma client singleton
    auth.ts           — signed-cookie admin session (Web Crypto, edge-safe)
    cart-context.tsx  — client-side cart state (persisted to localStorage)
    whatsapp.ts        — builds the pre-filled wa.me checkout link
    money.ts          — currency formatting (minor units)
    products.ts       — server-side data access for the storefront
  middleware.ts       — protects /admin and /api/admin routes
prisma/
  schema.prisma       — full data model
  seed.ts             — starter catalog using your real product photos
```

## 7. Known limitations (MVP-level, by design)

- **Admin auth** is a single email/password pair via env vars, not a full
  user table with hashed passwords — fine for one or two admins, but
  upgrade this (the `AdminUser` model is already in the schema, just not
  wired up) before handing access to a larger team.
- **Image uploads**: product images are uploaded to Vercel Blob from the admin
  panel. Set `BLOB_READ_WRITE_TOKEN` in your environment before uploading.
- **Payment** happens entirely over WhatsApp, as requested — there's no
  payment gateway integration. Payment status is tracked manually from the
  admin Orders page, and receipts are available only to authenticated admins.
