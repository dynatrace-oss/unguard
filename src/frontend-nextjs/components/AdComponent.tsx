'use client';
import { Card, Image } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';

async function fetchAd() {
    const res = await fetch('ui/api/ad');

    if (!res.ok) {
        throw new Error('Failed to fetch ad');
    }

    return res.json();
}

export default function AdComponent() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['ad'],
        queryFn: fetchAd,
    });

    if (isLoading) return <p className='text-center'>Loading ad...</p>;
    if (isError) {
        return <p>Error loading ad {error instanceof Error ? error.message : ''}</p>;
    }

    return (
        <div>
            <Card>
                <Image removeWrapper alt='Card background' className='z-0 w-full h-full object-cover' src={data.src} />
            </Card>
        </div>
    );
}
