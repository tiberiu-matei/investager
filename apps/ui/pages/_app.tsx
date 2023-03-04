import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import Head from 'next/head';
import { api } from '../utils/api';
import './styles.css';

const CustomApp: AppType<{ session: Session }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <>
            <Head>
                <title>investager</title>
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </Head>
            <main>
                <SessionProvider session={session}>
                    <Component {...pageProps} />
                </SessionProvider>
            </main>
        </>
    );
};

export default api.withTRPC(CustomApp);
