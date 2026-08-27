import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getPromotedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Adzepa Essentials — African Wax Print Bombers & Fabric",
  openGraph: {
    title: "Adzepa Essentials",
    description: "Statement bomber jackets and premium wax print fabric, cut from authentic African prints.",
    url: "/",
    type: "website",
    images: [{
      url: "/images/products/bomber-red-block-mannequin.webp",
      width: 1122,
      height: 1400,
      alt: "Adzepa Essentials African wax print bomber jacket",
    }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/products/bomber-red-block-mannequin.webp"],
  },
};

export default async function HomePage() {
  const [featured, promotions] = await Promise.all([getFeaturedProducts(), getPromotedProducts()]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-14 md:pt-16 md:pb-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="tag-badge text-signal mb-5">Guaranteed Original Print</span>
            <h1 className="font-display font-black uppercase text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight">
              Wax print,
              <br />
              cut bold.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-ink/70 max-w-md">
              Bomber jackets and fabric sourced from authentic African wax
              print. Pick your colourway, message us on WhatsApp, we handle
              the rest.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="bg-ink text-paper font-tag text-sm uppercase tracking-tag px-6 py-3.5 hover:bg-signal transition-colors"
              >
                Shop the collection
              </Link>
              <Link
                href="/shop?category=bombers"
                className="border border-ink font-tag text-sm uppercase tracking-tag px-6 py-3.5 hover:bg-ink hover:text-paper transition-colors"
              >
                View bombers
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] mt-8">
              <Image
                src="/images/products/bomber-red-block-mannequin.webp"
                alt="Aduna Red Block Bomber"
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="relative aspect-[3/4]">
              <Image
                src="/images/products/bomber-purple-tribal-lifestyle-01.webp"
                alt="Obaa Purple Tribal Bomber styled outdoors"
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category strip */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-4">
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/shop?category=bombers"
            className="group relative aspect-[16/7] overflow-hidden bg-ink"
          >
            <Image
              src="/images/products/bomber-mustard-geo-mannequin.webp"
              alt="Bomber jackets"
              fill
              sizes="50vw"
              className="object-cover opacity-70 group-hover:opacity-90 transition-opacity"
            />
            <div className="absolute inset-0 flex items-end p-4">
              <span className="font-display font-black uppercase text-paper text-lg sm:text-2xl">
                Bombers
              </span>
            </div>
          </Link>
          <Link
            href="/shop?category=fabric"
            className="group relative aspect-[16/7] overflow-hidden bg-teal"
          >
            <Image
              src="/images/fabric/fabric-teal-tribal.webp"
              alt="Wax print fabric"
              fill
              sizes="50vw"
              className="object-cover opacity-70 group-hover:opacity-90 transition-opacity"
            />
            <div className="absolute inset-0 flex items-end p-4">
              <span className="font-display font-black uppercase text-paper text-lg sm:text-2xl">
                Fabric
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-display font-black uppercase text-2xl sm:text-3xl">
              Featured
            </h2>
            <Link href="/shop" className="font-tag text-xs uppercase tracking-tag underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-8">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                imageUrl={p.images[0]?.url ?? "/images/logo.svg"}
                priceMinor={p.priceMinor}
                compareAtMinor={p.compareAtMinor}
                categoryName={p.category.name}
                brandName={p.brandName}
                isAd={p.isAd}
              />
            ))}
          </div>
        </section>
      )}

      {promotions.length > 0 && (
        <section className="border-y border-ink/10 bg-signal text-paper">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="font-tag text-xs uppercase tracking-tag text-paper/70 mb-2">Limited offers</p>
                <h2 className="font-display font-black uppercase text-2xl sm:text-3xl">On promotion</h2>
              </div>
              <Link href="/shop" className="font-tag text-xs uppercase tracking-tag underline">Shop offers</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {promotions.map((p) => (
                <ProductCard
                  key={p.id}
                  slug={p.slug}
                  name={p.name}
                  imageUrl={p.images[0]?.url ?? "/images/logo.svg"}
                  priceMinor={p.priceMinor}
                  compareAtMinor={p.compareAtMinor}
                  categoryName={p.promotionLabel ?? "Promotion"}
                  brandName={p.brandName}
                  isAd={p.isAd}
                  inverse
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust strip */}
      <section className="border-y border-ink/10 bg-sand/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-display font-black text-lg">100%</p>
            <p className="font-tag text-[11px] uppercase tracking-tag text-muted mt-1">
              Cotton wax print
            </p>
          </div>
          <div>
            <p className="font-display font-black text-lg">WhatsApp</p>
            <p className="font-tag text-[11px] uppercase tracking-tag text-muted mt-1">
              Order & pay direct
            </p>
          </div>
          <div>
            <p className="font-display font-black text-lg">Adult + Kids</p>
            <p className="font-tag text-[11px] uppercase tracking-tag text-muted mt-1">
              Sizes coming soon
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
