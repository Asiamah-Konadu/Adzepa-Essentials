import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type IncomingItem = {
  productId: string;
  variantId: string;
  productName: string;
  variantLabel?: string;
  quantity: number;
  unitPriceMinor: number;
};

export async function POST(req: NextRequest) {
  let body: {
    customerName?: string;
    customerPhone?: string;
    deliveryAddress?: string;
    notes?: string;
    items?: IncomingItem[];
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { customerName, customerPhone, deliveryAddress, notes, items } = body;

  if (!customerName?.trim() || !customerPhone?.trim() || !deliveryAddress?.trim()) {
    return NextResponse.json(
      { error: "Name, phone and delivery address are required." },
      { status: 400 }
    );
  }

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  for (const item of items) {
    if (!item.productId || !item.variantId || item.quantity < 1) {
      return NextResponse.json({ error: "Invalid item in cart." }, { status: 400 });
    }
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Re-check stock server-side so two customers can't both buy the last unit.
      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
        });
        if (!variant || variant.stock < item.quantity) {
          throw new Error(
            `${item.productName} (${item.variantLabel ?? "selected size"}) is out of stock.`
          );
        }
      }

      const totalMinor = items.reduce(
        (sum, i) => sum + i.unitPriceMinor * i.quantity,
        0
      );

      const created = await tx.order.create({
        data: {
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          deliveryAddress: deliveryAddress.trim(),
          notes: notes?.trim() || null,
          totalMinor,
          items: {
            create: items.map((i) => ({
              productId: i.productId,
              variantId: i.variantId,
              productName: i.productName,
              variantLabel: i.variantLabel ?? null,
              quantity: i.quantity,
              unitPriceMinor: i.unitPriceMinor,
            })),
          },
        },
      });

      for (const item of items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not place order.";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
