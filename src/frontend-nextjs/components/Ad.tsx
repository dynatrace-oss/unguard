'use client';
import { Card, Spinner } from '@heroui/react';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorCard } from '@/components/ErrorCard';
import { useAd } from '@/hooks/queries/useAd';
import { useAdVisibility } from '@/hooks/queries/useAdVisibility';

function AdComponent() {
    const [hasError, setHasError] = useState(false);
    const { data, isLoading } = useAd();

    if (isLoading)
        return (
            <div className='sticky-top'>
                <Card className='min-h-[700px] w-full z-0 justify-center'>
                    <Spinner />
                </Card>
            </div>
        );

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

export function Ad() {
    const { isLoading, isPro } = useAdVisibility();

    if (isLoading || isPro) return null;

    return (
        <ErrorBoundary fallbackRender={(props) => <ErrorCard message={props.error.message} />}>
            <AdComponent />
        </ErrorBoundary>
    );
}
