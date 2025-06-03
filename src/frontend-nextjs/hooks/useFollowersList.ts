import path from 'path';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { BASE_PATH } from '@/constants';

type Follower = {
    userId: string;
    userName: string;
};

async function fetchListOfFollowers(username: string): Promise<Follower[]> {
    const res = await fetch(path.join(BASE_PATH, '/api/followers/', username));

    if (!res.ok) {
        throw new Error('Failed to fetch list of followers');
    }

    return res.json();
}

export function useFollowersList(username: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.followers, username],
        queryFn: () => fetchListOfFollowers(username),
        throwOnError: true,
    });
}
