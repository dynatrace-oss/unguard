import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';

async function fetchRoles() {
    const res = await fetch('/ui/api/roles');

    if (!res.ok) {
        throw new Error('Failed to fetch list of roles');
    }

    return res.json();
}

export function useRoles() {
    return useQuery({
        queryKey: [QUERY_KEYS.roles],
        queryFn: () => fetchRoles(),
    });
}
