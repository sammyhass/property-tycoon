/*
  Warnings:

  - The primary key for the `game_property` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "board_space" DROP CONSTRAINT "board_space_property_fkey";

-- AlterTable
ALTER TABLE "board_space" ALTER COLUMN "property" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "game_property" DROP CONSTRAINT "game_property_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "game_property_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "game_property_id_seq";

-- AddForeignKey
ALTER TABLE "board_space" ADD CONSTRAINT "board_space_property_fkey" FOREIGN KEY ("property") REFERENCES "game_property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
