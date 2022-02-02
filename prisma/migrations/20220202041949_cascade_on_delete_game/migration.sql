-- DropForeignKey
ALTER TABLE "BoardSpace" DROP CONSTRAINT "BoardSpace_property_fkey";

-- DropForeignKey
ALTER TABLE "GameCard" DROP CONSTRAINT "GameCard_game_id_fkey";

-- DropForeignKey
ALTER TABLE "GameCardAction" DROP CONSTRAINT "GameCardAction_game_card_id_fkey";

-- DropForeignKey
ALTER TABLE "GameProperty" DROP CONSTRAINT "GameProperty_game_id_fkey";

-- DropForeignKey
ALTER TABLE "PropertyGroup" DROP CONSTRAINT "PropertyGroup_game_id_fkey";

-- AddForeignKey
ALTER TABLE "BoardSpace" ADD CONSTRAINT "BoardSpace_property_fkey" FOREIGN KEY ("property") REFERENCES "GameProperty"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GameCard" ADD CONSTRAINT "GameCard_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GameCardAction" ADD CONSTRAINT "GameCardAction_game_card_id_fkey" FOREIGN KEY ("game_card_id") REFERENCES "GameCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameProperty" ADD CONSTRAINT "GameProperty_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PropertyGroup" ADD CONSTRAINT "PropertyGroup_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
