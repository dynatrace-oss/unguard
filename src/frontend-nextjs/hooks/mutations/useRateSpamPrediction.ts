import { useMutation, useQueryClient } from '@tanstack/react-query';

import {handleSpamPredictionDownvote, handleSpamPredictionUpvote} from '@/services/SpamPredictionVotingService';
import { QUERY_KEYS } from '@/enums/queryKeys';

export function useRateSpamPrediction(postId: string) {
    const queryClient = useQueryClient();

    const handleUpvoteMutation = useMutation({
        mutationFn: () => handleSpamPredictionUpvote(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.spam_prediction_user_rating, postId] });
        },
    });

    const handleDownvoteMutation = useMutation({
        mutationFn: () => handleSpamPredictionDownvote(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.spam_prediction_user_rating, postId] });
        },
    });

    return {
        handleSpamPredictionUpvote: handleUpvoteMutation.mutate,
        handleSpamPredictionDownvote: handleDownvoteMutation.mutate
    };
}
