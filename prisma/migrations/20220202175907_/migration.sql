-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
