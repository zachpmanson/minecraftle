import Row from "@/components/StatRow.component";
import prisma from "@/lib/prisma";
import { ScoreboardRow } from "@/types";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Stats({
  liveUserScores, // actual user scores
  // localLeaderboard, // materialized view scoreboard position and neighbours
  totalPlayerCount,
}: {
  liveUserScores: ScoreboardRow;
  // localLeaderboard: ScoreboardRow[];
  totalPlayerCount: number;
}) {
  const router = useRouter();
  const [localLeaderboard, setLocalLeaderboard] = useState<ScoreboardRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log(localLeaderboard);
  useEffect(() => {
    const fetchLocalLeaderboard = async () => {
      const res = await fetch(`/api/scoreboard/${router.query.userId}`);
      const data = await res.json();
      console.log(data);
      setLocalLeaderboard(data.localLeaderboard);
      setIsLoading(false);
    };

    fetchLocalLeaderboard();
  }, []);

  const allAttempts = Object.keys(liveUserScores)
    .filter((key) => key.match(/^total_\d+$/))
    .map((key) => ({
      attempts: parseInt(key.replace("total_", "")),
      count: liveUserScores[key as keyof ScoreboardRow] as number,
    }));

  const row = (left: string, right?: string) => (
    <tr className="odd:text-white even:text-gray-400">
      <td colSpan={right ? 1 : 2}>{left}</td>
      {right && <td className="text-right">{right}</td>}
    </tr>
  );

  const ranking = () => {
    if (isLoading) {
      return row("Global Rank", "Loading...");
    }
    if (localLeaderboard.length === 0) {
      if (liveUserScores.total_games > 0) {
        return row(
          "Global Rank",
          `Will be calculated soon! (out of ${totalPlayerCount})`
        );
      } else {
        return row("Global Rank", "Play a game to get ranked!");
      }
    }

    const userRow = localLeaderboard?.find((r) => r.user_id)!;
    const upRow = localLeaderboard?.find(
      (r) => r.dense_rank_number === userRow.dense_rank_number - 1
    );
    const downRow = localLeaderboard?.find(
      (r) => r.dense_rank_number === userRow.dense_rank_number + 1
    );
    console.log(upRow, "upRow");

    let catchupMessage;
    if (upRow) {
      if (
        upRow?.total_games -
          upRow?.total_losses -
          (userRow?.total_games - userRow?.total_losses) ===
        0
      ) {
        catchupMessage = (
          <>
            {row("Player above you has the same score!")}

            {row(
              "You're behind by",
              `${
                userRow.total_win_attempts - upRow.total_win_attempts
              } attempts`
            )}
          </>
        );
      } else {
        catchupMessage = row(
          "Wins behind",
          (
            upRow?.total_games -
            upRow?.total_losses -
            (userRow?.total_games - userRow?.total_losses)
          ).toString()
        );
      }
    }

    let leadMessage;
    if (downRow) {
      if (
        userRow?.total_games -
          userRow?.total_losses -
          (downRow?.total_games - downRow?.total_losses) ===
        0
      ) {
        leadMessage = (
          <>
            {row("Player below you has the same score!")}
            {row(
              "You're ahead by",
              `${
                downRow.total_win_attempts - userRow.total_win_attempts
              } attempts`
            )}
          </>
        );
      } else {
        leadMessage = row(
          "Wins ahead",
          (
            userRow?.total_games -
            userRow?.total_losses -
            (downRow?.total_games - downRow?.total_losses)
          ).toString()
        );
      }
    }

    return (
      <>
        {row(
          "Global Rank",
          userRow?.dense_rank_number
            ? `${userRow?.dense_rank_number}/${totalPlayerCount}`
            : "N/A"
        )}

        {upRow && catchupMessage}
        {downRow && leadMessage}
      </>
    );
  };

  return (
    <main className="flex flex-col items-center justify-center py-2 max-w-xl">
      <h2 className="text-2xl text-white p-2">Statistics</h2>
      <div className="w-full bg-transparent-black p-2 text-white">
        <table className="w-full">
          <tbody className="w-full">
            {ranking()}
            <tr className="h-4"></tr>
            <Row
              left="Games played"
              right={liveUserScores.total_games.toString()}
            />
            <Row
              left="Games won"
              right={liveUserScores.total_games.toString()}
            />
            <Row
              left="Games lost"
              right={liveUserScores.total_losses.toString()}
            />
            <Row
              left="Win% ratio"
              right={
                (
                  Math.round(
                    ((liveUserScores.total_games -
                      liveUserScores.total_losses) /
                      liveUserScores.total_games) *
                      100 *
                      100
                  ) / 100
                ).toString() + "%"
              }
            />
            <tr className="h-4"></tr>
            <Row
              left={`Total attempts`}
              right={liveUserScores.total_win_attempts.toString()}
            />
            {Object.values(allAttempts).map((a, i) => (
              <Row
                key={i}
                left={`Wins with ${a.attempts} attempts`}
                right={a.count.toString()}
              />
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

const DEFAULT_SCOREBOARD_ROW: ScoreboardRow = {
  user_id: "",
  dense_rank_number: 0,
  total_games: 0,
  total_win_attempts: 0,
  total_losses: 0,
  total_1: 0,
  total_2: 0,
  total_3: 0,
  total_4: 0,
  total_5: 0,
  total_6: 0,
  total_7: 0,
  total_8: 0,
  total_9: 0,
  total_10: 0,
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { userId } = context.params as { userId: string };

  let liveUserScores: ScoreboardRow[] = [];
  let results: ScoreboardRow[] = [];
  let totalPlayerCount: number;

  try {
    [liveUserScores, /* results,*/ totalPlayerCount] =
      await prisma.$transaction([
        prisma.$queryRaw<ScoreboardRow[]>`
        SELECT
          -1,
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

          SUM(CASE WHEN attempts != 11 THEN game_count*attempts ELSE 0 END) as total_win_attempts
        FROM public.game_count
        WHERE user_id = ${userId} GROUP BY user_id;
      `,
        // prisma.$queryRaw<ScoreboardRow[]>`
        //   WITH user_rank AS (
        //     SELECT dense_rank_number FROM scoreboard WHERE user_id = ${userId}
        //   )

        //   SELECT *
        //   FROM scoreboard
        //   WHERE user_id = ${userId}
        //     OR user_id IN (
        //         SELECT user_id
        //         FROM scoreboard
        //         WHERE dense_rank_number = (SELECT dense_rank_number FROM user_rank) - 1
        //         LIMIT 1
        //       )
        //     OR user_id IN (
        //         SELECT user_id
        //         FROM scoreboard
        //         WHERE dense_rank_number = (SELECT dense_rank_number FROM user_rank) + 1
        //         LIMIT 1
        //       );
        // `,
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

  // hack to make bigint work with JSON.stringify
  liveUserScores = JSON.parse(
    JSON.stringify(liveUserScores, (_key, value) =>
      typeof value === "bigint" ? Number(value) : value
    )
  );
  results = JSON.parse(
    JSON.stringify(results, (_key, value) =>
      typeof value === "bigint" ? Number(value) : value
    )
  );

  return {
    props: {
      liveUserScores: liveUserScores.at(0) ?? DEFAULT_SCOREBOARD_ROW,
      localLeaderboard: results.map((r) => ({
        ...r,
        user_id: r.user_id === userId ? userId : null,
      })),
      totalPlayerCount: totalPlayerCount,
    },
  };
};
