import { z } from 'zod';

const server = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']),
    BASE_URL:
        process.env.NODE_ENV === 'production'
            ? z.string().url()
            : z.string().optional(),
    NEXTAUTH_SECRET:
        process.env.NODE_ENV === 'production'
            ? z.string().min(1)
            : z.string().min(1).optional(),
    NEXTAUTH_URL:
        process.env.NODE_ENV === 'production'
            ? z.string().url()
            : z.string().url().optional(),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
});

const client = z.object({
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
});

const processEnv = {
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL: process.env.BASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

if (!!process.env.SKIP_ENV_VALIDATION == false) {
    const isServer = typeof window === 'undefined';

    const parsed = /** @type {MergedSafeParseReturn} */ (
        isServer
            ? merged.safeParse(processEnv) // on server we can validate all env vars
            : client.safeParse(processEnv) // on client we can only validate the ones that are exposed
    );

    if (parsed.success === false) {
        console.error(
            '❌ Invalid environment variables:',
            parsed.error.flatten().fieldErrors
        );
        throw new Error('Invalid environment variables');
    }

    env = new Proxy(parsed.data, {
        get(target, prop) {
            if (typeof prop !== 'string') return undefined;
            // Throw a descriptive error if a server-side env var is accessed on the client
            // Otherwise it would just be returning `undefined` and be annoying to debug
            if (!isServer && !prop.startsWith('NEXT_PUBLIC_'))
                throw new Error(
                    process.env.NODE_ENV === 'production'
                        ? '❌ Attempted to access a server-side environment variable on the client'
                        : `❌ Attempted to access server-side environment variable '${prop}' on the client`
                );
            return target[/** @type {keyof typeof target} */ (prop)];
        },
    });
}

export { env };
