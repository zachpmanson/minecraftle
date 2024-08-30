import Row from "@/components/StatRow.component";
import prisma from "@/utils/prisma";
import { GetServerSideProps } from "next";

export default function Stats({
  count_1,
  count_7,
  count_30,
  count_90,
  count_365,
  count_all_time,
}: {
  count_1: number;
  count_7: number;
  count_30: number;
  count_90: number;
  count_365: number;
  count_all_time: number;
}) {
  return (
    <main className="flex flex-col items-center justify-center py-2 max-w-xl">
      <h2 className="text-2xl text-white p-2">Statistics</h2>
      <div className="w-full bg-transparent-black p-2 text-white">
        <table className="w-full">
          <tbody className="w-full">
            <tr className="h-4"></tr>
            <Row left="Players in last day" right={count_1.toLocaleString()} />
            <Row left="Players in last week" right={count_7.toLocaleString()} />
            <Row
              left="Players in last 30 days"
              right={count_30.toLocaleString()}
            />
            <Row
              left="Players in last 90 days"
              right={count_90.toLocaleString()}
            />
            <Row
              left="Players in last 365 days"
              right={count_365.toLocaleString()}
            />
            <Row
              left="Players all time"
              right={count_all_time.toLocaleString()}
            />
          </tbody>
        </table>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let count_1: number;
  let count_7: number;
  let count_30: number;
  let count_90: number;
  let count_365: number;
  let count_all_time: number;

  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  try {
    [count_1, count_7, count_30, count_90, count_365, count_all_time] =
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
        prisma.user.count(),
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
      count_all_time,
    },
  };
};
