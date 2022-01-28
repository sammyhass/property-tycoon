/*
  Warnings:

  - The primary key for the `board_space` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `board_space` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[board_position]` on the table `board_space` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "board_space" DROP CONSTRAINT "board_space_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "board_space_pkey" PRIMARY KEY ("board_position");

-- CreateIndex
CREATE UNIQUE INDEX "board_space_board_position_key" ON "board_space"("board_position");
