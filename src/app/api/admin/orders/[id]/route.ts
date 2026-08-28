import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSessionEmail } from "@/lib/auth";

const VALID_STATUSES = ["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"] as const;
const VALID_PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminEmail = await getAdminSessionEmail();
  if (!adminEmail) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { status, paymentStatus, paymentMethod } = body as {
    status?: string;
    paymentStatus?: string;
    paymentMethod?: string;
  };

  if (status && !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  if (paymentStatus && !VALID_PAYMENT_STATUSES.includes(paymentStatus as (typeof VALID_PAYMENT_STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid payment status." }, { status: 400 });
  }
  if (!status && !paymentStatus) {
    return NextResponse.json({ error: "No order changes provided." }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      ...(status ? { status: status as (typeof VALID_STATUSES)[number] } : {}),
      ...(paymentStatus === "PAID"
        ? { paymentStatus: "PAID", paidAt: new Date(), paidBy: adminEmail, paymentMethod: paymentMethod?.trim() || null }
        : paymentStatus
        ? { paymentStatus: paymentStatus as (typeof VALID_PAYMENT_STATUSES)[number] }
        : {}),
    },
  });

  return NextResponse.json({ order });
}
