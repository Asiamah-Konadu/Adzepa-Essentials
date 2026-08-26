import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import slugify from "slugify";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true, images: true, variants: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body." }, { status: 400 });

  const {
    name,
    description,
    fabric,
    priceMinor,
    compareAtMinor,
    featured,
    active,
    categoryId,
    imageUrls,
    variantLabels,
  } = body as {
    name?: string;
    description?: string;
    fabric?: string;
    priceMinor?: number;
    compareAtMinor?: number | null;
    featured?: boolean;
    active?: boolean;
    categoryId?: string;
    imageUrls?: string[];
    variantLabels?: { label: string; stock: number }[];
  };

  if (!name?.trim() || !description?.trim() || !categoryId || !priceMinor || priceMinor <= 0) {
    return NextResponse.json(
      { error: "Name, description, category and a valid price are required." },
      { status: 400 }
    );
  }

  const baseSlug = slugify(name, { lower: true, strict: true });
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const product = await prisma.product.create({
    data: {
      name: name.trim(),
      slug,
      description: description.trim(),
      fabric: fabric?.trim() || null,
      priceMinor,
      compareAtMinor: compareAtMinor || null,
      featured: !!featured,
      active: active ?? true,
      categoryId,
      images: {
        create: (imageUrls ?? [])
          .filter((u) => u?.trim())
          .map((url, position) => ({ url: url.trim(), alt: name.trim(), position })),
      },
      variants: {
        create: (variantLabels ?? [])
          .filter((v) => v.label?.trim())
          .map((v) => ({ label: v.label.trim(), stock: v.stock ?? 0 })),
      },
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
