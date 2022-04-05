-- AlterEnum
ALTER TYPE "SpaceType" ADD VALUE 'TAX';

-- AlterTable
ALTER TABLE "BoardSpace" ADD COLUMN     "tax_cost" INTEGER DEFAULT 0;
