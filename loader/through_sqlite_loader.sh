#!/usr/bin/env bash

python3 sqlite_loader.py $1
echo "created sqlite database finished"

sqlite3 -csv new_schema.db "select user_id,last_game_date from user;" > user.csv
echo user csv created
sqlite3 -csv new_schema.db "select user_id,attempts,game_count from game_count;" > game_count.csv
echo game_count csv created


psql -h localhost -d minecraftle -f load_csv.sql > output.txt

