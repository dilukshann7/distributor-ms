/*
  Warnings:

  - Added the required column `supplierId` to the `Supply` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Supply" ADD COLUMN     "supplierId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Supply" ADD CONSTRAINT "Supply_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
