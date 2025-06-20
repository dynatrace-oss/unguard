'use client';

import React from 'react';
import { Spacer, Spinner } from '@heroui/react';
import { useRouter } from 'next/navigation';

import { useCheckAdmanager } from '@/hooks/queries/useCheckAdmanager';
import { ROUTES } from '@/enums/routes';
import { AdUploader } from '@/components/AdManager/AdUploader';
import { AdList } from '@/components/AdManager/AdList';

export default function AdManager() {
    const { data: isAdManager, isLoading } = useCheckAdmanager();
    const router = useRouter();

    if (isLoading) {
        return (
            <div>
                <Spinner />
            </div>
        );
    }

    if (!isAdManager) {
        router.push(ROUTES.login);
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
