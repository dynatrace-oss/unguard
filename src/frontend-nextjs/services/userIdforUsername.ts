import { USER_AUTH_API } from '@/axios';

export async function fetchUserIdForUsername(username: string): Promise<any> {
    const res = await USER_AUTH_API.post('/user/useridForName', { username: username });

    if (res.status !== 200) {
        throw new Error('Failed to resolve UserID from Username');
    }

    return res.data;
}
