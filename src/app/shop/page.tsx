import Link from "next/link";
import { getAllCategories, getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

type SearchParams = Promise<{ category?: string; sort?: string }>;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const categorySlug = params.category;
  const sort = (params.sort as "newest" | "price-asc" | "price-desc") || "newest";

  const [categories, products] = await Promise.all([
    getAllCategories(),
    getProducts({ categorySlug, sort }),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display font-black uppercase text-3xl sm:text-4xl">
          {activeCategory ? activeCategory.name : "Shop All"}
        </h1>
        {activeCategory?.description && (
          <p className="text-ink/60 mt-2 max-w-lg">{activeCategory.description}</p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-ink/10">
        <div className="flex flex-wrap gap-2">
          <FilterChip href="/shop" active={!categorySlug} label="All" />
          {categories.map((c) => (
            <FilterChip
              key={c.id}
              href={`/shop?category=${c.slug}`}
              active={categorySlug === c.slug}
              label={c.name}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="font-tag text-xs uppercase tracking-tag text-muted">
            Sort
          </label>
          <SortSelect categorySlug={categorySlug} sort={sort} />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-display font-bold text-lg">Nothing here yet</p>
          <p className="text-ink/60 mt-2">Check back soon — we're adding new colourways regularly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              name={p.name}
              imageUrl={p.images[0]?.url ?? "/images/logo.svg"}
              priceMinor={p.priceMinor}
              compareAtMinor={p.compareAtMinor}
              categoryName={p.category.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`font-tag text-xs uppercase tracking-tag px-3 py-2 border transition-colors ${
        active
          ? "bg-ink text-paper border-ink"
          : "border-ink/20 text-ink/70 hover:border-ink"
      }`}
    >
      {label}
    </Link>
  );
}

// Native <select> that navigates via a tiny client wrapper would need "use client";
// to keep this page a server component we use links styled as a select instead.
function SortSelect({
  categorySlug,
  sort,
}: {
  categorySlug?: string;
  sort: string;
}) {
  const base = categorySlug ? `/shop?category=${categorySlug}&sort=` : "/shop?sort=";
  const options: { value: string; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low to high" },
    { value: "price-desc", label: "Price: High to low" },
  ];
  return (
    <div className="flex gap-1">
      {options.map((o) => (
        <Link
          key={o.value}
          href={`${base}${o.value}`}
          className={`font-tag text-[11px] uppercase tracking-tag px-2 py-1.5 border ${
            sort === o.value
              ? "bg-ink text-paper border-ink"
              : "border-ink/20 text-ink/60 hover:border-ink"
          }`}
        >
          {o.label}
        </Link>
      ))}
    </div>
  );
}
