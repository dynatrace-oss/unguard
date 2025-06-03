import path from 'path';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { BASE_PATH } from '@/constants';

async function fetchBio(username: string): Promise<string> {
    const res = await fetch(path.join(BASE_PATH, `/api/user/${username}/bio`));

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
