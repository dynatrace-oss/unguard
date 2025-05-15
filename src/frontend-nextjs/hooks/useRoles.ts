import { useQuery } from '@tanstack/react-query';
import { addBasePath } from 'next/dist/client/add-base-path';

import { QUERY_KEYS } from '@/enums/queryKeys';

async function fetchRoles() {
    const res = await fetch(addBasePath('/api/roles'));

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
