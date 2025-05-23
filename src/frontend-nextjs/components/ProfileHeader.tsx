'use client';
import { Avatar, Button, Spinner } from '@heroui/react';

import { useBio } from '@/hooks/useBio';
import { useMembership } from '@/hooks/useMembership';
import { FollowButton } from '@/components/FollowButton';
import { ErrorCard } from '@/components/ErrorCard';
import { FollowerList } from '@/components/FollowerList';

interface ProfileHeaderProps {
    username: string;
    isOwnProfile: boolean;
}

export function ProfileHeader({ username, isOwnProfile }: ProfileHeaderProps) {
    const { data: bio } = useBio(username);
    const { data: membership, isLoading, isError } = useMembership(username);

    if (isLoading)
        return (
            <div className='flex items-center justify-center'>
                <Spinner />
            </div>
        );
    if (isError) {
        return <ErrorCard message='User does not exist' />;
    }

    return (
        <div>
            <div className='flex flex-row gap-2 items-center pb-4'>
                <Avatar
                    alt={username}
                    className='w-40 h-40'
                    name={username}
                    src={`https://robohash.org/${username}.png?set=set1&size=150x150`}
                />
                <div className='flex-column gap-2 items-center pb-1'>
                    <div className='flex flex-row gap-2 items-center pb-1'>
                        <p className='text-3xl font-bold'>{username}</p>
                        <Button color={membership === 'PRO' ? 'primary' : 'default'} isDisabled={!isOwnProfile}>
                            {membership}
                        </Button>
                    </div>
                    <FollowerList username={username} />
                    {!isOwnProfile && <FollowButton username={username} />}
                </div>
            </div>
            <div
                dangerouslySetInnerHTML={{ __html: bio }}
                className='border-l-4 border-l-gray-500 text-gray-500 pl-2'
            />
        </div>
    );
}
