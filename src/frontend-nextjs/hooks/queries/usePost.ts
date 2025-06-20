import path from 'path';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { BASE_PATH } from '@/constants';
import { PostProps } from '@/components/Timeline/Post';

async function fetchSinglePost(postId: string): Promise<PostProps> {
    const res = await fetch(path.join(BASE_PATH, `/api/post/${postId}`));

    if (!res.ok) {
        throw new Error('Failed to fetch post with id ' + postId);
    }

    return res.json();
}

export function usePost(postId: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.post, postId],
        queryFn: () => fetchSinglePost(postId),
        throwOnError: true,
    });
}
