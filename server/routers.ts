import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
  hello: t.procedure
    .input(z.string().nullish())
    .query(({ input }) => {
      return `Hola ${input ?? 'mundo'} desde tRPC!`;
    }),
});

export type AppRouter = typeof appRouter;
