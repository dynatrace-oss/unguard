import path from 'path';

import { useQuery } from '@tanstack/react-query';

import { BASE_PATH } from '@/constants';

type User = {
    userId: string;
    username: string;
    roles: string[];
};

async function fetchUsers(params: Record<string, any>): Promise<User[]> {
    const queryParams = new URLSearchParams(params).toString();
    const res = await fetch(path.join(BASE_PATH, `/api/users?${queryParams}`), {
        method: 'GET',
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
