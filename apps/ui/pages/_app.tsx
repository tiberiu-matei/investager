import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

export default function CustomApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>investager</title>
                <link rel="icon" type="image/x-icon" href="/ui/favicon.ico" />
            </Head>
            <main>
                <Component {...pageProps} />
            </main>
        </>
    );
}
