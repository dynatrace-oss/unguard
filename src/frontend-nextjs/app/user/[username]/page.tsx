import { Spacer } from '@heroui/react';

import { BioEditor } from '@/components/UserProfile/BioEditor';
import { ProfileHeader } from '@/components/UserProfile/ProfileHeader';
import { UserTimeline } from '@/components/UserProfile/UserTimeline';
import { isOwnProfile as checkIsOwnProfile } from '@/services/LocalUserService';

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
            <UserTimeline username={username} />
        </div>
    );
}
