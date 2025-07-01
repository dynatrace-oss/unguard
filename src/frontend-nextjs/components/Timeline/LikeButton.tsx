'use client';
import { Button, Spinner } from '@heroui/react';
import { BsHandThumbsUp, BsHandThumbsUpFill } from 'react-icons/bs';
import { useCallback } from 'react';

import { useLikes } from '@/hooks/queries/useLikes';
import { useLikeChange } from '@/hooks/mutations/useLikeChange';

export interface LikeButtonProps {
    postId: string;
}

export function LikeButton(props: LikeButtonProps) {
    const { data: postLikesData, isLoading } = useLikes(props.postId);
    const { likePost, unlikePost } = useLikeChange(props.postId);

    const handleLikeButtonClick = useCallback(() => {
        if (postLikesData?.isLikedByUser) {
            unlikePost();
        } else {
            likePost();
        }
    }, [postLikesData?.isLikedByUser]);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <Button className=' text-default-600 bg-transparent' name='likePost' onPress={() => handleLikeButtonClick()}>
            <p>{postLikesData?.likesCount}</p>
            {postLikesData?.isLikedByUser ? <BsHandThumbsUpFill /> : <BsHandThumbsUp />}
        </Button>
    );
}
