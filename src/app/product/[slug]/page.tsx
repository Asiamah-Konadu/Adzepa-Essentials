import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { formatMoney } from "@/lib/money";
import AddToCartForm from "@/components/AddToCartForm";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const image = product.images[0]?.url;
  return {
    title: `${product.name} | Adzepa Essentials`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
      url: `/product/${product.slug}`,
      ...(image ? { images: [{ url: image, alt: product.name }] } : {}),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.active) notFound();

  const mainImage = product.images[0]?.url ?? "/images/logo.svg";
  const onSale = product.compareAtMinor && product.compareAtMinor > product.priceMinor;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <nav className="text-xs text-ink/50 mb-6 font-tag uppercase tracking-tag">
        <Link href="/shop" className="hover:text-signal">Shop</Link>
        {" / "}
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-signal">
          {product.category.name}
        </Link>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/5] bg-sand/40 overflow-hidden">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {product.images.map((img) => (
                <div key={img.id} className="relative aspect-square bg-sand/40 overflow-hidden">
                  <Image
                    src={img.url}
                    alt={img.alt ?? product.name}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="font-tag text-xs uppercase tracking-tag text-muted mb-2">
            {product.brandName && `${product.brandName} · `}{product.category.name}
          </p>
          {product.isAd && <span className="tag-badge text-signal mb-2">Ad</span>}
          <h1 className="font-display font-black uppercase text-3xl sm:text-4xl leading-tight">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="font-body font-semibold text-2xl">
              {formatMoney(product.priceMinor)}
            </span>
            {onSale && (
              <span className="font-body text-base text-muted line-through">
                {formatMoney(product.compareAtMinor!)}
              </span>
            )}
          </div>

          <p className="mt-5 text-ink/70 leading-relaxed">{product.description}</p>

          {product.promotionLabel && <p className="tag-badge mt-4 text-signal">{product.promotionLabel}</p>}

          {product.fabric && (
            <p className="tag-badge mt-4 text-teal">{product.fabric}</p>
          )}

          <div className="mt-8 pt-8 border-t border-ink/10">
            <AddToCartForm
              productId={product.id}
              productName={product.name}
              productSlug={product.slug}
              image={mainImage}
              priceMinor={product.priceMinor}
              variants={product.variants.map((v) => ({
                id: v.id,
                label: v.label,
                stock: v.stock,
              }))}
            />
          </div>

          <div className="mt-8 pt-6 border-t border-ink/10 text-sm text-ink/60 space-y-1.5">
            <p>✓ Orders confirmed and paid for directly on WhatsApp</p>
            <p>✓ Delivery arranged after order confirmation</p>
            <p>✓ Questions? Message us any time — see the FAQ page for details</p>
          </div>
        </div>
      </div>
    </div>
  );
}
