import { useQuery } from '@tanstack/react-query';
import { addBasePath } from 'next/dist/client/add-base-path';

import { QUERY_KEYS } from '@/enums/queryKeys';

async function fetchJwtPayload() {
    const res = await fetch(addBasePath('/api/auth/jwt-payload'), { method: 'GET' });

    if (!res.ok) {
        throw new Error('Failed to fetch JWT');
    }

    return res.json();
}

export function useJwtPayload() {
    return useQuery({
        queryKey: [QUERY_KEYS.jwtPayload],
        queryFn: fetchJwtPayload,
        throwOnError: true,
    });
}
