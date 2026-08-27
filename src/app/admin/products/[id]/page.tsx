import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { position: "asc" } }, variants: true },
    }),
    prisma.category.findMany({ orderBy: { position: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display font-black uppercase text-2xl mb-6">Edit Product</h1>
      <ProductForm
        productId={product.id}
        categories={categories}
        initial={{
          name: product.name,
          brandName: product.brandName ?? "",
          isAd: product.isAd,
          description: product.description,
          fabric: product.fabric ?? "",
          price: (product.priceMinor / 100).toString(),
          compareAtPrice: product.compareAtMinor ? (product.compareAtMinor / 100).toString() : "",
          promotionLabel: product.promotionLabel ?? "",
          categoryId: product.categoryId,
          featured: product.featured,
          active: product.active,
          imageUrls: product.images.length ? product.images.map((i) => i.url) : [""],
          variants: product.variants.map((v) => ({ id: v.id, label: v.label, stock: v.stock })),
        }}
      />
    </div>
  );
}
