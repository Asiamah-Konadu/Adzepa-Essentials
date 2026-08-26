import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { position: "asc" } });

  return (
    <div>
      <h1 className="font-display font-black uppercase text-2xl mb-6">New Product</h1>
      <ProductForm
        categories={categories}
        initial={{
          name: "",
          description: "",
          fabric: "",
          price: "",
          compareAtPrice: "",
          categoryId: categories[0]?.id ?? "",
          featured: false,
          active: true,
          imageUrls: [""],
          variants: [{ label: "", stock: 0 }],
        }}
      />
    </div>
  );
}
