import { useMutation, useQueryClient } from '@tanstack/react-query';

import { likePost, unlikePost } from '@/services/LikeService';
import { QUERY_KEYS } from '@/enums/queryKeys';

export function useLikeChange(postId: string) {
    const queryClient = useQueryClient();

    const likeMutation = useMutation({
        mutationFn: () => likePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.likes, postId] });
        },
    });

    const unlikeMutation = useMutation({
        mutationFn: () => unlikePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.likes, postId] });
        },
    });

    return {
        likePost: likeMutation.mutate,
        unlikePost: unlikeMutation.mutate,
    };
}
