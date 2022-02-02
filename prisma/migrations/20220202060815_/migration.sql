-- DropForeignKey
ALTER TABLE "BoardSpace" DROP CONSTRAINT "BoardSpace_game_id_fkey";

-- AddForeignKey
ALTER TABLE "BoardSpace" ADD CONSTRAINT "BoardSpace_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
