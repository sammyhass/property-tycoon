/*
  Warnings:

  - The primary key for the `PropertyGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `color` column on the `PropertyGroup` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `GameCardAction` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[color,game_id]` on the table `PropertyGroup` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `property_group_color` on the `GameProperty` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CardActionType" AS ENUM ('PAY_PLAYER', 'PAY_BANK', 'PAY_ALL_PLAYERS', 'GO_TO_JAIL', 'GO_TO_GO', 'GO_TO_PROPERTY', 'EARN_FROM_BANK', 'EARN_FROM_PLAYER');

-- CreateEnum
CREATE TYPE "PropertyGroupColor" AS ENUM ('NONE', 'BLUE', 'GREEN', 'RED', 'YELLOW', 'TEAL', 'PURPLE', 'PINK', 'ORANGE', 'GREY');

-- DropForeignKey
ALTER TABLE "GameCardAction" DROP CONSTRAINT "GameCardAction_game_id_fkey";

-- DropForeignKey
ALTER TABLE "GameCardAction" DROP CONSTRAINT "GameCardAction_property_fkey";

-- DropForeignKey
ALTER TABLE "GameProperty" DROP CONSTRAINT "GameProperty_property_group_color_game_id_fkey";

-- AlterTable
ALTER TABLE "GameProperty" DROP COLUMN "property_group_color",
ADD COLUMN     "property_group_color" "PropertyGroupColor" NOT NULL;

-- AlterTable
ALTER TABLE "PropertyGroup" DROP CONSTRAINT "PropertyGroup_pkey",
DROP COLUMN "color",
ADD COLUMN     "color" "PropertyGroupColor" NOT NULL DEFAULT E'NONE',
ADD CONSTRAINT "PropertyGroup_pkey" PRIMARY KEY ("color", "game_id");

-- DropTable
DROP TABLE "GameCardAction";

-- DropEnum
DROP TYPE "card_action_type";

-- DropEnum
DROP TYPE "property_group_color";

-- CreateTable
CREATE TABLE "CardAction" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "cost" INTEGER DEFAULT 0,
    "game_id" UUID NOT NULL,
    "action_type" "CardActionType" NOT NULL DEFAULT E'GO_TO_GO',
    "description" TEXT NOT NULL,
    "property" UUID,
    "type" "CardType" NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "CardAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PropertyGroup_color_game_id_key" ON "PropertyGroup"("color", "game_id");

-- AddForeignKey
ALTER TABLE "CardAction" ADD CONSTRAINT "CardAction_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CardAction" ADD CONSTRAINT "CardAction_property_fkey" FOREIGN KEY ("property") REFERENCES "GameProperty"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GameProperty" ADD CONSTRAINT "GameProperty_property_group_color_game_id_fkey" FOREIGN KEY ("property_group_color", "game_id") REFERENCES "PropertyGroup"("color", "game_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
