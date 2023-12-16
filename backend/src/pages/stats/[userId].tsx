import MCButton from "@/components/MCButton.component";
import prisma from "@/lib/prisma";

export default function Stats({
  gamesPlayed,
  wins,
  upDiff,
  downDiff,
  position,
  total_player_count,
  attempts,
}: {
  gamesPlayed: number;
  wins: number;
  upDiff: number;
  downDiff: number;
  position: number;
  total_player_count: number;
  attempts: { attempts: number; count: number }[];
}) {
  console.log(
    gamesPlayed,
    wins,
    upDiff,
    downDiff,
    position,
    total_player_count,
    attempts
  );
  let allAttempts: { [key: number]: { attempts: number; count: number } } = {};
  for (let attempt of attempts) {
    allAttempts[attempt.attempts] = attempt;
  }
  for (let i = 1; i <= 10; i++) {
    if (!allAttempts[i]) {
      allAttempts[i] = { attempts: i, count: 0 };
    }
  }

  const row = (left: string, right: string) => (
    <tr className="odd:text-white even:text-gray-400">
      <td>{left}</td>
      <td className="text-right">{right}</td>
    </tr>
  );

  return (
    <main className="flex flex-col items-center justify-center py-2 max-w-xl">
      <h2 className="text-2xl text-white p-2">Statistics</h2>
      <div className="w-full bg-transparent-black p-2">
        <table className="w-full">
          <tbody className="w-full">
            {row(
              "Global Rank",
              position ? `${position}/${total_player_count}` : "N/A"
            )}
            {row("Wins behind ", upDiff?.toString())}
            {row("Wins ahead", downDiff?.toString())}

            <tr className="h-4"></tr>

            {row("Games played", gamesPlayed.toString())}
            {row("Games won", wins.toString())}
            {row("Games lost", (gamesPlayed - wins).toString())}
            {row("Win% ratio", ((wins / gamesPlayed) * 100).toString())}

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

// use serverside rendering
export async function getServerSideProps(context: any) {
  const { userId } = context.params;

  let data: {
    upScore: number;
    downScore: number;
    position?: number;
    total_player_count?: number;
    gamesPlayed: number;
    wins: number;
    rank?: string;
    attempts?: { attempts: number; count: number }[];
  } = {
    upScore: Infinity,
    downScore: -1,
    gamesPlayed: 0,
    wins: 0,
  };

  try {
    // gets list of all users' number wins, in desc order
    const winRecords = await prisma.game.groupBy({
      by: ["user_id"],
      _count: {
        win: true,
      },

      where: {
        win: 1,
      },
      orderBy: [
        {
          _count: {
            win: "desc",
          },
        },
        {
          _avg: {
            attempts: "asc",
          },
        },
      ],
    });

    // get number of games played by this user
    const gamesPlayed = await prisma.game.count({
      where: {
        user_id: userId,
      },
    });
    data.gamesPlayed = gamesPlayed;

    // gets count of games with x turns that given user has won
    const user_attempt_wincounts = await prisma.game.groupBy({
      by: ["attempts"],
      _count: {
        win: true,
      },
      where: {
        user_id: userId,
        win: 1,
      },
      orderBy: {
        attempts: "asc",
      },
    });

    data.total_player_count = winRecords.length;
    let flatWinRecords = winRecords.map((record) => ({
      userId: record.user_id,
      count: record._count.win,
    }));

    for (let [i, record] of flatWinRecords.entries()) {
      console.log("flatWinRecords", record, i);
      // if this record is lower than previous, set up_score to previous, stop checking after we have found a rank
      if (
        data.rank === undefined &&
        i !== 0 &&
        record.count < flatWinRecords[i - 1].count
      ) {
        data.upScore = flatWinRecords[i - 1].count;
      }
      // get score of person below user_id, can exit loop after that
      if (data.rank !== undefined) {
        data.downScore = Math.max(data.downScore, record.count);
        break;
      }
      if (record.userId === userId) {
        data.wins = record.count;
        data.position = i + 1;
      }
    }

    data.attempts = user_attempt_wincounts.map((u) => ({
      attempts: u.attempts ?? -1,
      count: u._count.win,
    }));
  } catch (error) {
    console.error(error);
  }
  console.log(data);
  return {
    props: { ...data },
  };
}
