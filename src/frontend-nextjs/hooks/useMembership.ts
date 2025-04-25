import { useQuery } from '@tanstack/react-query';

async function fetchMembership(username: string) {
    const res = await fetch(`/ui/api/user/${username}/membership`);

    if (!res.ok) {
        throw new Error('Failed to fetch membership for user ' + username);
    }

    return res.json();
}

export function useMembership(username: string) {
    return useQuery({
        queryKey: [`membership-${username}`],
        queryFn: () => fetchMembership(username),
    });
}
