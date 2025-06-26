'use client';
import { addToast, Button } from '@heroui/react';
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { useFollowingStatus } from '@/hooks/queries/useFollowingStatus';
import { followUser, unfollowUser } from '@/services/FollowService';

interface FollowButtonProps {
    username: string;
}

function handleFollowAction(
    followActionFn: (username: string) => Promise<Response>,
    errorToastMsg: string,
    username: string,
    queryClient: any,
) {
    followActionFn(username).then((res) => {
        if (!res.ok) {
            addToast({ title: errorToastMsg, description: res.statusText });
        } else {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.follow_status, username] }).then(() => {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.followers, username] });
            });
        }
    });
}

export function FollowButton(props: FollowButtonProps) {
    const { isFollowed, isLoading } = useFollowingStatus(props.username);
    const queryClient = useQueryClient();

    const handleFollowButtonClick = useCallback(() => {
        if (isFollowed) {
            handleFollowAction(unfollowUser, `Error unfollowing user ${props.username}`, props.username, queryClient);
        } else {
            handleFollowAction(followUser, `Error following user ${props.username}`, props.username, queryClient);
        }
    }, [isFollowed]);

    return (
        <Button
            color='primary'
            isLoading={isLoading}
            variant={isFollowed ? 'solid' : 'bordered'}
            onPress={() => handleFollowButtonClick()}
        >
            {isFollowed ? 'Unfollow' : 'Follow'}
        </Button>
    );
}
