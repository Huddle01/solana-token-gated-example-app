import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { FC } from 'react';
import React from 'react';
import { ContextProvider } from '../components/ContextProvider';
import { Toaster } from 'react-hot-toast';
import { HuddleClient, HuddleProvider } from '@huddle01/react';

// Use require instead of import since order matters
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const huddleClient = new HuddleClient({
    projectId: process.env.NEXT_PUBLIC_HUDDLE_PROJECT_ID!,
    options: {
        activeSpeakers: {
            size: 8,
        },
    },
});

const App: FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <>
            <Head>
                <title>Solan Token Gated Example</title>
            </Head>
            <ContextProvider>
                <HuddleProvider client={huddleClient}>
                    <Toaster position="bottom-right" />
                    <Component {...pageProps} />
                </HuddleProvider>
            </ContextProvider>
        </>
    );
};

export default App;
