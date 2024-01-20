import prisma from "@/lib/prisma";
import { GetServerSideProps } from "next";

type ScoreboardRow = {
  user_id?: string;
  dense_rank_number: number;
  total_games: number;
  total_win_attempts: number;
  total_losses: number;
  total_1: number;
  total_2: number;
  total_3: number;
  total_4: number;
  total_5: number;
  total_6: number;
  total_7: number;
  total_8: number;
  total_9: number;
  total_10: number;
};

export default function Stats({
  rows,
  totalPlayerCount,
}: {
  rows: ScoreboardRow[];
  totalPlayerCount: number;
}) {
  console.log(rows);

  const userRow = rows.find((r) => r.user_id)!;
  const upRow = rows.find(
    (r) => r.dense_rank_number === userRow.dense_rank_number - 1
  );
  const downRow = rows.find(
    (r) => r.dense_rank_number === userRow.dense_rank_number + 1
  );

  const allAttempts = Object.keys(userRow)
    .filter((key) => key.match(/^total_\d+$/))
    .map((key) => ({
      attempts: parseInt(key.replace("total_", "")),
      count: userRow[key as keyof ScoreboardRow] as number,
    }));

  const row = (left: string, right: string) => (
    <tr className="odd:text-white even:text-gray-400">
      <td>{left}</td>
      <td className="text-right">{right}</td>
    </tr>
  );

  return (
    <main className="flex flex-col items-center justify-center py-2 max-w-xl">
      <h2 className="text-2xl text-white p-2">Statistics</h2>
      <div className="w-full bg-transparent-black p-2 text-white">
        {/* <pre>{JSON.stringify(rows, null, 2)}</pre> */}
        <table className="w-full">
          <tbody className="w-full">
            {row(
              "Global Rank",
              userRow?.dense_rank_number
                ? `${userRow?.dense_rank_number}/${totalPlayerCount}`
                : "N/A"
            )}
            {upRow &&
              row(
                "Wins behind ",
                (upRow?.total_games - upRow?.total_losses).toString()
              )}
            {downRow &&
              row(
                "Wins ahead",
                (downRow?.total_games - downRow?.total_losses).toString()
              )}

            <tr className="h-4"></tr>

            {row("Games played", userRow.total_games.toString())}
            {row(
              "Games won",
              (userRow.total_games - userRow.total_losses).toString()
            )}
            {row("Games lost", userRow.total_losses.toString())}
            {row(
              "Win% ratio",
              (
                ((userRow.total_games - userRow.total_losses) /
                  userRow.total_games) *
                100
              ).toString() + "%"
            )}

            <tr className="h-4"></tr>

            {Object.values(allAttempts).map((a) =>
              row(`Wins with ${a.attempts} attempts`, a.count.toString())
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { userId } = context.params as { userId: string };

  let results: ScoreboardRow[] = [];
  let totalPlayerCount: number;

  try {
    [results, totalPlayerCount] = await prisma.$transaction([
      prisma.$queryRaw<ScoreboardRow[]>`
      WITH scores AS (	
        SELECT
          user_id,
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

          SUM(CASE WHEN attempts != 11 THEN attempts ELSE 0 END) as total_win_attempts
        FROM public.game_count
        GROUP BY user_id
      ),
      scoreboard AS (
        SELECT
          DENSE_RANK() OVER (
            ORDER BY (total_games - total_losses) DESC
          ) dense_rank_number,
          *
        FROM scores
      ),
      user_rank AS (
        SELECT dense_rank_number FROM scoreboard WHERE user_id = ${userId}
      )
      
      SELECT *
      FROM scoreboard
      WHERE user_id = ${userId}
        OR user_id IN (
            SELECT user_id
            FROM scoreboard
            WHERE dense_rank_number = (SELECT dense_rank_number FROM user_rank) - 1
            LIMIT 1
          )
        OR user_id IN (
            SELECT user_id
            FROM scoreboard
            WHERE dense_rank_number = (SELECT dense_rank_number FROM user_rank) + 1
            LIMIT 1
          );    `,
      prisma.user.count(),
    ]);
    console.log(userId, "results", results);
  } catch (e) {
    console.error(e);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  results = JSON.parse(
    JSON.stringify(results, (_key, value) =>
      typeof value === "bigint" ? Number(value) : value
    )
  );

  return {
    props: {
      rows: results.map((r) => ({
        ...r,
        user_id: r.user_id === userId ? userId : null,
      })),
      totalPlayerCount: totalPlayerCount,
    },
  };
};
