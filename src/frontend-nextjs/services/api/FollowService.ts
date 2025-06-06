import { getMicroblogApi } from '@/axios';
import { getJwtFromCookie } from '@/services/api/AuthService';

export async function followUser(username: string): Promise<any> {
    return await getMicroblogApi()
        .post(`/users/${username}/follow`, {}, { headers: { Cookie: 'jwt=' + (await getJwtFromCookie()) } })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}

export async function unfollowUser(username: string): Promise<any> {
    return await getMicroblogApi()
        .post(`/users/${username}/unfollow`, {}, { headers: { Cookie: 'jwt=' + (await getJwtFromCookie()) } })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}

export async function isFollowing(username: string): Promise<any> {
    return await getMicroblogApi()
        .get(`/users/${username}/isFollowing`, {
            headers: { Cookie: 'jwt=' + (await getJwtFromCookie()) },
        })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}

export async function getFollowers(username: string): Promise<any> {
    return await getMicroblogApi()
        .get(`/users/${username}/followers`, {
            headers: { Cookie: 'jwt=' + (await getJwtFromCookie()) },
        })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}
