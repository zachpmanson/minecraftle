import { ScoreboardRow } from "@/types";
import prisma from "@/utils/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter, publicProcedure } from "../trpc";

export const gameRouter = createRouter({
  scoreboard: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = input.userId;
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "error",
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
      return { localLeaderboard: localLeaderboard };
    }),
  submitGame: publicProcedure
    .input(
      z.object({
        user_id: z.string().refine((s) => !Number.isNaN(parseFloat(s))),
        attempts: z.number().min(1).max(11),
        date: z
          .string()
          .datetime()
          .refine(
            (date) => {
              const threeDaysAgo = new Date();
              threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
              return new Date(date) >= threeDaysAgo;
            },
            {
              message: "Date must be within the last 3 days",
            }
          ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user_id, attempts, date } = input;
      const flatDate = new Date(date.slice(0, 10) + "T00:00:00.000Z");

      try {
        const user = await prisma.user.findUnique({
          where: {
            user_id: user_id,
          },
          select: {
            last_game_date: true,
          },
        });
        console.log(
          user?.last_game_date,
          flatDate,
          user?.last_game_date?.getTime() === flatDate.getTime()
        );
        if (user?.last_game_date?.getTime() === flatDate.getTime()) {
          return new TRPCError({
            code: "CONFLICT",
            message: "Already submitted a game today!",
          });
        } else {
          await prisma.$transaction([
            prisma.user.upsert({
              where: {
                user_id: user_id.toString(),
              },
              update: {
                last_game_date: flatDate,
              },
              create: {
                user_id: user_id.toString(),
                last_game_date: flatDate,
              },
            }),

            prisma.game_count.upsert({
              where: {
                user_id_attempts: {
                  user_id: user_id.toString(),
                  attempts: attempts,
                },
              },
              update: {
                game_count: {
                  increment: 1,
                },
              },
              create: {
                user_id: user_id.toString(),
                attempts: attempts,
                game_count: 1,
              },
            }),
          ]);
        }
      } catch (error: any) {
        console.error(error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Game record insertion failed" + error.toString(),
        });
      }
      return { success: true };
    }),
});

export type GameRouter = typeof gameRouter;
