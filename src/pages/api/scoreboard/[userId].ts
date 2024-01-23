import prisma from "@/lib/prisma";
import { GenericApiError, ScoreboardRow } from "@/types";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ localLeaderboard: ScoreboardRow[] } | GenericApiError>
) {
  switch (req.method) {
    case "GET":
      if (!req.query.userId) {
        return res.status(400).json({
          error: "Missing user_id",
        });
      }
      const userId = req.query.userId;
      let localLeaderboard: ScoreboardRow[] = [];
      try {
        localLeaderboard = await prisma.$queryRaw<ScoreboardRow[]>`
            WITH user_rank AS (
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
                );
          `;
      } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          return res.status(500).json({
            error: "Internal server error",
            details: error,
          });
        }

        return res.status(500).json({
          error: "Internal server error",
        });
      }

      localLeaderboard = JSON.parse(
        JSON.stringify(localLeaderboard, (_key, value) =>
          typeof value === "bigint" ? Number(value) : value
        )
      );

      localLeaderboard = localLeaderboard.map((r) => ({
        ...r,
        user_id: r.user_id === userId ? userId : null,
      }));
      console.log({ localLeaderboard: localLeaderboard });
      res.status(200).json({ localLeaderboard: localLeaderboard });

      break;
    default:
      return res.status(405).json({ error: "Invalid method" });
  }
}
