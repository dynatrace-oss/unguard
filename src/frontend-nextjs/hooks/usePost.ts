import { useQuery } from '@tanstack/react-query';
import { addBasePath } from 'next/dist/client/add-base-path';

import { QUERY_KEYS } from '@/enums/queryKeys';

async function fetchSinglePost(postId: string) {
    const res = await fetch(addBasePath(`/api/post/${postId}`));

    if (!res.ok) {
        throw new Error('Failed to fetch post with id ' + postId);
    }

    return res.json();
}

export function usePost(postId: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.post, postId],
        queryFn: () => fetchSinglePost(postId),
    });
}
