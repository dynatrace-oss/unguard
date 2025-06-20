import path from 'path';

import { useQuery } from '@tanstack/react-query';

import { BASE_PATH } from '@/constants';
import { QUERY_KEYS } from '@/enums/queryKeys';

async function fetchAd() {
    const res = await fetch(path.join(BASE_PATH, '/api/ad'));

    if (!res.ok) {
        throw new Error('Failed to fetch ad');
    }

    return res.json();
}

export function useAd() {
    return useQuery({
        queryKey: [QUERY_KEYS.ad],
        queryFn: fetchAd,
        throwOnError: true,
    });
}
