import path from 'path';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { BASE_PATH } from '@/constants';

async function fetchFollowingStatus(username: string): Promise<boolean> {
    const res = await fetch(path.join(BASE_PATH, '/api/follow/', username));

    if (!res.ok) {
        throw new Error('Failed to fetch follow status');
    }

    return res.json();
}

export function useFollowingStatus(username: string) {
    const { data, ...rest } = useQuery({
        queryKey: [QUERY_KEYS.follow_status, username],
        queryFn: () => fetchFollowingStatus(username),
        throwOnError: true,
    });

    return { isFollowed: data, ...rest };
}
