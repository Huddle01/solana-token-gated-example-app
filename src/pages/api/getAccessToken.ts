// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { AccessToken, Role } from '@huddle01/server-sdk/auth';
import { API } from '@huddle01/server-sdk/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { roomId, address, displayName, expirationTime } = req.body as {
        roomId: string;
        address: string;
        expirationTime: number;
        displayName: string;
    };

    if (!roomId || !address) {
        return res.status(400).json({ error: 'Invalid Request' });
    }

    if (expirationTime < Date.now()) {
        return res.status(400).json({ error: 'Signature expired' });
    }

    const api = new API({
        apiKey: process.env.API_KEY!,
    });

    const { data: roomDetails } = await api.getRoomDetails({
        roomId: roomId,
    });

    if (!roomDetails?.tokenGatingInfo) {
        return res.status(400).json({ error: 'Room is not token gated' });
    }

    const collectionAddress = roomDetails?.tokenGatingInfo?.tokenGatingConditions[0]?.contractAddress;

    const apiResponse = await fetch(
        `https://api.shyft.to/sol/v1/nft/search?wallet=${address}&network=mainnet-beta&size=1&collection=${collectionAddress}`,
        {
            method: 'GET',
            headers: {
                'x-api-key': process.env.SHYFT_API_KEY!,
            },
        }
    );

    const nftData = (await apiResponse.json()) as {
        result: {
            nfts: any[];
        };
    };

    if (nftData.result.nfts.length === 0) {
        return res.status(400).json({ error: 'User does not own the required NFT' });
    }

    const accessToken = new AccessToken({
        apiKey: process.env.API_KEY!,
        roomId: roomId as string,
        role: Role.HOST,
        permissions: {
            admin: true,
            canConsume: true,
            canProduce: true,
            canProduceSources: {
                cam: true,
                mic: true,
                screen: true,
            },
            canRecvData: true,
            canSendData: true,
            canUpdateMetadata: true,
        },
        options: {
            metadata: {
                displayName: displayName,
                walletAddress: address,
            },
        },
    });

    const token = await accessToken.toJwt();

    return res.status(200).json({ token });
}
