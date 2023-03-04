import { prisma } from '@investager/db';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { type GetServerSidePropsContext } from 'next';
import {
    getServerSession,
    type DefaultSession,
    type NextAuthOptions,
} from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { env } from './../utils/env.mjs';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
        } & DefaultSession['user'];
    }
}

if (process.env.NODE_ENV === 'production') {
    process.env.NEXTAUTH_URL = process.env.BASE_URL;
}

export const authOptions: NextAuthOptions = {
    callbacks: {
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
        signIn({ user }) {
            if (user.email !== 'matei.tiberiu02@gmail.com') {
                return false;
            }

            // return "/unauthorized"
            return true;
        },
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        DiscordProvider({
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
        }),
    ],
};

export const getServerAuthSession = (ctx: {
    req: GetServerSidePropsContext['req'];
    res: GetServerSidePropsContext['res'];
}) => {
    return getServerSession(ctx.req, ctx.res, authOptions);
};
