-- CreateTable
CREATE TABLE "game" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "win" INTEGER NOT NULL,
    "attempts" INTEGER,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);
