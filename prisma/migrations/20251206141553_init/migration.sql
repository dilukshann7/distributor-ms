/*
  Warnings:

  - You are about to drop the column `attendance` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bonus` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `performanceRating` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AssistantManager" ADD COLUMN     "attendance" TEXT,
ADD COLUMN     "bonus" DOUBLE PRECISION,
ADD COLUMN     "performanceRating" INTEGER,
ADD COLUMN     "salary" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Cashier" ADD COLUMN     "attendance" TEXT,
ADD COLUMN     "bonus" DOUBLE PRECISION,
ADD COLUMN     "performanceRating" INTEGER,
ADD COLUMN     "salary" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Distributor" ADD COLUMN     "attendance" TEXT,
ADD COLUMN     "bonus" DOUBLE PRECISION,
ADD COLUMN     "performanceRating" INTEGER,
ADD COLUMN     "salary" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "attendance" TEXT,
ADD COLUMN     "bonus" DOUBLE PRECISION,
ADD COLUMN     "performanceRating" INTEGER,
ADD COLUMN     "salary" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Salesman" ADD COLUMN     "attendance" TEXT,
ADD COLUMN     "bonus" DOUBLE PRECISION,
ADD COLUMN     "performanceRating" INTEGER,
ADD COLUMN     "salary" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "StockKeeper" ADD COLUMN     "attendance" TEXT,
ADD COLUMN     "bonus" DOUBLE PRECISION,
ADD COLUMN     "performanceRating" INTEGER,
ADD COLUMN     "salary" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "attendance",
DROP COLUMN "bonus",
DROP COLUMN "performanceRating",
DROP COLUMN "salary";
