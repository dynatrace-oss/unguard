'use client';
import { Avatar, Button } from '@heroui/react';

import { useBio } from '@/hooks/useBio';
import { useMembership } from '@/hooks/useMembership';
import { useJwtPayload } from '@/hooks/useJwtPayload';
import { FollowButton } from '@/components/FollowButton';

interface ProfileHeaderProps {
    username: string;
}

export function ProfileHeader({ username }: ProfileHeaderProps) {
    const { data: bio } = useBio(username);
    const { data: membership } = useMembership(username);
    const { data: jwt_payload } = useJwtPayload();

    return (
        <div>
            <div className='flex flex-row gap-2 items-center pb-4'>
                <Avatar
                    alt={username}
                    className='w-40 h-40'
                    name={username}
                    src={`https://robohash.org/${username}.png?set=set1&size=150x150`}
                />
                <p className='text-2xl'>{username}</p>
                <Button
                    color={membership === 'PRO' ? 'primary' : 'default'}
                    isDisabled={jwt_payload?.username !== username}
                >
                    {membership}
                </Button>
                {username === jwt_payload?.username ? (
                    ''
                ) : (
                    <div className='pl-2'>
                        <FollowButton />
                    </div>
                )}
            </div>
            <div dangerouslySetInnerHTML={{ __html: bio }} className='' />
        </div>
    );
}
