import { useQuery } from '@tanstack/react-query';

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

async function fetchPosts(username?: string) {
    if (username) {
        return fetchPostsOfUser(username);
    }

    return fetchAllPosts();
}

export function usePosts(username?: string) {
    return useQuery({
        queryKey: ['posts'],
        queryFn: () => fetchPosts(username),
    });
}
