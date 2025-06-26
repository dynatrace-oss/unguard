import path from 'path';

import { useQuery } from '@tanstack/react-query';

import { BASE_PATH } from '@/constants';
import { QUERY_KEYS } from '@/enums/queryKeys';
import { AdList } from '@/services/api/AdManagerService';

async function fetchListOfAds(): Promise<AdList> {
    const res = await fetch(path.join(BASE_PATH, '/api/ads'));

    if (!res.ok) {
        throw new Error('Failed to fetch list of ads');
    }

    return res.json();
}

export function useAdList() {
    return useQuery({
        queryKey: [QUERY_KEYS.ad_list],
        queryFn: () => fetchListOfAds(),
        throwOnError: true,
    });
}
