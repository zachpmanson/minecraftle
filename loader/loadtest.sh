#!/usr/bin/env bash

python3 load.py $1
echo created sql bulk inserts
# cat -n users.sql | sort -k2 -k1n  | uniq -f1 | sort -nk1,1 | cut -f2- > clean_users.sql
# cat -n games.sql | sort -k2 -k1n  | uniq -f1 | sort -nk1,1 | cut -f2- > clean_games.sql
echo removing duplicates
psql -h localhost -d minecraftle -f users.sql > output1.
echo inserted users
psql -h localhost -d minecraftle -f games.sql > output2.txt
echo inserted games
time psql -h localhost -d minecraftle -f bigquery.sql -o output3.txt