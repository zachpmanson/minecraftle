from app import app
import sqlite3 

def create_table():
    connection = sqlite3.connect(
        "minecraftle.db",
        detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    )
    cursor = connection.cursor()    

    sql_command = (
        """CREATE TABLE IF NOT EXISTS games_played (
            id INTEGER PRIMARY KEY,
            user_id TEXT NOT NULL,
            date DATE NOT NULL,
            win INTEGER NOT NULL,
            attempts INTEGER
        )"""
    )

    print(sql_command)
    cursor.execute(sql_command)
    connection.commit()


def insert_record(user_id, date, win, attempts):
    if win == 0:
        attempts = None
    
    connection = sqlite3.connect(
        "minecraftle.db",
        detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    )
    cursor = connection.cursor()
    sql_command = (
        f"""INSERT INTO games_played(user_id, date, win, attempts) VALUES (
            ?,
            ?,
            {win},
            {attempts}
        )
        """
    )
    cursor.execute(sql_command, (user_id, date))
    connection.commit()
    return cursor.lastrowid

def get_records(user_id, date):
    connection = sqlite3.connect(
        "minecraftle.db",
        detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    )
    cursor = connection.cursor()

    cursor.execute(f"SELECT user_id, COUNT(win) FROM games_played WHERE win=1 GROUP BY user_id ORDER BY COUNT(win) DESC")
    wins = cursor.fetchall()    
    cursor.execute(f"SELECT user_id, COUNT(win) FROM games_played GROUP BY user_id ORDER BY COUNT(win) DESC")
    games_played = cursor.fetchall()
    cursor.execute(f"SELECT attempts, COUNT(win) FROM games_played WHERE user_id==? GROUP BY attempts ORDER BY COUNT(win) DESC", (user_id,))
    user_attempts = cursor.fetchall()
    from pprint import pprint
    pprint(wins)
    pprint(games_played)
    return wins, games_played, user_attempts