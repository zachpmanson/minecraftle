/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `game` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "game_user_id_key" ON "game"("user_id");
