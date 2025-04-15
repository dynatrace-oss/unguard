import { useQuery } from '@tanstack/react-query';

async function fetchBio(username: string) {
    const res = await fetch(`/ui/api/user/${username}/bio`);

    if (!res.ok) {
        throw new Error('Failed to fetch user bio');
    }

    return res.json();
}

export function useBio(username: string) {
    return useQuery({
        queryKey: [`bio-${username}`],
        queryFn: () => fetchBio(username),
    });
}
