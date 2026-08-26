import { prisma } from "./db";

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { position: "asc" } });
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { active: true, featured: true },
    include: { images: { orderBy: { position: "asc" } }, category: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}

export async function getProducts(params: {
  categorySlug?: string;
  sort?: "newest" | "price-asc" | "price-desc";
}) {
  const { categorySlug, sort = "newest" } = params;

  const orderBy =
    sort === "price-asc"
      ? { priceMinor: "asc" as const }
      : sort === "price-desc"
      ? { priceMinor: "desc" as const }
      : { createdAt: "desc" as const };

  return prisma.product.findMany({
    where: {
      active: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: { images: { orderBy: { position: "asc" } }, category: true },
    orderBy,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      variants: { orderBy: { label: "asc" } },
      category: true,
    },
  });
}
