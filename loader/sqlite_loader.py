import sqlite3
import sys, os
import csv

conn = sqlite3.connect("new_schema.db")
cur = conn.cursor()
cur.execute(
    """
-- CreateTable
CREATE TABLE IF NOT EXISTS "user" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "last_game_date" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);
"""
)
cur.execute(
    """

-- CreateTable
CREATE TABLE IF NOT EXISTS "game_count" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL,
    "game_count" INTEGER NOT NULL,

    CONSTRAINT "game_count_pkey" PRIMARY KEY ("id")
);
"""
)

cur.execute(
    """
-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "user_user_id_key" ON "user"("user_id");
"""
)
cur.execute(
    """
-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "game_count_user_id_attempts_key" ON "game_count"("user_id", "attempts");
"""
)
# Reading from a CSV file
with open("mctl.csv", "r") as file:
    reader = csv.reader(file)
    for i, row in enumerate(reader):
        if i == 0:
            continue

        cur.execute(
            f"""
INSERT INTO user (id, user_id, last_game_date)
VALUES ({i},'{row[1]}', '{row[2]}')
ON CONFLICT (user_id)
DO UPDATE SET last_game_date = excluded.last_game_date;"""
        )
        if row[3] == "0":
            attempts = "11"
        else:
            attempts = row[4]

        cur.execute(
            f"""
INSERT INTO game_count (id, user_id, attempts, game_count)
VALUES ({i}, '{row[1]}', {attempts}, 1)
ON CONFLICT (user_id, attempts)
DO UPDATE SET game_count = game_count.game_count + 1;"""
        )

        if len(sys.argv) > 1 and i > int(sys.argv[1]):
            break

conn.commit()
