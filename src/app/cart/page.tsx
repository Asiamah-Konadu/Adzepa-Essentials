"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatMoney } from "@/lib/money";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";

export default function CartPage() {
  const { lines, updateQuantity, removeLine, totalMinor, clear } = useCart();
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    deliveryAddress: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCheckout =
    lines.length > 0 &&
    form.customerName.trim() &&
    form.customerPhone.trim() &&
    form.deliveryAddress.trim();

  async function handleCheckout() {
    if (!canCheckout) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: lines.map((l) => ({
            productId: l.productId,
            variantId: l.variantId,
            productName: l.productName,
            variantLabel: l.variantLabel,
            quantity: l.quantity,
            unitPriceMinor: l.unitPriceMinor,
          })),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Could not save your order. Please try again.");
      }

      const { orderId } = await res.json();

      const link = buildWhatsAppOrderLink(
        lines.map((l) => ({
          productName: l.productName,
            productSlug: l.productSlug,
          variantLabel: l.variantLabel,
          quantity: l.quantity,
          unitPriceMinor: l.unitPriceMinor,
        })),
        form,
        orderId
      );

      clear();
      window.location.href = link;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
        <h1 className="font-display font-black uppercase text-2xl mb-3">
          Your cart is empty
        </h1>
        <p className="text-ink/60 mb-6">Add a bomber or some fabric to get started.</p>
        <Link
          href="/shop"
          className="inline-block bg-ink text-paper font-tag text-sm uppercase tracking-tag px-6 py-3.5 hover:bg-signal transition-colors"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <h1 className="font-display font-black uppercase text-3xl mb-8">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Line items */}
        <div className="md:col-span-2 space-y-5">
          {lines.map((line) => (
            <div key={line.variantId} className="flex gap-4 pb-5 border-b border-ink/10">
              <div className="relative w-20 h-24 shrink-0 bg-sand/40 overflow-hidden">
                <Image src={line.image} alt={line.productName} fill sizes="80px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${line.productSlug}`} className="font-display font-bold text-sm hover:text-signal">
                  {line.productName}
                </Link>
                <p className="font-tag text-xs uppercase tracking-tag text-muted mt-1">
                  {line.variantLabel}
                </p>
                <p className="font-body text-sm mt-1">{formatMoney(line.unitPriceMinor)}</p>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-ink/20">
                    <button
                      type="button"
                      className="px-2.5 py-1 hover:bg-ink hover:text-paper transition-colors"
                      onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
                      aria-label={`Decrease quantity of ${line.productName}`}
                    >
                      −
                    </button>
                    <span className="px-3 text-sm">{line.quantity}</span>
                    <button
                      type="button"
                      className="px-2.5 py-1 hover:bg-ink hover:text-paper transition-colors"
                      onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
                      aria-label={`Increase quantity of ${line.productName}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLine(line.variantId)}
                    className="text-xs text-ink/50 underline hover:text-signal"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0 font-body font-semibold text-sm">
                {formatMoney(line.unitPriceMinor * line.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Checkout form */}
        <div>
          <div className="border border-ink/15 p-5 sticky top-24">
            <div className="flex justify-between items-baseline mb-5">
              <span className="font-tag text-xs uppercase tracking-tag text-muted">Total</span>
              <span className="font-display font-black text-2xl">{formatMoney(totalMinor)}</span>
            </div>

            <div className="space-y-3">
              <Field
                label="Full name"
                value={form.customerName}
                onChange={(v) => setForm((f) => ({ ...f, customerName: v }))}
                required
              />
              <Field
                label="WhatsApp phone number"
                value={form.customerPhone}
                onChange={(v) => setForm((f) => ({ ...f, customerPhone: v }))}
                type="tel"
                required
              />
              <Field
                label="Delivery address"
                value={form.deliveryAddress}
                onChange={(v) => setForm((f) => ({ ...f, deliveryAddress: v }))}
                textarea
                required
              />
              <Field
                label="Notes (optional)"
                value={form.notes}
                onChange={(v) => setForm((f) => ({ ...f, notes: v }))}
                textarea
              />
            </div>

            {error && <p className="text-sm text-signal mt-3">{error}</p>}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={!canCheckout || submitting}
              className="w-full mt-5 bg-teal text-paper font-tag text-sm uppercase tracking-tag px-6 py-4 hover:bg-ink transition-colors disabled:bg-ink/20 disabled:cursor-not-allowed"
            >
              {submitting ? "Preparing order…" : "Order via WhatsApp"}
            </button>
            <p className="text-xs text-ink/50 mt-3 text-center">
              You'll be redirected to WhatsApp with your order pre-filled to confirm and pay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="block font-tag text-[11px] uppercase tracking-tag text-muted mb-1">
        {label}{required && " *"}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          required={required}
          className="w-full border border-ink/20 px-3 py-2 text-sm focus:border-ink outline-none"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full border border-ink/20 px-3 py-2 text-sm focus:border-ink outline-none"
        />
      )}
    </div>
  );
}
