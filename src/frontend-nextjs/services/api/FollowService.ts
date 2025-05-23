import { cookies } from 'next/headers';

import { MICROBLOG_API } from '@/axios';

export async function followUser(username: string): Promise<any> {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    const res = await MICROBLOG_API.post(`/users/${username}/follow`, {}, { headers: { Cookie: 'jwt=' + jwt } });

    if (res.status !== 200) {
        throw new Error('Failed to follow user');
    }

    return res;
}

export async function unfollowUser(username: string): Promise<any> {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    const res = await MICROBLOG_API.post(`/users/${username}/unfollow`, {}, { headers: { Cookie: 'jwt=' + jwt } });

    if (res.status !== 200) {
        throw new Error('Failed to unfollow user');
    }

    return res;
}

export async function isFollowing(username: string): Promise<any> {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    const res = await MICROBLOG_API.get(`/users/${username}/isFollowing`, { headers: { Cookie: 'jwt=' + jwt } });

    if (res.status !== 200) {
        throw new Error('Failed to check if user is following');
    }

    return res;
}

export async function getFollowers(username: string): Promise<any> {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    const res = await MICROBLOG_API.get(`/users/${username}/followers`, { headers: { Cookie: 'jwt=' + jwt } });

    if (res.status !== 200) {
        throw new Error('Failed to fetch followers');
    }

    return res;
}
