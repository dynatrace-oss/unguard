import { useQuery } from '@tanstack/react-query';
import { addBasePath } from 'next/dist/client/add-base-path';

import { QUERY_KEYS } from '@/enums/queryKeys';

async function fetchIsLoggedIn() {
    const res = await fetch(addBasePath('/api/auth/login'), { method: 'GET' });

    if (!res.ok) {
        throw new Error('Failed to fetch login status');
    }

    return res.json();
}

export function useCheckLogin() {
    return useQuery({
        queryKey: [QUERY_KEYS.isLoggedIn],
        queryFn: fetchIsLoggedIn,
        throwOnError: true,
    });
}
