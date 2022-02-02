-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SpaceType" ADD VALUE 'GO';
ALTER TYPE "SpaceType" ADD VALUE 'GO_TO_JAIL';
ALTER TYPE "SpaceType" ADD VALUE 'JUST_VISIT';
ALTER TYPE "SpaceType" ADD VALUE 'FREE_PARKING';

-- DropIndex
DROP INDEX "BoardSpace_board_position_key";
