import path from 'path';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { BASE_PATH } from '@/constants';
import { PostProps } from '@/components/Timeline/Post';

async function fetchAllPosts(): Promise<PostProps[]> {
    const res = await fetch(path.join(BASE_PATH, '/api/posts'));

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

async function fetchPostsOfUser(username: string): Promise<PostProps[]> {
    const res = await fetch(path.join(BASE_PATH, `/api/posts/${username}`));

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

async function fetchPersonalTimeline(): Promise<PostProps[]> {
    const res = await fetch(path.join(BASE_PATH, '/api/posts/mytimeline'));

    if (!res.ok) {
        throw new Error('Failed to fetch personal timeline');
    }

    return res.json();
}

export function usePersonalTimeline() {
    return useQuery({
        queryKey: [QUERY_KEYS.posts, QUERY_KEYS.my_timeline],
        queryFn: () => fetchPersonalTimeline(),
        throwOnError: true,
    });
}
