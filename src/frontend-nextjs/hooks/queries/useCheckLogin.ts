import path from 'path';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { BASE_PATH } from '@/constants';

async function fetchIsLoggedIn(): Promise<boolean> {
    const res = await fetch(path.join(BASE_PATH, '/api/auth/login'), { method: 'GET' });

    if (!res.ok) {
        throw new Error('Failed to fetch login status');
    }

    return res.json();
}

export function useCheckLogin() {
    const { data, ...rest } = useQuery({
        queryKey: [QUERY_KEYS.isLoggedIn],
        queryFn: fetchIsLoggedIn,
        throwOnError: true,
    });

    return { isLoggedIn: data, ...rest };
}
