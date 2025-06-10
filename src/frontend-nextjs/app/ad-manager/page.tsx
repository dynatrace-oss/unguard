'use client';

import React from 'react';
import { Spinner } from '@heroui/react';
import { useRouter } from 'next/navigation';

import { useCheckAdmanager } from '@/hooks/useCheckAdmanager';
import { ROUTES } from '@/enums/routes';
import { AdUploader } from '@/components/AdUploader';
import { AdList } from '@/components/AdList';

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
                <AdUploader />
                <AdList />
            </div>
        );
    }
}
