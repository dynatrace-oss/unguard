import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { Spacer } from '@heroui/react';

import { BioEditor } from '@/components/BioEditor';
import { ProfileHeader } from '@/components/ProfileHeader';
import { CustomPayLoad } from '@/app/api/auth/jwt-payload/route';
import { Timeline } from '@/components/Timeline';

async function isOwnProfile(username: string) {
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

export default async function UserProfile({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    return (
        <div>
            <div className='flex flex-row gap-16 items-center'>
                <ProfileHeader username={username} />
            </div>
            {(await isOwnProfile(username)) && <BioEditor username={username} />}
            <Spacer y={16} />
            <h2 className='mb-6 text-2xl font-extrabold leading-none tracking-tight text-gray-800'>
                {(await isOwnProfile(username)) ? 'Your Posts' : 'Posts of ' + username}
            </h2>
            <Timeline username={username} />
        </div>
    );
}
