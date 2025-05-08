import { Spacer } from '@heroui/react';

import { BioEditor } from '@/components/BioEditor';
import { ProfileHeader } from '@/components/ProfileHeader';
import { isOwnProfile } from '@/helpers/isOwnProfile';
import { UserTimeline } from '@/components/UserTimeline';

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
            <UserTimeline username={username} />
        </div>
    );
}
