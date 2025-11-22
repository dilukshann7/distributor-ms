/*
  Warnings:

  - A unique constraint covering the columns `[cartId]` on the table `SmallOrder` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "SmallOrder" DROP CONSTRAINT "SmallOrder_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "SmallOrder_cartId_key" ON "SmallOrder"("cartId");

-- AddForeignKey
ALTER TABLE "SmallOrder" ADD CONSTRAINT "SmallOrder_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
