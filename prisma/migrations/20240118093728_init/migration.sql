-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "last_game_date" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_count" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL,
    "game_count" INTEGER NOT NULL,

    CONSTRAINT "game_count_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_user_id_key" ON "user"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "game_count_user_id_attempts_key" ON "game_count"("user_id", "attempts");
