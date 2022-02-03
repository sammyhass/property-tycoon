-- CreateEnum
CREATE TYPE "property_group_color" AS ENUM ('NONE', 'BLUE', 'GREEN', 'RED', 'YELLOW', 'TEAL', 'PURPLE', 'PINK', 'ORANGE', 'GREY');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('POT_LUCK', 'OPPORTUNITY_KNOCKS');

-- CreateEnum
CREATE TYPE "SpaceType" AS ENUM ('EMPTY', 'PROPERTY', 'TAKE_CARD', 'GO', 'GO_TO_JAIL', 'JUST_VISIT', 'FREE_PARKING');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "active" BOOLEAN,
    "user_id" UUID NOT NULL,

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

    CONSTRAINT "BoardSpace_pkey" PRIMARY KEY ("game_id","board_position")
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
    "property_group_color" "property_group_color" NOT NULL,

    CONSTRAINT "GameProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyGroup" (
    "game_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "house_cost" INTEGER,
    "hotel_cost" INTEGER,
    "color" "property_group_color" NOT NULL DEFAULT E'NONE',

    CONSTRAINT "PropertyGroup_pkey" PRIMARY KEY ("color","game_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Game_active_key" ON "Game"("active");

-- CreateIndex
CREATE UNIQUE INDEX "BoardSpace_property_key" ON "BoardSpace"("property");

-- CreateIndex
CREATE INDEX "BoardSpace_board_position_game_id_idx" ON "BoardSpace"("board_position", "game_id");

-- CreateIndex
CREATE UNIQUE INDEX "BoardSpace_board_position_game_id_key" ON "BoardSpace"("board_position", "game_id");

-- CreateIndex
CREATE UNIQUE INDEX "GameCardAction_game_card_id_key" ON "GameCardAction"("game_card_id");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyGroup_color_game_id_key" ON "PropertyGroup"("color", "game_id");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardSpace" ADD CONSTRAINT "BoardSpace_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardSpace" ADD CONSTRAINT "BoardSpace_property_fkey" FOREIGN KEY ("property") REFERENCES "GameProperty"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GameCard" ADD CONSTRAINT "GameCard_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GameCardAction" ADD CONSTRAINT "GameCardAction_game_card_id_fkey" FOREIGN KEY ("game_card_id") REFERENCES "GameCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameProperty" ADD CONSTRAINT "GameProperty_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GameProperty" ADD CONSTRAINT "GameProperty_property_group_color_game_id_fkey" FOREIGN KEY ("property_group_color", "game_id") REFERENCES "PropertyGroup"("color", "game_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PropertyGroup" ADD CONSTRAINT "PropertyGroup_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
