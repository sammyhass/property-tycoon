/*
  Warnings:

  - The primary key for the `board_space` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "board_space" DROP CONSTRAINT "board_space_pkey",
ALTER COLUMN "board_position" SET DEFAULT 0,
ALTER COLUMN "board_position" SET DATA TYPE INTEGER,
ADD CONSTRAINT "board_space_pkey" PRIMARY KEY ("id", "board_position");
