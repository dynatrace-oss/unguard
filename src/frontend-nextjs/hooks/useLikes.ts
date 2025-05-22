import path from 'path';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { BASE_PATH } from '@/constants';

async function fetchLikes(postId: string) {
    const res = await fetch(path.join(BASE_PATH, '/api/likes/', postId));

    if (!res.ok) {
        throw new Error('Failed to fetch likes');
    }

    return res.json();
}

export function useLikes(postId: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.likes, postId],
        queryFn: () => fetchLikes(postId),
        throwOnError: true,
    });
}
