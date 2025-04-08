import { useQuery } from '@tanstack/react-query';

async function fetchPosts() {
    const res = await fetch('ui/api/posts');

    if (!res.ok) {
        throw new Error('Failed to fetch posts');
    }

    return res.json();
}

export function usePosts() {
    return useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
    });
}
