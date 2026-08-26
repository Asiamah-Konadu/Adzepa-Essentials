"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

type Variant = {
  id: string;
  label: string;
  stock: number;
};

export default function AddToCartForm({
  productId,
  productName,
  productSlug,
  image,
  priceMinor,
  variants,
}: {
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  priceMinor: number;
  variants: Variant[];
}) {
  const { addLine } = useCart();
  const router = useRouter();
  const [selected, setSelected] = useState<string>(
    variants.find((v) => v.stock > 0)?.id ?? variants[0]?.id ?? ""
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant = variants.find((v) => v.id === selected);
  const outOfStock = !selectedVariant || selectedVariant.stock <= 0;

  function handleAdd() {
    if (!selectedVariant || outOfStock) return;
    addLine({
      productId,
      productName,
      productSlug,
      image,
      variantId: selectedVariant.id,
      variantLabel: selectedVariant.label,
      unitPriceMinor: priceMinor,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div>
      <fieldset>
        <legend className="font-tag text-xs uppercase tracking-tag text-muted mb-2">
          Size
        </legend>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => {
            const disabled = v.stock <= 0;
            const isActive = selected === v.id;
            return (
              <button
                key={v.id}
                type="button"
                disabled={disabled}
                onClick={() => setSelected(v.id)}
                aria-pressed={isActive}
                className={`min-w-[3rem] px-3 py-2.5 border font-tag text-sm transition-colors ${
                  disabled
                    ? "border-ink/10 text-ink/30 line-through cursor-not-allowed"
                    : isActive
                    ? "bg-ink text-paper border-ink"
                    : "border-ink/30 hover:border-ink"
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </div>
        {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 3 && (
          <p className="text-xs text-signal mt-2">
            Only {selectedVariant.stock} left in this size
          </p>
        )}
      </fieldset>

      <div className="mt-6 flex items-center gap-3">
        <label className="font-tag text-xs uppercase tracking-tag text-muted" htmlFor="qty">
          Qty
        </label>
        <div className="flex items-center border border-ink/20">
          <button
            type="button"
            className="px-3 py-2 hover:bg-ink hover:text-paper transition-colors"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span id="qty" className="px-4 font-body text-sm" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            className="px-3 py-2 hover:bg-ink hover:text-paper transition-colors"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className="flex-1 bg-ink text-paper font-tag text-sm uppercase tracking-tag px-6 py-4 hover:bg-signal transition-colors disabled:bg-ink/20 disabled:cursor-not-allowed"
        >
          {outOfStock ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
        </button>
        <button
          type="button"
          onClick={() => {
            handleAdd();
            router.push("/cart");
          }}
          disabled={outOfStock}
          className="flex-1 border border-ink font-tag text-sm uppercase tracking-tag px-6 py-4 hover:bg-ink hover:text-paper transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Buy via WhatsApp
        </button>
      </div>
    </div>
  );
}
