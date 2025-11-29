/*
  Warnings:

  - You are about to drop the column `isVIP` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `lastVisit` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `proofOfDelivery` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `signature` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `trackingNumber` on the `Shipment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "isVIP",
DROP COLUMN "lastVisit";

-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "proofOfDelivery",
DROP COLUMN "signature";

-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "trackingNumber";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "attendance" SET DATA TYPE TEXT;
