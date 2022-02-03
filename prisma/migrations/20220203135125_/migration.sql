/*
  Warnings:

  - The primary key for the `BoardSpace` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Game` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PropertyGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[board_position,game_id]` on the table `BoardSpace` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[color,game_id]` on the table `PropertyGroup` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `game_id` on the `BoardSpace` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Game` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `game_id` on the `GameCard` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `game_id` on the `GameCardAction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `game_id` on the `GameProperty` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `game_id` on the `PropertyGroup` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "BoardSpace" DROP CONSTRAINT "BoardSpace_game_id_fkey";

-- DropForeignKey
ALTER TABLE "GameCard" DROP CONSTRAINT "GameCard_game_id_fkey";

-- DropForeignKey
ALTER TABLE "GameProperty" DROP CONSTRAINT "GameProperty_game_id_fkey";

-- DropForeignKey
ALTER TABLE "GameProperty" DROP CONSTRAINT "GameProperty_property_group_color_game_id_fkey";

-- DropForeignKey
ALTER TABLE "PropertyGroup" DROP CONSTRAINT "PropertyGroup_game_id_fkey";

-- AlterTable
ALTER TABLE "BoardSpace" DROP CONSTRAINT "BoardSpace_pkey",
DROP COLUMN "game_id",
ADD COLUMN     "game_id" UUID NOT NULL,
ADD CONSTRAINT "BoardSpace_pkey" PRIMARY KEY ("game_id", "board_position");

-- AlterTable
ALTER TABLE "Game" DROP CONSTRAINT "Game_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Game_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "GameCard" DROP COLUMN "game_id",
ADD COLUMN     "game_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "GameCardAction" DROP COLUMN "game_id",
ADD COLUMN     "game_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "GameProperty" DROP COLUMN "game_id",
ADD COLUMN     "game_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "PropertyGroup" DROP CONSTRAINT "PropertyGroup_pkey",
DROP COLUMN "game_id",
ADD COLUMN     "game_id" UUID NOT NULL,
ADD CONSTRAINT "PropertyGroup_pkey" PRIMARY KEY ("color", "game_id");

-- CreateIndex
CREATE INDEX "BoardSpace_board_position_game_id_idx" ON "BoardSpace"("board_position", "game_id");

-- CreateIndex
CREATE UNIQUE INDEX "BoardSpace_board_position_game_id_key" ON "BoardSpace"("board_position", "game_id");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyGroup_color_game_id_key" ON "PropertyGroup"("color", "game_id");

-- AddForeignKey
ALTER TABLE "BoardSpace" ADD CONSTRAINT "BoardSpace_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCard" ADD CONSTRAINT "GameCard_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GameProperty" ADD CONSTRAINT "GameProperty_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GameProperty" ADD CONSTRAINT "GameProperty_property_group_color_game_id_fkey" FOREIGN KEY ("property_group_color", "game_id") REFERENCES "PropertyGroup"("color", "game_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PropertyGroup" ADD CONSTRAINT "PropertyGroup_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
