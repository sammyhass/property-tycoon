/*
  Warnings:

  - The values [NONE] on the enum `SpaceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SpaceType_new" AS ENUM ('EMPTY', 'PROPERTY', 'TAKE_CARD', 'GO', 'GO_TO_JAIL', 'JUST_VISIT', 'FREE_PARKING');
ALTER TABLE "BoardSpace" ALTER COLUMN "space_type" DROP DEFAULT;
ALTER TABLE "BoardSpace" ALTER COLUMN "space_type" TYPE "SpaceType_new" USING ("space_type"::text::"SpaceType_new");
ALTER TYPE "SpaceType" RENAME TO "SpaceType_old";
ALTER TYPE "SpaceType_new" RENAME TO "SpaceType";
DROP TYPE "SpaceType_old";
ALTER TABLE "BoardSpace" ALTER COLUMN "space_type" SET DEFAULT 'PROPERTY';
COMMIT;
