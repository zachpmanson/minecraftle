/*
  Warnings:

  - A unique constraint covering the columns `[user_id,date]` on the table `game` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "game_user_id_date_key" ON "game"("user_id", "date");
