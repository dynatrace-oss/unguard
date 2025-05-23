'use client';
import { Button, Spinner } from '@heroui/react';
import { BsHandThumbsUp, BsHandThumbsUpFill } from 'react-icons/bs';
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useLikes } from '@/hooks/useLikes';
import { likePost, unlikePost } from '@/services/LikeService';
import { QUERY_KEYS } from '@/enums/queryKeys';

export interface LikeButtonProps {
    postId: string;
}

export function LikeButton(props: LikeButtonProps) {
    const queryClient = useQueryClient();
    const { data: postLikesData, isLoading } = useLikes(props.postId);

    const handleLikeButtonClick = useCallback(() => {
        if (postLikesData?.isLikedByUser) {
            unlikePost(props.postId).then(() => {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.likes, props.postId] });
            });
        } else {
            likePost(props.postId).then(() =>
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.likes, props.postId] }),
            );
        }
    }, [postLikesData?.isLikedByUser]);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <Button className=' text-default-600 bg-transparent' onPress={() => handleLikeButtonClick()}>
            <p>{postLikesData?.likesCount}</p>
            {postLikesData?.isLikedByUser ? <BsHandThumbsUpFill /> : <BsHandThumbsUp />}
        </Button>
    );
}
