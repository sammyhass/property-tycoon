/*
  Warnings:

  - You are about to drop the column `property_group_id` on the `GameProperty` table. All the data in the column will be lost.
  - The primary key for the `PropertyGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PropertyGroup` table. All the data in the column will be lost.
  - The `color` column on the `PropertyGroup` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[color,game_id]` on the table `PropertyGroup` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `property_group_color` to the `GameProperty` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "property_group_color" AS ENUM ('NONE', 'BLUE', 'GREEN', 'RED', 'YELLOW', 'TEAL', 'PURPLE', 'PINK', 'ORANGE', 'GREY');

-- DropForeignKey
ALTER TABLE "GameProperty" DROP CONSTRAINT "GameProperty_property_group_id_fkey";

-- DropIndex
DROP INDEX "GameCard_game_id_id_key";

-- DropIndex
DROP INDEX "PropertyGroup_color_key";

-- AlterTable
ALTER TABLE "GameProperty" DROP COLUMN "property_group_id",
ADD COLUMN     "property_group_color" "property_group_color" NOT NULL;

-- AlterTable
ALTER TABLE "PropertyGroup" DROP CONSTRAINT "PropertyGroup_pkey",
DROP COLUMN "id",
DROP COLUMN "color",
ADD COLUMN     "color" "property_group_color" NOT NULL DEFAULT E'NONE',
ADD CONSTRAINT "PropertyGroup_pkey" PRIMARY KEY ("color", "game_id");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyGroup_color_game_id_key" ON "PropertyGroup"("color", "game_id");

-- AddForeignKey
ALTER TABLE "GameProperty" ADD CONSTRAINT "GameProperty_property_group_color_game_id_fkey" FOREIGN KEY ("property_group_color", "game_id") REFERENCES "PropertyGroup"("color", "game_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
