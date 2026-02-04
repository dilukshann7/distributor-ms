/*
  Warnings:

  - You are about to drop the column `loyaltyPoints` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `totalPurchases` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `totalSpent` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "loyaltyPoints",
DROP COLUMN "totalPurchases",
DROP COLUMN "totalSpent";
