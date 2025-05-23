'use client';
import { Button } from '@heroui/react';
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { unfollowUser } from '@/services/FollowService';
import { followUser } from '@/services/FollowService';
import { useFollowingStatus } from '@/hooks/useFollowingStatus';

interface FollowButtonProps {
    username: string;
}

export function FollowButton(props: FollowButtonProps) {
    const { data: isFollowed, isLoading } = useFollowingStatus(props.username);
    const queryClient = useQueryClient();

    const handleFollowButtonClick = useCallback(() => {
        if (isFollowed) {
            unfollowUser(props.username).then(() =>
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.follow_status, props.username] }).then(() => {
                    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.followers, props.username] });
                }),
            );
        } else {
            followUser(props.username).then(() =>
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.follow_status, props.username] }).then(() => {
                    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.followers, props.username] });
                }),
            );
        }
    }, [isFollowed]);

    return (
        <Button
            color='primary'
            isLoading={isLoading}
            variant={isFollowed ? 'solid' : 'bordered'}
            onPress={() => handleFollowButtonClick()}
        >
            {isFollowed ? 'Followed' : 'Follow'}
        </Button>
    );
}
