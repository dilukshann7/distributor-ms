/*
  Warnings:

  - You are about to drop the column `discount` on the `SalesOrder` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `SalesOrder` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `SalesOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SalesOrder" DROP COLUMN "discount",
DROP COLUMN "tax",
DROP COLUMN "totalAmount";
