-- CreateEnum
CREATE TYPE "card_type" AS ENUM ('POT_LUCK', 'OPPORTUNITY_KNOCKS');

-- CreateEnum
CREATE TYPE "space_type" AS ENUM ('property', 'take_card');

-- CreateTable
CREATE TABLE "board_space" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "take_card" "card_type",
    "property" INTEGER,
    "space_type" "space_type" NOT NULL DEFAULT E'property',
    "board_position" SMALLSERIAL NOT NULL,

    CONSTRAINT "board_space_pkey" PRIMARY KEY ("id","board_position")
);

-- CreateTable
CREATE TABLE "game_card" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "card_type" "card_type" NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "game_card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_card_action" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "cost" INTEGER DEFAULT 0,
    "go_to_space" SMALLINT,

    CONSTRAINT "game_action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_property" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER DEFAULT 0,
    "property_group" INTEGER,

    CONSTRAINT "game_property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_group" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "color" TEXT NOT NULL,
    "house_cost" INTEGER,
    "hotel_cost" INTEGER,

    CONSTRAINT "property_group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "board_space_property_key" ON "board_space"("property");

-- CreateIndex
CREATE UNIQUE INDEX "property_group_color_key" ON "property_group"("color");

-- AddForeignKey
ALTER TABLE "board_space" ADD CONSTRAINT "board_space_property_fkey" FOREIGN KEY ("property") REFERENCES "game_property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
