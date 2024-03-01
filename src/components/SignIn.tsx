import type { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features';
import { verifySignIn } from '@solana/wallet-standard-util';
import axios from 'axios';

export const handleSignIn = async (roomId: string, displayName: string, signIn: any, publicKey: any, notify: any) => {
    console.log('roomId', roomId);

    try {
        const time = {
            issuedAt: Date.now(),
            expiresAt: Date.now() + 1000 * 60 * 5,
        };

        const input: SolanaSignInInput = {
            domain: window.location.host,
            address: publicKey ? publicKey.toBase58() : undefined,
            statement: 'Please Sign In to verify wallet',
        };

        const output = (await signIn(input)) as SolanaSignInOutput;

        const isVerified = verifySignIn(input, output);

        if (!isVerified) {
            notify('error', 'Sign In verification failed!');
            return;
        }

        const token = await axios.request({
            method: 'POST',
            url: '/api/getAccessToken',
            data: {
                displayName,
                roomId,
                address: publicKey.toBase58(),
                expirationTime: time.expiresAt,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('token', token?.data?.token);

        return token?.data?.token;
    } catch (error: any) {
        notify('error', `Sign In failed: ${error?.message}`);
    }
};
