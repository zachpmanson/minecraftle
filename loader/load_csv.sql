\copy public.user (user_id,last_game_date) FROM '/home/pg/user.csv' DELIMITER ',';

\copy public.game_count (user_id,attempts,game_count) FROM '/home/pg/game_count.csv' DELIMITER ',';