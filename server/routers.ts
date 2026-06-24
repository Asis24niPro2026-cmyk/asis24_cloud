import { router, publicProcedure } from "@trpc/server";
import { z } from "zod";

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { ok: true, timestamp: new Date().toISOString() };
  }),
  
  echo: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ input }) => {
      return { echo: input.text };
    })
});

export type AppRouter = typeof appRouter;
