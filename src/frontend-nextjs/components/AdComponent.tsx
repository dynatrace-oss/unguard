'use client';
import { useQuery } from '@tanstack/react-query';
import { Card, Spinner } from '@heroui/react';
import { useState } from 'react';

import ErrorCard from '@/components/ErrorCard';

async function fetchAd() {
    const res = await fetch('ui/api/ad');

    if (!res.ok) {
        throw new Error('Failed to fetch ad');
    }

    return res.json();
}

export default function AdComponent() {
    const [hasError, setHasError] = useState(false);
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['ad'],
        queryFn: fetchAd,
    });

    if (isLoading)
        return (
            <div className='sticky-top'>
                <Card className='min-h-[700px] w-full z-0 justify-center'>
                    <Spinner />
                </Card>
            </div>
        );
    if (isError) {
        let errormessage = 'Error loading ad';

        if (error instanceof Error) {
            errormessage = errormessage + ': ' + error.message + '!';
        }

        return <ErrorCard message={errormessage} />;
    }

    return (
        <div className='sticky-top'>
            {hasError ? (
                <div>Failed to load ad</div>
            ) : (
                <iframe
                    className='z-0 w-full object-cover sticky-top'
                    height={700}
                    src={data.src}
                    title='ad'
                    onError={() => setHasError(true)}
                />
            )}
        </div>
    );
}
