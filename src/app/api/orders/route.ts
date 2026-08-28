import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { nextOrderNumber } from "@/lib/orders";

type IncomingItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

export async function POST(req: NextRequest) {
  let body: {
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    deliveryAddress?: string;
    notes?: string;
    idempotencyKey?: string;
    items?: IncomingItem[];
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { customerName, customerPhone, customerEmail, deliveryAddress, notes, idempotencyKey, items } = body;

  if (!customerName?.trim() || !customerPhone?.trim() || !deliveryAddress?.trim()) {
    return NextResponse.json(
      { error: "Name, phone and delivery address are required." },
      { status: 400 }
    );
  }

  if (!idempotencyKey || !/^[a-zA-Z0-9_-]{16,100}$/.test(idempotencyKey)) {
    return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
  }

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  for (const item of items) {
    if (!item.productId || !item.variantId || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
      return NextResponse.json({ error: "Invalid item in cart." }, { status: 400 });
    }
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({ where: { idempotencyKey }, include: { items: true } });
      if (existing) return existing;

      // Resolve names, prices, and stock server-side. Nothing price-related from the browser is trusted.
      const productItems = [] as {
        productId: string;
        variantId: string;
        productName: string;
        variantLabel: string;
        quantity: number;
        unitPriceMinor: number;
        itemTotalMinor: number;
      }[];

      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });
        if (!variant || variant.productId !== item.productId || !variant.product.active || variant.stock < item.quantity) {
          throw new Error(
            "One or more items are unavailable or out of stock."
          );
        }
        const itemTotalMinor = variant.product.priceMinor * item.quantity;
        productItems.push({
          productId: variant.product.id,
          variantId: variant.id,
          productName: variant.product.name,
          variantLabel: variant.label,
          quantity: item.quantity,
          unitPriceMinor: variant.product.priceMinor,
          itemTotalMinor,
        });
      }

      const subtotalMinor = productItems.reduce((sum, item) => sum + item.itemTotalMinor, 0);
      const orderNumber = await nextOrderNumber(tx);

      const created = await tx.order.create({
        data: {
          orderNumber,
          idempotencyKey,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail?.trim() || null,
          deliveryAddress: deliveryAddress.trim(),
          notes: notes?.trim() || null,
          subtotalMinor,
          totalMinor: subtotalMinor,
          items: {
            create: productItems.map((i) => ({
              productId: i.productId,
              variantId: i.variantId,
              productName: i.productName,
              variantLabel: i.variantLabel,
              quantity: i.quantity,
              unitPriceMinor: i.unitPriceMinor,
              itemTotalMinor: i.itemTotalMinor,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of productItems) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalMinor: order.totalMinor,
      items: order.items,
    }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not place order.";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
