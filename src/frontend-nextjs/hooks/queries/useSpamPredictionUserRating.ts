import path from 'path';

import {useQuery} from '@tanstack/react-query';

import {QUERY_KEYS} from '@/enums/queryKeys';
import {BASE_PATH} from '@/constants';

type SpamPredictionUserRating = {
    spamPredictionUserUpvotes: number;
    spamPredictionUserDownvotes: boolean;
    isUpvotedByUser?: boolean;
    isDownvotedByUser?: boolean;
};

async function fetchSpamPredictionUserRatings(postId: string): Promise<SpamPredictionUserRating> {
    const res = await fetch(path.join(BASE_PATH, `/api/post/${postId}/spam-prediction-user-rating/`));

    if (!res.ok) {
        throw new Error('Failed to fetch spam prediction user ratings');
    }

    return await res.json();
}

export function useSpamPredictionUserRating(postId: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.spam_prediction_user_rating, postId],
        queryFn: () => fetchSpamPredictionUserRatings(postId),
        throwOnError: true,
    });
}
