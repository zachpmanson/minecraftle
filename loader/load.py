import csv
import sys, os

# Reading from a CSV file
with open("mctl.csv", "r") as file:
    with open("users.sql", "w") as user_query:
        user_query.write(
            """
INSERT INTO public.user (user_id, last_game_date)
VALUES
"""
        )
        with open("games.sql", "w") as game_query:
            game_query.write(
                f"""
    INSERT INTO public.game_count (user_id, attempts, game_count)
    VALUES
    """
            )
            reader = csv.reader(file)
            for i, row in enumerate(reader):
                if i == 0:
                    continue

                user_query.write(
                    f"""
 ('{row[1]}', '{row[2]}'),"""
                )
                if row[3] == "0":
                    attempts = "11"
                else:
                    attempts = row[4]

                game_query.write(
                    f"""
    ('{row[1]}', {attempts}, 1),"""
                )

                if len(sys.argv) > 1 and i > int(sys.argv[1]):
                    break
            game_query.seek(game_query.tell() - 1, os.SEEK_SET)
            game_query.write("")
            game_query.write(
                """
ON CONFLICT (user_id, attempts)
    DO UPDATE SET
    game_count = public.game_count.game_count + 1;
            """
            )

        user_query.seek(user_query.tell() - 1, os.SEEK_SET)
        user_query.write("")
        user_query.write(
            """
ON CONFLICT (user_id)
    DO UPDATE SET
    last_game_date = excluded.last_game_date
;
        """
        )
