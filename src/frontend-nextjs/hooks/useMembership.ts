import { useQuery } from '@tanstack/react-query';
import { addBasePath } from 'next/dist/client/add-base-path';

import { QUERY_KEYS } from '@/enums/queryKeys';

async function fetchMembership(username: string) {
    const res = await fetch(addBasePath(`/api/user/${username}/membership`));

    if (!res.ok) {
        throw new Error('Failed to fetch membership for user ' + username);
    }

    return res.json();
}

export function useMembership(username: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.membership, username],
        queryFn: () => fetchMembership(username),
    });
}
