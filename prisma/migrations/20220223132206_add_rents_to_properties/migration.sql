/*
  Warnings:

  - Added the required column `rent_four_house` to the `GameProperty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rent_hotel` to the `GameProperty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rent_one_house` to the `GameProperty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rent_three_house` to the `GameProperty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rent_two_house` to the `GameProperty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rent_unimproved` to the `GameProperty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameProperty" ADD COLUMN     "rent_four_house" INTEGER NOT NULL,
ADD COLUMN     "rent_hotel" INTEGER NOT NULL,
ADD COLUMN     "rent_one_house" INTEGER NOT NULL,
ADD COLUMN     "rent_three_house" INTEGER NOT NULL,
ADD COLUMN     "rent_two_house" INTEGER NOT NULL,
ADD COLUMN     "rent_unimproved" INTEGER NOT NULL;
