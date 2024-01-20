#!/usr/bin/env bash
psql -h localhost -d minecraftle -c 'REFRESH MATERIALIZED VIEW scoreboard;'