import path from 'path';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { BASE_PATH } from '@/constants';

type LikeData = {
    likesCount: number;
    isLikedByUser: boolean;
};

async function fetchLikes(postId: string): Promise<LikeData> {
    const res = await fetch(path.join(BASE_PATH, '/api/likes/', postId));

    if (!res.ok) {
        throw new Error('Failed to fetch likes');
    }

    const data = await res.json();

    const likesCount = data?.likeCounts[0]?.likeCount ?? 0;
    const isLikedByUser = data?.likedPosts.some((likedPost: any) => likedPost.postId === postId) ?? false;

    return { likesCount, isLikedByUser };
}

export function useLikes(postId: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.likes, postId],
        queryFn: () => fetchLikes(postId),
        throwOnError: true,
    });
}
