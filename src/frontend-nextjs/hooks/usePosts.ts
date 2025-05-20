import { useQuery } from '@tanstack/react-query';
import { addBasePath } from 'next/dist/client/add-base-path';

import { QUERY_KEYS } from '@/enums/queryKeys';

async function fetchAllPosts() {
    const res = await fetch(addBasePath('/api/posts'));

    if (!res.ok) {
        throw new Error('Failed to fetch posts');
    }

    return res.json();
}

export function useAllPosts() {
    return useQuery({
        queryKey: [QUERY_KEYS.posts],
        queryFn: () => fetchAllPosts(),
        throwOnError: true,
    });
}

async function fetchPostsOfUser(username: string) {
    const res = await fetch(addBasePath(`/api/posts/${username}`));

    if (!res.ok) {
        throw new Error('Failed to fetch posts for user ' + username);
    }

    return res.json();
}

export function usePostsOfUser(username: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.posts, username],
        queryFn: () => fetchPostsOfUser(username),
        throwOnError: true,
    });
}

async function fetchPersonalTimeline() {
    const res = await fetch(addBasePath('/api/posts/mytimeline'));

    if (!res.ok) {
        throw new Error('Failed to fetch personal timeline');
    }

    return res.json();
}

export function usePersonalTimeline() {
    return useQuery({
        queryKey: [QUERY_KEYS.my_timeline],
        queryFn: () => fetchPersonalTimeline(),
        throwOnError: true,
    });
}
