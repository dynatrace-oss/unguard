import path from 'path';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { BASE_PATH } from '@/constants';

async function checkForAdManagerRole(): Promise<boolean> {
    const res = await fetch(path.join(BASE_PATH, '/api/auth/ad-manager'), { method: 'GET' });

    if (!res.ok) {
        throw new Error('Failed to fetch ad manager status');
    }

    return res.json();
}

export function useCheckAdmanager() {
    const { data, ...rest } = useQuery({
        queryKey: [QUERY_KEYS.isLoggedIn, QUERY_KEYS.ad_manager],
        queryFn: checkForAdManagerRole,
        throwOnError: true,
    });

    return { isAdManager: data, ...rest };
}
