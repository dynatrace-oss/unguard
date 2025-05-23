import path from 'path';

import { BASE_PATH } from '@/constants';

export async function followUser(username: string): Promise<Response> {
    return await fetch(path.join(BASE_PATH, `/api/follow/${username}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function unfollowUser(username: string): Promise<Response> {
    return await fetch(path.join(BASE_PATH, `/api/follow/${username}`), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
}
