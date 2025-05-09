import { useQuery } from '@tanstack/react-query';

async function fetchUsers(params: {}) {
    const res = await fetch('/ui/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });

    if (!res.ok) {
        throw new Error('Failed to fetch list of users');
    }

    return res.json();
}

export function useUserList(params: any, queryKey: string) {
    return useQuery({
        queryKey: [queryKey],
        queryFn: () => fetchUsers(params),
    });
}
