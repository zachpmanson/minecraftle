import csv
import sys
from pathlib import Path

INPUT_FILE = "mctl.csv"
USER_OUTPUT = "users.sql"
GAME_OUTPUT = "games.sql"


def parse_row(row):
    user_id = row[1]
    last_game_date = row[2]

    attempts = 11 if row[3] == "0" else int(row[4])

    return {
        "user_id": user_id,
        "last_game_date": last_game_date,
        "attempts": attempts,
    }


def read_csv(limit=None):
    data = []

    with open(INPUT_FILE, newline="") as file:
        reader = csv.reader(file)
        next(reader)  # skip header

        for i, row in enumerate(reader, start=1):
            data.append(parse_row(row))

            if limit and i >= limit:
                break

    return data


def generate_users_sql(data):
    values = ",\n".join(
        f"('{d['user_id']}', '{d['last_game_date']}')" for d in data
    )

    return f"""
INSERT INTO public.user (user_id, last_game_date)
VALUES
{values}
ON CONFLICT (user_id)
DO UPDATE SET
    last_game_date = excluded.last_game_date;
"""


def generate_games_sql(data):
    values = ",\n".join(
        f"('{d['user_id']}', {d['attempts']}, 1)" for d in data
    )

    return f"""
INSERT INTO public.game_count (user_id, attempts, game_count)
VALUES
{values}
ON CONFLICT (user_id, attempts)
DO UPDATE SET
    game_count = public.game_count.game_count + 1;
"""


def main():
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else None

    data = read_csv(limit)

    Path(USER_OUTPUT).write_text(generate_users_sql(data))
    Path(GAME_OUTPUT).write_text(generate_games_sql(data))


if __name__ == "__main__":
    main()
