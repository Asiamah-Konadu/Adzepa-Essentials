-- Additive migration for secure order receipts. Existing orders are preserved.
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED');
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus"
  USING (CASE "status"::text WHEN 'CONFIRMED' THEN 'PROCESSING' WHEN 'FULFILLED' THEN 'COMPLETED' ELSE "status"::text END)::"OrderStatus";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
DROP TYPE "OrderStatus_old";

CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
ALTER TABLE "Order"
  ADD COLUMN "orderNumber" TEXT,
  ADD COLUMN "idempotencyKey" TEXT,
  ADD COLUMN "customerEmail" TEXT,
  ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "paymentMethod" TEXT,
  ADD COLUMN "paidAt" TIMESTAMP(3),
  ADD COLUMN "paidBy" TEXT,
  ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'GHS',
  ADD COLUMN "subtotalMinor" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "deliveryFeeMinor" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "discountMinor" INTEGER NOT NULL DEFAULT 0;

WITH numbered AS (
  SELECT "id", 'ORD-' || to_char("createdAt", 'YYYYMMDD') || '-' || lpad(row_number() OVER (PARTITION BY date("createdAt") ORDER BY "createdAt", "id")::text, 4, '0') AS number
  FROM "Order"
)
UPDATE "Order" SET "orderNumber" = numbered.number FROM numbered WHERE "Order"."id" = numbered."id";
UPDATE "Order" SET "idempotencyKey" = 'legacy-' || "id", "subtotalMinor" = "totalMinor" WHERE "idempotencyKey" IS NULL;
ALTER TABLE "Order" ALTER COLUMN "orderNumber" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "idempotencyKey" SET NOT NULL;

ALTER TABLE "OrderItem" ADD COLUMN "itemTotalMinor" INTEGER NOT NULL DEFAULT 0;
UPDATE "OrderItem" SET "itemTotalMinor" = "unitPriceMinor" * "quantity";
ALTER TABLE "OrderItem" ALTER COLUMN "productId" DROP NOT NULL;
ALTER TABLE "OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_productId_fkey";
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_variantId_fkey";
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE UNIQUE INDEX "Order_idempotencyKey_key" ON "Order"("idempotencyKey");
CREATE TABLE "OrderSequence" (
  "dateKey" TEXT NOT NULL,
  "nextValue" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "OrderSequence_pkey" PRIMARY KEY ("dateKey")
);