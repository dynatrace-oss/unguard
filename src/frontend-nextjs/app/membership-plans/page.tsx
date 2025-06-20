import React from 'react';

import { MembershipSelector } from '@/components/Membership/MembershipSelector';
import { getUsernameFromJwt } from '@/services/LocalUserService';
import { ErrorCard } from '@/components/ErrorCard';

export default async function MembershipPlans() {
    const username = await getUsernameFromJwt();

    if (!username) {
        return <ErrorCard message='Error getting username: You must be logged in to access this page.' />;
    }

    return <MembershipSelector username={username} />;
}
