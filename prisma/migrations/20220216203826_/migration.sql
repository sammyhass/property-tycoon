/*
  Warnings:

  - You are about to drop the column `property` on the `CardAction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CardAction" DROP CONSTRAINT "CardAction_property_fkey";

-- AlterTable
ALTER TABLE "CardAction" DROP COLUMN "property",
ADD COLUMN     "property_id" UUID;

-- AddForeignKey
ALTER TABLE "CardAction" ADD CONSTRAINT "CardAction_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "GameProperty"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
