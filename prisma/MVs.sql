
CREATE MATERIALIZED VIEW scoreboard AS 
WITH scores AS (
    SELECT
        gc.user_id,
        SUM(game_count) AS total_games,
        SUM(CASE WHEN attempts = 11 THEN game_count ELSE 0 END) as total_losses,

        SUM(CASE WHEN attempts = 1 THEN game_count ELSE 0 END) as total_1,
        SUM(CASE WHEN attempts = 2 THEN game_count ELSE 0 END) as total_2,
        SUM(CASE WHEN attempts = 3 THEN game_count ELSE 0 END) as total_3,
        SUM(CASE WHEN attempts = 4 THEN game_count ELSE 0 END) as total_4,
        SUM(CASE WHEN attempts = 5 THEN game_count ELSE 0 END) as total_5,
        SUM(CASE WHEN attempts = 6 THEN game_count ELSE 0 END) as total_6,
        SUM(CASE WHEN attempts = 7 THEN game_count ELSE 0 END) as total_7,
        SUM(CASE WHEN attempts = 8 THEN game_count ELSE 0 END) as total_8,
        SUM(CASE WHEN attempts = 9 THEN game_count ELSE 0 END) as total_9,
        SUM(CASE WHEN attempts = 10 THEN game_count ELSE 0 END) as total_10,

        SUM(CASE WHEN attempts != 11 THEN game_count*attempts ELSE 0 END) as total_win_attempts
    FROM public.game_count gc
    GROUP BY gc.user_idz
)

SELECT
    DENSE_RANK() OVER (
        ORDER BY (total_games - total_losses) DESC, total_win_attempts ASC
    ) dense_rank_number,
    *
FROM scores;