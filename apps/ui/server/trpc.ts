import { prisma } from '@investager/db';
import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { type Session } from 'next-auth';
import superjson from 'superjson';
import { getServerAuthSession } from './auth';

type CreateContextOptions = {
    session: Session | null;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
    return {
        session: opts.session,
        prisma,
    };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
    const { req, res } = opts;

    // Get the session from the server using the getServerSession wrapper function
    const session = await getServerAuthSession({ req, res });

    return createInnerTRPCContext({
        session,
    });
};

const trpc = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape }) {
        return shape;
    },
});

export const createTRPCRouter = trpc.router;

export const publicProcedure = trpc.procedure;

const enforceUserIsAuthed = trpc.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: {
            // infers the `session` as non-nullable
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});

export const protectedProcedure = trpc.procedure.use(enforceUserIsAuthed);
