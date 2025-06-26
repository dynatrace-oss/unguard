'use client';

import React from 'react';
import { Spacer, Spinner } from '@heroui/react';

import { useCheckAdmanager } from '@/hooks/queries/useCheckAdmanager';
import { AdUploader } from '@/components/AdManager/AdUploader';
import { AdList } from '@/components/AdManager/AdList';
import { ErrorCard } from '@/components/ErrorCard';

export default function AdManager() {
    const { isAdManager, isLoading } = useCheckAdmanager();

    if (isLoading) {
        return (
            <div>
                <Spinner />
            </div>
        );
    }

    if (!isAdManager) {
        return <ErrorCard message='Access denied: You are missing permissions to access this page.' />;
    } else {
        return (
            <div>
                <h1 className='mb-6 text-4xl font-extrabold leading-none tracking-tight text-gray-800'>Ad Manager</h1>
                <div className='flex flex-row items-center justify-between mb-4 gap-16'>
                    <h2 className='p-1 font-semibold text-default-900 whitespace-nowrap'>Current Ad List:</h2>
                    <AdUploader />
                </div>
                <Spacer y={4} />
                <AdList />
            </div>
        );
    }
}
