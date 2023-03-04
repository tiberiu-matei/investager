import { exampleRouter } from './exampleRouter';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
    example: exampleRouter,
});

export type AppRouter = typeof appRouter;
