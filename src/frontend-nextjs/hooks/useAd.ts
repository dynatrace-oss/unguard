import { useQuery } from '@tanstack/react-query';
import { addBasePath } from 'next/dist/client/add-base-path';

import { QUERY_KEYS } from '@/enums/queryKeys';

async function fetchAd() {
    const res = await fetch(addBasePath('/api/ad'));

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
