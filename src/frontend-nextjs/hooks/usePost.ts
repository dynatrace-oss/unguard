import { useQuery } from '@tanstack/react-query';

async function fetchSinglePost(postId: string) {
    const res = await fetch(`/ui/api/post/${postId}`);

    if (!res.ok) {
        throw new Error('Failed to fetch post with id ' + postId);
    }

    return res.json();
}

export function usePost(postId: string) {
    return useQuery({
        queryKey: [`post-${postId}`],
        queryFn: () => fetchSinglePost(postId),
    });
}
