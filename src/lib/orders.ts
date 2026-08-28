import type { Prisma } from "@prisma/client";

export async function nextOrderNumber(tx: Prisma.TransactionClient): Promise<string> {
  const dateKey = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const sequence = await tx.orderSequence.upsert({
    where: { dateKey },
    create: { dateKey, nextValue: 2 },
    update: { nextValue: { increment: 1 } },
  });
  const value = sequence.nextValue - (sequence.nextValue > 1 ? 1 : 0);
  return `ORD-${dateKey}-${String(value).padStart(4, "0")}`;
}