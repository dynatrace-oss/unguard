'use client';
import { Button, Spinner } from '@heroui/react';
import { BsHandThumbsUp, BsHandThumbsUpFill } from 'react-icons/bs';
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useCheckLogin } from '@/hooks/useCheckLogin';
import { useLikes } from '@/hooks/useLikes';
import { likePost, unlikePost } from '@/services/LikeService';
import { QUERY_KEYS } from '@/enums/queryKeys';

export interface LikeButtonProps {
    postId: string;
}

export function LikeButton(props: LikeButtonProps) {
    const isLoggedIn = useCheckLogin();
    const queryClient = useQueryClient();
    const { data: likes, isLoading } = useLikes(props.postId);
    const isLiked = likes?.likedPosts.some((like: any) => like.postId === props.postId);

    const handleLikeButtonClick = useCallback(() => {
        if (isLiked) {
            unlikePost(props.postId).then(() => {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.likes, props.postId] });
            });
        } else {
            likePost(props.postId).then(() =>
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.likes, props.postId] }),
            );
        }
    }, [isLiked]);

    if (isLoading) {
        return <Spinner />;
    }

    let numOfLikes;

    if (likes?.likeCounts.length > 0) {
        numOfLikes = likes?.likeCounts[0].likeCount;
    } else {
        numOfLikes = 0;
    }

    return (
        <Button
            className=' text-default-600 bg-transparent'
            isDisabled={!isLoggedIn}
            onPress={() => handleLikeButtonClick()}
        >
            <p>{numOfLikes}</p>
            {isLiked ? <BsHandThumbsUpFill /> : <BsHandThumbsUp />}
        </Button>
    );
}
