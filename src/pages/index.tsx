import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useRouter } from 'next/router';

const Index: NextPage = () => {
    const [collectionAddress, setCollectionAddress] = useState<string>('');
    const router = useRouter();

    return (
        <div className="flex h-screen items-center justify-center bg-slate-800">
            <Card className="bg-[#1A1A1A] p-8 rounded-lg max-w-2xl mx-auto">
                <h1 className="text-white text-2xl font-bold mb-6">Create Token Gated Room</h1>
                <div className="flex flex-col gap-4">
                    <Input
                        placeholder="Enter Collection Address"
                        onChange={(e) => setCollectionAddress(e.target.value)}
                    />
                    <Button
                        className="bg-slate-600 hover:bg-slate-500"
                        onClick={async () => {
                            const apiResponse = await fetch(`api/createRoom?collectionAddress=${collectionAddress}`);
                            const { roomId } = await apiResponse.json();
                            router.push(`/${roomId}`);
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default Index;
