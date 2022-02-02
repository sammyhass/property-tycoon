/*
  Warnings:

  - A unique constraint covering the columns `[active]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "active" BOOLEAN;

-- CreateIndex
CREATE UNIQUE INDEX "Game_active_key" ON "Game"("active");
