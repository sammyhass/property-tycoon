/*
  Warnings:

  - You are about to drop the column `property` on the `BoardSpace` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[property_id]` on the table `BoardSpace` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "BoardSpace" DROP CONSTRAINT "BoardSpace_property_fkey";

-- DropIndex
DROP INDEX "BoardSpace_property_key";

-- AlterTable
ALTER TABLE "BoardSpace" DROP COLUMN "property",
ADD COLUMN     "property_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "BoardSpace_property_id_key" ON "BoardSpace"("property_id");

-- AddForeignKey
ALTER TABLE "BoardSpace" ADD CONSTRAINT "BoardSpace_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "GameProperty"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
