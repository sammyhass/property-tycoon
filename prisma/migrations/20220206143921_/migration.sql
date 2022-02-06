/*
  Warnings:

  - You are about to drop the column `game_card_id` on the `GameCardAction` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `GameCardAction` table. All the data in the column will be lost.
  - Added the required column `title` to the `GameCardAction` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GameCardAction_game_card_id_key";

-- AlterTable
ALTER TABLE "GameCardAction" DROP COLUMN "game_card_id",
DROP COLUMN "text",
ADD COLUMN     "title" TEXT NOT NULL;
