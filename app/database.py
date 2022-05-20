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
            ?,
            ?
        )
        """
    )
    cursor.execute(sql_command, (user_id, date, win, attempts))
    connection.commit()
    return cursor.lastrowid

def get_records(user_id, date):
    connection = sqlite3.connect(
        "minecraftle.db",
        detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    )
    cursor = connection.cursor()

    # gets list of all users' number wins, in desc order
    cursor.execute(f"SELECT user_id, COUNT(win) FROM games_played WHERE win==1 GROUP BY user_id ORDER BY COUNT(win) DESC")
    wins = cursor.fetchall()  

    # get number of games played by this user      
    cursor.execute(f"SELECT COUNT(*) FROM games_played WHERE user_id==?", (user_id,))
    games_played = cursor.fetchall()


    # gets count of games with x turns that given user has won
    cursor.execute(f"SELECT attempts, COUNT(win) FROM games_played WHERE user_id==? AND win==1 GROUP BY attempts ORDER BY attempts ASC", (user_id,))
    user_attempt_wincounts = cursor.fetchall()  

    return wins, games_played, user_attempt_wincounts