import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import { useAutoConnect } from '../components/AutoConnectProvider';

const ReactUIWalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const SignMessageDynamic = dynamic(async () => (await import('../components/SignMessage')).SignMessage, { ssr: false });

const Index: NextPage = () => {
    const { autoConnect, setAutoConnect } = useAutoConnect();

    return (
        <>
            <ReactUIWalletMultiButtonDynamic />
            <SignMessageDynamic />
        </>
    );
};

export default Index;
