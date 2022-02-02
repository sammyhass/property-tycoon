/*
  Warnings:

  - The primary key for the `BoardSpace` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "BoardSpace" DROP CONSTRAINT "BoardSpace_pkey",
ADD CONSTRAINT "BoardSpace_pkey" PRIMARY KEY ("game_id", "board_position");
