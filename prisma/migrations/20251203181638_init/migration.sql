/*
  Warnings:

  - You are about to drop the column `pendingPayment` on the `SalesOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SalesOrder" DROP COLUMN "pendingPayment";
