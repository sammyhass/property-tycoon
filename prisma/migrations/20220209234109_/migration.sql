/*
  Warnings:

  - A unique constraint covering the columns `[id,user_id]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Game_id_user_id_key" ON "Game"("id", "user_id");
