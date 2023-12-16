import prisma from "@/lib/prisma";
import { GenericApiError } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const schema = z.object({
  user_id: z.string().refine((s) => !Number.isNaN(parseFloat(s))),
  win: z.number().min(0).max(1),
  attempts: z.number().min(1).max(10).optional(),
  //   date: z.date().max(new Date()), // must be in the past?
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
type Schema = z.infer<typeof schema>;

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
      const { user_id, win, attempts, date } = req.body as Schema;
      const flatDate = new Date(date);
      flatDate.setHours(0, 0, 0, 0);
      // TODO check date within last 3 days
      try {
        await prisma.game.upsert({
          where: {
            user_id: user_id.toString(),
            date: flatDate,
          },
          update: {},
          create: {
            user_id: user_id.toString(),
            win: win,
            attempts: attempts,
            date: flatDate,
          },
        });
      } catch (error: any) {
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
