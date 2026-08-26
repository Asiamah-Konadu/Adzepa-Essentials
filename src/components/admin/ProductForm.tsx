"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toMinor } from "@/lib/money";

type Category = { id: string; name: string };

export type ProductFormVariant = { id?: string; label: string; stock: number };

export type ProductFormValues = {
  name: string;
  description: string;
  fabric: string;
  price: string; // major units as a string for the input
  compareAtPrice: string;
  categoryId: string;
  featured: boolean;
  active: boolean;
  imageUrls: string[];
  variants: ProductFormVariant[];
};

export default function ProductForm({
  categories,
  initial,
  productId,
}: {
  categories: Category[];
  initial: ProductFormValues;
  productId?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!productId;

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function updateVariant(index: number, patch: Partial<ProductFormVariant>) {
    setValues((v) => ({
      ...v,
      variants: v.variants.map((variant, i) => (i === index ? { ...variant, ...patch } : variant)),
    }));
  }

  function addVariant() {
    setValues((v) => ({ ...v, variants: [...v.variants, { label: "", stock: 0 }] }));
  }

  function removeVariant(index: number) {
    setValues((v) => ({ ...v, variants: v.variants.filter((_, i) => i !== index) }));
  }

  function updateImageUrl(index: number, url: string) {
    setValues((v) => ({
      ...v,
      imageUrls: v.imageUrls.map((u, i) => (i === index ? url : u)),
    }));
  }

  function addImageUrl() {
    setValues((v) => ({ ...v, imageUrls: [...v.imageUrls, ""] }));
  }

  function removeImageUrl(index: number) {
    setValues((v) => ({ ...v, imageUrls: v.imageUrls.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: values.name,
      description: values.description,
      fabric: values.fabric,
      priceMinor: toMinor(parseFloat(values.price || "0")),
      compareAtMinor: values.compareAtPrice ? toMinor(parseFloat(values.compareAtPrice)) : null,
      categoryId: values.categoryId,
      featured: values.featured,
      active: values.active,
      imageUrls: values.imageUrls.filter((u) => u.trim()),
      ...(isEditing
        ? { variants: values.variants.filter((v) => v.label.trim()) }
        : { variantLabels: values.variants.filter((v) => v.label.trim()) }),
    };

    try {
      const res = await fetch(
        isEditing ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error((await res.json()).error || "Could not save product.");
      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {error && <p className="text-sm text-signal mb-4">{error}</p>}

      <Field label="Name">
        <input
          required
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full border border-ink/20 px-3 py-2 text-sm focus:border-ink outline-none"
        />
      </Field>

      <Field label="Description">
        <textarea
          required
          rows={3}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full border border-ink/20 px-3 py-2 text-sm focus:border-ink outline-none"
        />
      </Field>

      <Field label="Fabric / material note (optional)">
        <input
          value={values.fabric}
          onChange={(e) => update("fabric", e.target.value)}
          className="w-full border border-ink/20 px-3 py-2 text-sm focus:border-ink outline-none"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (GHS)">
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={values.price}
            onChange={(e) => update("price", e.target.value)}
            className="w-full border border-ink/20 px-3 py-2 text-sm focus:border-ink outline-none"
          />
        </Field>
        <Field label="Compare-at price (optional)">
          <input
            type="number"
            step="0.01"
            min="0"
            value={values.compareAtPrice}
            onChange={(e) => update("compareAtPrice", e.target.value)}
            className="w-full border border-ink/20 px-3 py-2 text-sm focus:border-ink outline-none"
          />
        </Field>
      </div>

      <Field label="Category">
        <select
          required
          value={values.categoryId}
          onChange={(e) => update("categoryId", e.target.value)}
          className="w-full border border-ink/20 px-3 py-2 text-sm focus:border-ink outline-none"
        >
          <option value="">Select a category…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex gap-6 mb-5">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => update("featured", e.target.checked)}
          />
          Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.active}
            onChange={(e) => update("active", e.target.checked)}
          />
          Visible in shop
        </label>
      </div>

      {/* Images */}
      <div className="mb-5">
        <label className="block font-tag text-[11px] uppercase tracking-tag text-muted mb-2">
          Image URLs (from /public/images/... or an external host)
        </label>
        <div className="space-y-2">
          {values.imageUrls.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={url}
                onChange={(e) => updateImageUrl(i, e.target.value)}
                placeholder="/images/products/example.webp"
                className="flex-1 border border-ink/20 px-3 py-2 text-sm focus:border-ink outline-none"
              />
              <button
                type="button"
                onClick={() => removeImageUrl(i)}
                className="text-xs text-signal underline shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addImageUrl}
          className="mt-2 text-xs font-tag uppercase tracking-tag underline"
        >
          + Add image
        </button>
      </div>

      {/* Variants */}
      <div className="mb-8">
        <label className="block font-tag text-[11px] uppercase tracking-tag text-muted mb-2">
          Sizes & stock
        </label>
        <div className="space-y-2">
          {values.variants.map((v, i) => (
            <div key={v.id ?? i} className="flex gap-2 items-center">
              <input
                value={v.label}
                onChange={(e) => updateVariant(i, { label: e.target.value })}
                placeholder="Size, e.g. M"
                className="w-28 border border-ink/20 px-3 py-2 text-sm focus:border-ink outline-none"
              />
              <input
                type="number"
                min="0"
                value={v.stock}
                onChange={(e) => updateVariant(i, { stock: parseInt(e.target.value || "0", 10) })}
                placeholder="Stock"
                className="w-24 border border-ink/20 px-3 py-2 text-sm focus:border-ink outline-none"
              />
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="text-xs text-signal underline shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addVariant}
          className="mt-2 text-xs font-tag uppercase tracking-tag underline"
        >
          + Add size
        </button>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-ink text-paper font-tag text-sm uppercase tracking-tag px-6 py-3.5 hover:bg-signal transition-colors disabled:opacity-50"
      >
        {saving ? "Saving…" : isEditing ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block font-tag text-[11px] uppercase tracking-tag text-muted mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
