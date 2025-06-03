import path from 'path';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { BASE_PATH } from '@/constants';
import { CustomPayLoad } from '@/services/LocalUserService';

async function fetchJwtPayload(): Promise<CustomPayLoad> {
    const res = await fetch(path.join(BASE_PATH, '/api/auth/jwt-payload'), { method: 'GET' });

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
