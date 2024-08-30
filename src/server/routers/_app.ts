import { z } from "zod";
import { publicProcedure, createRouter } from "../trpc";
import { gameRouter } from "./game";

export const appRouter = createRouter({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  game: gameRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
