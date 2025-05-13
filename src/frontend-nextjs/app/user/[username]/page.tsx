import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { Spacer } from '@heroui/react';

import { BioEditor } from '@/components/BioEditor';
import { ProfileHeader } from '@/components/ProfileHeader';
import { CustomPayLoad } from '@/app/api/auth/jwt-payload/route';
import { Timeline } from '@/components/Timeline';

async function checkIsOwnProfile(username: string) {
    const cookieStore = await cookies();

    if (cookieStore.has('jwt')) {
        const jwt = cookieStore.get('jwt')?.value;

        if (jwt) {
            const decodedPayload = jwtDecode<CustomPayLoad>(jwt);

            if (decodedPayload.username == username) {
                return true;
            }
        }
    }

    return false;
}

interface UserProfileRouteParams {
    username: string;
}

export default async function UserProfile({ params }: { params: Promise<UserProfileRouteParams> }) {
    const { username } = await params;
    const isOwnProfile = await checkIsOwnProfile(username);

    return (
        <div>
            <div className='flex flex-row gap-16 items-center'>
                <ProfileHeader isOwnProfile={isOwnProfile} username={username} />
            </div>
            {isOwnProfile && <BioEditor username={username} />}
            <Spacer y={16} />
            <h2 className='mb-6 text-2xl font-extrabold leading-none tracking-tight text-gray-800'>
                {isOwnProfile ? 'Your Posts' : 'Posts of ' + username}
            </h2>
            <Timeline username={username} />
        </div>
    );
}
