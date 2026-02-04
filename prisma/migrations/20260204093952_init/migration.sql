/*
  Warnings:

  - You are about to drop the column `orderId` on the `CustomerFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `paidAmount` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `paidDate` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseOrderId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `supplierId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `supplierId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `SalesInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `SalesInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceNumber` on the `SalesInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `SalesInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SalesInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `SalesOrder` table. All the data in the column will be lost.
  - You are about to drop the column `items` on the `SalesOrder` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `SalesOrder` table. All the data in the column will be lost.
  - You are about to drop the column `orderDate` on the `SalesOrder` table. All the data in the column will be lost.
  - You are about to drop the column `orderNumber` on the `SalesOrder` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `SalesOrder` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `SalesOrder` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SalesOrder` table. All the data in the column will be lost.
  - You are about to drop the `SmallOrder` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[orderNumber]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invoiceId]` on the table `SalesInvoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `SalesOrder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `salesOrderId` to the `CustomerFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceType` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderNumber` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceId` to the `SalesInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `SalesOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CustomerFeedback" DROP CONSTRAINT "CustomerFeedback_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "SmallOrder" DROP CONSTRAINT "SmallOrder_cartId_fkey";

-- DropIndex
DROP INDEX "SalesInvoice_invoiceNumber_key";

-- DropIndex
DROP INDEX "SalesOrder_orderNumber_key";

-- AlterTable
ALTER TABLE "CustomerFeedback" DROP COLUMN "orderId",
ADD COLUMN     "salesOrderId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "balance",
DROP COLUMN "paidAmount",
DROP COLUMN "paidDate",
DROP COLUMN "purchaseOrderId",
DROP COLUMN "supplierId",
ADD COLUMN     "invoiceType" TEXT NOT NULL,
ADD COLUMN     "orderId" INTEGER NOT NULL,
ALTER COLUMN "dueDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "dueDate",
DROP COLUMN "supplierId",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "orderNumber" TEXT NOT NULL,
ADD COLUMN     "orderType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SalesInvoice" DROP COLUMN "createdAt",
DROP COLUMN "date",
DROP COLUMN "invoiceNumber",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "invoiceId" INTEGER NOT NULL,
ALTER COLUMN "paymentMethod" DROP NOT NULL,
ALTER COLUMN "items" DROP NOT NULL,
ALTER COLUMN "subtotal" DROP NOT NULL,
ALTER COLUMN "collectedAmount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SalesOrder" DROP COLUMN "createdAt",
DROP COLUMN "items",
DROP COLUMN "notes",
DROP COLUMN "orderDate",
DROP COLUMN "orderNumber",
DROP COLUMN "status",
DROP COLUMN "subtotal",
DROP COLUMN "updatedAt",
ADD COLUMN     "orderId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "SmallOrder";

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RetailOrder" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "cartId" INTEGER NOT NULL,

    CONSTRAINT "RetailOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseInvoice" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "purchaseOrderId" INTEGER NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "paidDate" TIMESTAMP(3),
    "paidAmount" DOUBLE PRECISION,
    "balance" DOUBLE PRECISION,

    CONSTRAINT "PurchaseInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_orderId_key" ON "PurchaseOrder"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "RetailOrder_orderId_key" ON "RetailOrder"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "RetailOrder_cartId_key" ON "RetailOrder"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseInvoice_invoiceId_key" ON "PurchaseInvoice"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SalesInvoice_invoiceId_key" ON "SalesInvoice"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "SalesOrder_orderId_key" ON "SalesOrder"("orderId");

-- AddForeignKey
ALTER TABLE "CustomerFeedback" ADD CONSTRAINT "CustomerFeedback_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES "SalesOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesOrder" ADD CONSTRAINT "SalesOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailOrder" ADD CONSTRAINT "RetailOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailOrder" ADD CONSTRAINT "RetailOrder_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseInvoice" ADD CONSTRAINT "PurchaseInvoice_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseInvoice" ADD CONSTRAINT "PurchaseInvoice_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseInvoice" ADD CONSTRAINT "PurchaseInvoice_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesInvoice" ADD CONSTRAINT "SalesInvoice_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
