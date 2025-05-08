import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';

async function fetchPostsOfUser(username: string) {
    const res = await fetch(`/ui/api/posts/${username}`);

    if (!res.ok) {
        throw new Error('Failed to fetch posts for user ' + username);
    }

    return res.json();
}

async function fetchAllPosts() {
    const res = await fetch('/ui/api/posts');

    if (!res.ok) {
        throw new Error('Failed to fetch posts');
    }

    return res.json();
}

export function useAllPosts() {
    return useQuery({
        queryKey: [QUERY_KEYS.posts],
        queryFn: () => fetchAllPosts(),
    });
}

async function fetchPostsOfUser(username: string) {
    const res = await fetch(`/ui/api/posts/${username}`);

    if (!res.ok) {
        throw new Error('Failed to fetch posts for user ' + username);
    }

    return res.json();
}

export function usePostsOfUser(username: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.posts, username],
        queryFn: () => fetchPostsOfUser(username),
    });
}
