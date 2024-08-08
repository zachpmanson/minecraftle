import Row from "@/components/StatRow.component";
import prisma from "@/lib/prisma";
import { ScoreboardRow } from "@/types";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

export default function Stats({
  count_1,
  count_7,
  count_30,
  count_90,
  count_365,
}: {
  count_1: number;
  count_7: number;
  count_30: number;
  count_90: number;
  count_365: number;
}) {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center py-2 max-w-xl">
      <h2 className="text-2xl text-white p-2">Statistics</h2>
      <div className="w-full bg-transparent-black p-2 text-white">
        <table className="w-full">
          <tbody className="w-full">
            <tr className="h-4"></tr>
            <Row left="Player in last day" right={count_1.toString()} />
            <Row left="Player in last week" right={count_7.toString()} />
            <Row left="Player in last 30 days" right={count_30.toString()} />
            <Row left="Player in last 90 days" right={count_90.toString()} />
            <Row left="Player in last 365 days" right={count_365.toString()} />
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

  let count_1: number;
  let count_7: number;
  let count_30: number;
  let count_90: number;
  let count_365: number;

  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  try {
    [count_1, count_7, count_30, count_90, count_365] =
      await prisma.$transaction([
        prisma.user.count({
          where: {
            last_game_date: {
              gte: new Date(Date.now() - 1 * MS_PER_DAY),
            },
          },
        }),
        prisma.user.count({
          where: {
            last_game_date: {
              gte: new Date(Date.now() - 7 * MS_PER_DAY),
            },
          },
        }),
        prisma.user.count({
          where: {
            last_game_date: {
              gte: new Date(Date.now() - 30 * MS_PER_DAY),
            },
          },
        }),
        prisma.user.count({
          where: {
            last_game_date: {
              gte: new Date(Date.now() - 90 * MS_PER_DAY),
            },
          },
        }),
        prisma.user.count({
          where: {
            last_game_date: {
              gte: new Date(Date.now() - 365 * MS_PER_DAY),
            },
          },
        }),
      ]);
  } catch (e) {
    console.error(e);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      count_1,
      count_7,
      count_30,
      count_90,
      count_365,
    },
  };
};
