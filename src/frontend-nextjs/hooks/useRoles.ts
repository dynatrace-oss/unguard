import { useQuery } from '@tanstack/react-query';

async function fetchRoles() {
    const res = await fetch('/ui/api/roles');

    if (!res.ok) {
        throw new Error('Failed to fetch list of roles');
    }

    return res.json();
}

export function useRoles() {
    return useQuery({
        queryKey: ['roles'],
        queryFn: () => fetchRoles(),
    });
}
