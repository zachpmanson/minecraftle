import Row from "@/components/StatRow.component";
import { ScoreboardRow } from "@/types";
import prisma from "@/utils/prisma";
import { trpc } from "@/utils/trpc";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

export default function Stats({
  liveUserScores, // actual user scores
  totalPlayerCount,
}: {
  liveUserScores: ScoreboardRow;
  totalPlayerCount: number;
}) {
  const router = useRouter();
  const userId = router.query.userId as string;

  const { data, isLoading } = trpc.game.scoreboard.useQuery(
    {
      userId: userId ?? "",
    },
    {
      enabled: !!userId,
    }
  );
  const localLeaderboard = data?.localLeaderboard;

  const allAttempts = Object.keys(liveUserScores)
    .filter((key) => key.match(/^total_\d+$/))
    .map((key) => ({
      attempts: parseInt(key.replace("total_", "")),
      count: liveUserScores[key as keyof ScoreboardRow] as number,
    }));

  const ranking = () => {
    if (!localLeaderboard || isLoading) {
      return <Row left="Global Rank" right="Loading..." />;
    }
    if (localLeaderboard.length === 0) {
      if (liveUserScores.total_games > 0) {
        return <Row left="Global Rank" right={`Will be calculated soon! (out of ${totalPlayerCount})`} />;
      } else {
        return <Row left="Global Rank" right="Play a game to get ranked!" />;
      }
    }

    const userRow = localLeaderboard?.find((r) => r.user_id)!;
    const upRow = localLeaderboard?.find((r) => r.dense_rank_number === userRow.dense_rank_number - 1);
    const downRow = localLeaderboard?.find((r) => r.dense_rank_number === userRow.dense_rank_number + 1);
    console.log(upRow, "upRow");

    let catchupMessage;
    if (upRow) {
      if (upRow?.total_games - upRow?.total_losses - (userRow?.total_games - userRow?.total_losses) === 0) {
        catchupMessage = (
          <>
            <Row left="Player above you has the same score!" />
            <Row left="You're behind by" right={`${userRow.total_win_attempts - upRow.total_win_attempts} attempts`} />
          </>
        );
      } else {
        catchupMessage = (
          <Row
            left="Wins behind"
            right={(
              upRow?.total_games -
              upRow?.total_losses -
              (userRow?.total_games - userRow?.total_losses)
            ).toLocaleString()}
          />
        );
      }
    }

    let leadMessage;
    if (downRow) {
      if (userRow?.total_games - userRow?.total_losses - (downRow?.total_games - downRow?.total_losses) === 0) {
        leadMessage = (
          <>
            <Row left="Player below you has the same score!" />
            <Row left="You're ahead by" right={`${downRow.total_win_attempts - userRow.total_win_attempts} attempts`} />
          </>
        );
      } else {
        leadMessage = (
          <Row
            left="Wins ahead"
            right={(
              userRow?.total_games -
              userRow?.total_losses -
              (downRow?.total_games - downRow?.total_losses)
            ).toLocaleString()}
          />
        );
      }
    }

    return (
      <>
        <Row
          left="Global Rank"
          right={userRow?.dense_rank_number ? `${userRow?.dense_rank_number}/${totalPlayerCount}` : "N/A"}
        />

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
            <Row left="Games played" right={liveUserScores.total_games.toLocaleString()} />
            <Row left="Games won" right={(liveUserScores.total_games - liveUserScores.total_losses).toLocaleString()} />
            <Row left="Games lost" right={liveUserScores.total_losses.toLocaleString()} />
            <Row
              left="Win% ratio"
              right={
                (
                  Math.round(
                    ((liveUserScores.total_games - liveUserScores.total_losses) / liveUserScores.total_games) *
                      100 *
                      100
                  ) / 100
                ).toLocaleString() + "%"
              }
            />
            <tr className="h-4"></tr>
            <Row left={`Total attempts`} right={liveUserScores.total_win_attempts.toLocaleString()} />
            {Object.values(allAttempts).map((a, i) => (
              <Row key={i} left={`Wins with ${a.attempts} attempts`} right={a.count.toLocaleString()} />
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
    [liveUserScores, /* results,*/ totalPlayerCount] = await prisma.$transaction([
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
    JSON.stringify(liveUserScores, (_key, value) => (typeof value === "bigint" ? Number(value) : value))
  );
  results = JSON.parse(JSON.stringify(results, (_key, value) => (typeof value === "bigint" ? Number(value) : value)));

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
