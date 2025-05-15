import { useQuery } from '@tanstack/react-query';
import { addBasePath } from 'next/dist/client/add-base-path';

import { QUERY_KEYS } from '@/enums/queryKeys';

async function fetchBio(username: string) {
    const res = await fetch(addBasePath(`/api/user/${username}/bio`));

    if (!res.ok) {
        throw new Error('Failed to fetch user bio');
    }

    return res.json();
}

export function useBio(username: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.bio, username],
        queryFn: () => fetchBio(username),
    });
}
