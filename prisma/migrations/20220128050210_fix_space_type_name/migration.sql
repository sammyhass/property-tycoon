/*
  Warnings:

  - The values [property,take_card] on the enum `space_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "space_type_new" AS ENUM ('PROPERTY', 'TAKE_CARD');
ALTER TABLE "board_space" ALTER COLUMN "space_type" DROP DEFAULT;
ALTER TABLE "board_space" ALTER COLUMN "space_type" TYPE "space_type_new" USING ("space_type"::text::"space_type_new");
ALTER TYPE "space_type" RENAME TO "space_type_old";
ALTER TYPE "space_type_new" RENAME TO "space_type";
DROP TYPE "space_type_old";
ALTER TABLE "board_space" ALTER COLUMN "space_type" SET DEFAULT 'PROPERTY';
COMMIT;

-- AlterTable
ALTER TABLE "board_space" ALTER COLUMN "space_type" SET DEFAULT E'PROPERTY';
