import Link from "next/link";
import Image from "next/image";
import { formatMoney } from "@/lib/money";

type ProductCardProps = {
  slug: string;
  name: string;
  imageUrl: string;
  priceMinor: number;
  compareAtMinor?: number | null;
  categoryName?: string;
  brandName?: string | null;
  isAd?: boolean;
  inverse?: boolean;
};

export default function ProductCard({
  slug,
  name,
  imageUrl,
  priceMinor,
  compareAtMinor,
  categoryName,
  brandName,
  isAd = false,
  inverse = false,
}: ProductCardProps) {
  const onSale = compareAtMinor && compareAtMinor > priceMinor;

  return (
    <Link href={`/product/${slug}`} className="group block">
      <div>
        <div className="relative aspect-[4/5] overflow-hidden bg-sand/40">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {onSale && (
            <span className="tag-badge absolute top-3 left-3 bg-paper/95 text-signal">
              Sale
            </span>
          )}
        </div>
      </div>
      <div className={`mt-3 flex items-start justify-between gap-2 ${inverse ? "text-paper" : ""}`}>
        <div>
          {(brandName || categoryName || isAd) && (
            <p className="font-tag text-[11px] uppercase tracking-tag text-muted mb-0.5">
              {isAd && "Ad · "}{brandName && `${brandName} · `}{categoryName}
            </p>
          )}
          <h3 className="font-display font-bold text-sm leading-snug">{name}</h3>
        </div>
        <div className="text-right shrink-0">
          <p className="font-body font-semibold text-sm">{formatMoney(priceMinor)}</p>
          {onSale && (
            <p className="font-body text-xs text-muted line-through">
              {formatMoney(compareAtMinor!)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
