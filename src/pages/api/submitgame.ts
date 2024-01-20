import prisma from "@/lib/prisma";
import { GenericApiError } from "@/types";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const schema = z.object({
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
});
type SubmitGameSchema = z.infer<typeof schema>;

type Data = {
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | GenericApiError>
) {
  switch (req.method) {
    case "POST":
      const response = schema.safeParse(req.body);
      console.log(JSON.stringify(response));
      if (!response.success) {
        return res.status(400).json({
          error: response.error,
        });
      }
      const { user_id, attempts, date } = req.body as SubmitGameSchema;
      const flatDate = new Date(date);
      flatDate.setHours(0, 0, 0, 0);

      try {
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
      } catch (error: any) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          return res.status(500).json({
            error: "Game record insertion failed",
            details: error,
          });
        }

        return res.status(500).json({
          error: "Game record insertion failed",
        });
      }
      return res.status(200).json({ success: true });
      break;
    case "OPTIONS":
      console.log("OPTIONS");
      return res.status(200).json({ success: true });
      break;
    default:
      return res.status(405).json({ error: "Invalid method" });
  }
}
