/*
  Warnings:

  - You are about to drop the column `createdAt` on the `AssistantManager` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `AssistantManager` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Cashier` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Cashier` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Distributor` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Distributor` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Manager` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Manager` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Salesman` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Salesman` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `StockKeeper` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `StockKeeper` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Supplier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AssistantManager" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Cashier" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Distributor" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Manager" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Salesman" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "StockKeeper" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
