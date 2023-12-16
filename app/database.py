from app import app
import sqlite3


class DbConn:
    def __init__(self):
        self.get_database_connection()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.conn.close()

    def get_database_connection(self):
        self.conn = sqlite3.connect(
            "minecraftle.db",
            detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES,
        )

    def close_database_connection(self):
        self.conn.close()

    def create_table(self):
        """Creates new database if it doesn't already exist to store played games"""
        cursor = self.conn.cursor()
        try:
            sql_command = """CREATE TABLE IF NOT EXISTS games_played (
                    id INTEGER PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    date DATE NOT NULL,
                    win INTEGER NOT NULL,
                    attempts INTEGER
                )"""

            cursor.execute(sql_command)
            self.conn.commit()

            cursor.close()
        except:
            cursor.close()

    def insert_record(self, user_id, date, win, attempts):
        """Attempts to store data on a played game.  Will only allow 1 insert per
        user_id per day to avoid manipualting user stats.

        Parameters:
        user_id (str): UUID for each user
        date (datetime): day the game was played
        win (int): if player won the  game win == 1, otherwise win==0
        attempts (int): number of attempts made in the game

        Returns:
        int: last row id
        """
        if win == 0:
            attempts = None

        cursor = self.conn.cursor()
        print("game:", user_id, date, win, attempts)
        try:
            cursor.execute(
                "SELECT * FROM games_played WHERE user_id==? AND date==?",
                (user_id, date),
            )

            # Only allow 1 submission per day
            todays_submissions = cursor.fetchall()
            if len(todays_submissions) < 1:
                sql_command = f"""INSERT INTO games_played(user_id, date, win, attempts) VALUES (
                        ?,
                        ?,
                        ?,
                        ?
                    )
                    """
                cursor.execute(sql_command, (user_id, date, win, attempts))
                self.conn.commit()

            lastrowid = cursor.lastrowid

            cursor.close()
            return lastrowid
        except:
            cursor.close()

    def get_records(self, user_id):
        """Retrieves records for particular user_id

        Parameters:
        user_id (str): UUID of user

        Returns:
        list: list of all users number of wins, ordered by most wins then least avg attempts
        list: list containing tuple containing int, number of games played by user_id
        list: list with counts of games with x turns that given user has won
        """
        cursor = self.conn.cursor()
        try:
            # gets list of all users' number wins, in desc order
            cursor.execute(
                f"SELECT user_id, COUNT(win) FROM games_played WHERE win==1 GROUP BY user_id ORDER BY COUNT(win) DESC, AVG(attempts) ASC"
            )
            wins = cursor.fetchall()

            # get number of games played by this user
            cursor.execute(
                f"SELECT COUNT(*) FROM games_played WHERE user_id==?", (user_id,)
            )
            games_played = cursor.fetchall()

            # gets count of games with x turns that given user has won
            cursor.execute(
                f"SELECT attempts, COUNT(win) FROM games_played WHERE user_id==? GROUP BY attempts ORDER BY attempts ASC",
                (user_id,),
            )
            user_attempt_wincounts = cursor.fetchall()
            cursor.close()
            print(wins, games_played, user_attempt_wincounts)

            return wins, games_played, user_attempt_wincounts
        except:
            cursor.close()
