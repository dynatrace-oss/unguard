'use client';
import { Avatar, Button, Spinner } from '@heroui/react';

import { useBio } from '@/hooks/queries/useBio';
import { useMembership } from '@/hooks/queries/useMembership';
import { FollowButton } from '@/components/UserProfile/FollowButton';
import { ErrorCard } from '@/components/ErrorCard';
import { BlueCheckmarkIcon } from '@/components/UserProfile/BlueCheckmarkIcon';
import { MEMBERSHIP } from '@/enums/memberships';
import { useNavigation } from '@/hooks/useNavigation';
import { FollowersView } from '@/components/UserProfile/FollowersView';

interface ProfileHeaderProps {
    username: string;
    isOwnProfile: boolean;
    hideFollowers?: boolean;
}

export function ProfileHeader({ username, isOwnProfile, hideFollowers }: ProfileHeaderProps) {
    const { data: bio } = useBio(username);
    const { data: membership, isLoading, isError } = useMembership(username);
    const { navigateToMembershipPage } = useNavigation();

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
                        <Button
                            className={`${membership == MEMBERSHIP.PRO ? 'bg-blue-500 text-white' : 'bg-default'}`}
                            style={!isOwnProfile ? { pointerEvents: 'none' } : undefined}
                            onPress={() => navigateToMembershipPage()}
                        >
                            <span>{membership}</span>
                            {membership == MEMBERSHIP.PRO && <BlueCheckmarkIcon />}
                        </Button>
                    </div>
                    {!hideFollowers && <FollowersView username={username} />}
                    {!isOwnProfile && <FollowButton username={username} />}
                </div>
            </div>
            <div
                dangerouslySetInnerHTML={{ __html: bio ? bio : '' }}
                className='border-l-4 border-l-gray-500 text-gray-500 pl-2'
            />
        </div>
    );
}
