-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('POT_LUCK', 'OPPORTUNITY_KNOCKS');

-- CreateEnum
CREATE TYPE "SpaceType" AS ENUM ('PROPERTY', 'TAKE_CARD');

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardSpace" (
    "board_position" INTEGER NOT NULL DEFAULT 0,
    "game_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "take_card" "CardType",
    "property" TEXT,
    "space_type" "SpaceType" NOT NULL DEFAULT E'PROPERTY',

    CONSTRAINT "BoardSpace_pkey" PRIMARY KEY ("board_position")
);

-- CreateTable
CREATE TABLE "GameCard" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "card_type" "CardType" NOT NULL,
    "text" TEXT NOT NULL,
    "card_action" TEXT,

    CONSTRAINT "GameCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameCardAction" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "cost" INTEGER DEFAULT 0,
    "game_card_id" TEXT,

    CONSTRAINT "GameCardAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameProperty" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER DEFAULT 0,
    "property_group_id" TEXT,

    CONSTRAINT "GameProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyGroup" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "color" TEXT NOT NULL,
    "house_cost" INTEGER,
    "hotel_cost" INTEGER,

    CONSTRAINT "PropertyGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BoardSpace_board_position_key" ON "BoardSpace"("board_position");

-- CreateIndex
CREATE INDEX "BoardSpace_board_position_game_id_idx" ON "BoardSpace"("board_position", "game_id");

-- CreateIndex
CREATE UNIQUE INDEX "BoardSpace_board_position_game_id_key" ON "BoardSpace"("board_position", "game_id");

-- CreateIndex
CREATE UNIQUE INDEX "BoardSpace_property_key" ON "BoardSpace"("property");

-- CreateIndex
CREATE UNIQUE INDEX "GameCard_game_id_id_key" ON "GameCard"("game_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "GameCardAction_game_card_id_key" ON "GameCardAction"("game_card_id");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyGroup_color_key" ON "PropertyGroup"("color");

-- AddForeignKey
ALTER TABLE "BoardSpace" ADD CONSTRAINT "BoardSpace_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardSpace" ADD CONSTRAINT "BoardSpace_property_fkey" FOREIGN KEY ("property") REFERENCES "GameProperty"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GameCard" ADD CONSTRAINT "GameCard_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCardAction" ADD CONSTRAINT "GameCardAction_game_card_id_fkey" FOREIGN KEY ("game_card_id") REFERENCES "GameCard"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GameProperty" ADD CONSTRAINT "GameProperty_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameProperty" ADD CONSTRAINT "GameProperty_property_group_id_fkey" FOREIGN KEY ("property_group_id") REFERENCES "PropertyGroup"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PropertyGroup" ADD CONSTRAINT "PropertyGroup_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
