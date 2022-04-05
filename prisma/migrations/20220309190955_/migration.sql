/*
  Warnings:

  - A unique constraint covering the columns `[share_code]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[game_id,name]` on the table `GameProperty` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "share_code" TEXT;

-- AlterTable
ALTER TABLE "GameProperty" ALTER COLUMN "rent_four_house" DROP NOT NULL,
ALTER COLUMN "rent_hotel" DROP NOT NULL,
ALTER COLUMN "rent_one_house" DROP NOT NULL,
ALTER COLUMN "rent_three_house" DROP NOT NULL,
ALTER COLUMN "rent_two_house" DROP NOT NULL,
ALTER COLUMN "rent_unimproved" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Game_share_code_key" ON "Game"("share_code");

-- CreateIndex
CREATE UNIQUE INDEX "GameProperty_game_id_name_key" ON "GameProperty"("game_id", "name");
