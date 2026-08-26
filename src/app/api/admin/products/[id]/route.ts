import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } }, variants: true, category: true },
  });
  if (!product) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    variants,
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
    variants?: { id?: string; label: string; stock: number }[];
  };

  if (!name?.trim() || !description?.trim() || !categoryId || !priceMinor || priceMinor <= 0) {
    return NextResponse.json(
      { error: "Name, description, category and a valid price are required." },
      { status: 400 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description.trim(),
        fabric: fabric?.trim() || null,
        priceMinor,
        compareAtMinor: compareAtMinor || null,
        featured: !!featured,
        active: active ?? true,
        categoryId,
      },
    });

    // Replace images wholesale — simplest correct approach for an MVP admin.
    if (imageUrls) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productImage.createMany({
        data: imageUrls
          .filter((u) => u?.trim())
          .map((url, position) => ({ productId: id, url: url.trim(), alt: name.trim(), position })),
      });
    }

    // Upsert variants: update existing by id, create new ones without an id.
    if (variants) {
      for (const v of variants) {
        if (!v.label?.trim()) continue;
        if (v.id) {
          await tx.productVariant.update({
            where: { id: v.id },
            data: { label: v.label.trim(), stock: v.stock ?? 0 },
          });
        } else {
          await tx.productVariant.create({
            data: { productId: id, label: v.label.trim(), stock: v.stock ?? 0 },
          });
        }
      }
    }
  });

  const updated = await prisma.product.findUnique({
    where: { id },
    include: { images: true, variants: true, category: true },
  });

  return NextResponse.json({ product: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
