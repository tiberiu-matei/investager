import { signIn, signOut, useSession } from 'next-auth/react';
import path from 'path';
import { api } from '../utils/api';

path.resolve('./next.config.js');

export default function Index() {
    const hello = api.example.hello.useQuery({ text: 'luj e luj' });
    const session = useSession();
    const secretEndpoint = api.example.getSecretMessage.useQuery(undefined, {
        enabled: !!session.data?.user,
    });

    return (
        <div className="flex flex-col justify-center items-center">
            <div>{hello.data ? hello.data.greeting : 'yo'}</div>
            <div>
                {session.data
                    ? `Logged in as ${session.data.user.name}`
                    : 'Not logged in'}
            </div>
            <div>
                {secretEndpoint.data
                    ? secretEndpoint.data
                    : 'Unable to get secret'}
            </div>
            <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={
                    session.data ? () => void signOut() : () => void signIn()
                }
            >
                {session.data ? 'Sign out' : 'Sign in'}
            </button>
        </div>
    );
}
