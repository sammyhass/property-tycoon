/*
  Warnings:

  - You are about to drop the `GameCard` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `GameCardAction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `GameCardAction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `GameCardAction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "card_action_type" AS ENUM ('PAY_PLAYER', 'PAY_BANK', 'PAY_ALL_PLAYERS', 'GO_TO_JAIL', 'GO_TO_GO', 'GO_TO_PROPERTY', 'EARN_FROM_BANK', 'EARN_FROM_PLAYER');

-- DropForeignKey
ALTER TABLE "GameCard" DROP CONSTRAINT "GameCard_game_id_fkey";

-- DropForeignKey
ALTER TABLE "GameCardAction" DROP CONSTRAINT "GameCardAction_game_card_id_fkey";

-- AlterTable
ALTER TABLE "GameCardAction" ADD COLUMN     "action_type" "card_action_type" NOT NULL DEFAULT E'GO_TO_GO',
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "property" TEXT,
ADD COLUMN     "text" TEXT NOT NULL,
ADD COLUMN     "type" "CardType" NOT NULL;

-- DropTable
DROP TABLE "GameCard";

-- AddForeignKey
ALTER TABLE "GameCardAction" ADD CONSTRAINT "GameCardAction_property_fkey" FOREIGN KEY ("property") REFERENCES "GameProperty"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
