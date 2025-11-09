-- CreateTable
CREATE TABLE "SmallOrder" (
    "id" SERIAL NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "cartId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paymentMethod" TEXT,

    CONSTRAINT "SmallOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SmallOrder_orderNumber_key" ON "SmallOrder"("orderNumber");

-- AddForeignKey
ALTER TABLE "SmallOrder" ADD CONSTRAINT "SmallOrder_id_fkey" FOREIGN KEY ("id") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
