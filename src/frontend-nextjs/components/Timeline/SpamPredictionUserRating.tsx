'use client';

import React from 'react';
import { BsHandThumbsDown, BsHandThumbsDownFill, BsHandThumbsUp, BsHandThumbsUpFill } from 'react-icons/bs';
import { Button, Spinner } from '@heroui/react';

import { useSpamPredictionUserRating } from '@/hooks/queries/useSpamPredictionUserRating';
import { useRateSpamPrediction } from '@/hooks/mutations/useRateSpamPrediction';

export interface SpamPredictionUserRatingProps {
    isSpamPredictedLabel?: boolean | null;
    postId: string;
}

export function SpamPredictionUserRating(props: Readonly<SpamPredictionUserRatingProps>) {
    const { data: spamPredictionUserRatingData, isLoading } = useSpamPredictionUserRating(props.postId);
    const { handleSpamPredictionUpvote, handleSpamPredictionDownvote } = useRateSpamPrediction(props.postId);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div>
            <Button
                className='bg-transparent text-default-600 px-2 min-w-0 gap-1'
                name='upvoteSpamRating'
                onPress={() => handleSpamPredictionUpvote()}
            >
                <p>{spamPredictionUserRatingData?.spamPredictionUserUpvotes}</p>
                {spamPredictionUserRatingData?.isUpvotedByUser ? <BsHandThumbsUpFill /> : <BsHandThumbsUp />}
            </Button>

            <Button
                className='bg-transparent text-default-600 px-2 min-w-0 gap-1'
                name='downvoteSpamRating'
                onPress={() => handleSpamPredictionDownvote()}
            >
                <p>{spamPredictionUserRatingData?.spamPredictionUserDownvotes}</p>
                {spamPredictionUserRatingData?.isDownvotedByUser ? <BsHandThumbsDownFill /> : <BsHandThumbsDown />}
            </Button>
        </div>
    );
}
