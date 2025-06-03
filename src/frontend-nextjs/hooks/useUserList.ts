import path from 'path';

import { useQuery } from '@tanstack/react-query';

import { BASE_PATH } from '@/constants';

type User = {
    userId: string;
    username: string;
    roles: string[];
};

async function fetchUsers(params: {}): Promise<User[]> {
    const res = await fetch(path.join(BASE_PATH, '/api/users'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });

    if (!res.ok) {
        throw new Error('Failed to fetch list of users');
    }

    return res.json();
}

export function useUserList(params: any, queryKey: string) {
    return useQuery({
        queryKey: [queryKey],
        queryFn: () => fetchUsers(params),
        throwOnError: true,
    });
}
