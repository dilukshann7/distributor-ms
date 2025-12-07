/*
  Warnings:

  - You are about to drop the column `category` on the `CustomerFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `CustomerFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `respondedAt` on the `CustomerFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `respondedBy` on the `CustomerFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `response` on the `CustomerFeedback` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CustomerFeedback" DROP COLUMN "category",
DROP COLUMN "rating",
DROP COLUMN "respondedAt",
DROP COLUMN "respondedBy",
DROP COLUMN "response";

-- AddForeignKey
ALTER TABLE "CustomerFeedback" ADD CONSTRAINT "CustomerFeedback_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerFeedback" ADD CONSTRAINT "CustomerFeedback_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "SalesOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
