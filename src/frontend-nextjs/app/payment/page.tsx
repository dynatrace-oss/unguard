import { Spacer } from '@heroui/react';
import React from 'react';

import { ProfileHeader } from '@/components/ProfileHeader';
import { PaymentForm } from '@/components/PaymentForm';
import { getUsernameFromJwt } from '@/services/LocalUserService';
import { ErrorCard } from '@/components/ErrorCard';

export default async function PaymentPage() {
    const username = await getUsernameFromJwt();

    if (!username) {
        return <ErrorCard message='Error getting username: You must be logged in to access this page.' />;
    }

    return (
        <div>
            <div className='flex flex-row gap-16 items-center'>
                <ProfileHeader hideFollowers={true} isOwnProfile={true} username={username} />
            </div>
            <Spacer y={4} />
            <PaymentForm username={username} />
        </div>
    );
}
