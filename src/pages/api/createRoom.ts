import type { NextApiRequest, NextApiResponse } from 'next';
import { API } from '@huddle01/server-sdk/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { collectionAddress } = req.query;

    if (!collectionAddress) {
        return res.status(400).json({ error: 'collectionAddress is required' });
    }

    const api = new API({
        apiKey: process.env.API_KEY!,
    });

    const createNewRoom = await api.createRoom({
        title: 'Token Gated Room',
        tokenType: 'SPL',
        chain: 'SOLANA',
        contractAddress: [collectionAddress as string],
    });

    if (createNewRoom.error) {
        return res.status(500).json({
            error: createNewRoom.error,
        });
    }

    return res.status(200).json({
        roomId: createNewRoom.data.data.roomId,
    });
}
