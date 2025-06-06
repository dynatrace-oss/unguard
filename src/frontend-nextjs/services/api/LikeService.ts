import { getLikeServiceApi } from '@/axios';
import { getJwtFromCookie } from '@/services/api/AuthService';

export async function fetchLikes(postId: string): Promise<any> {
    return await getLikeServiceApi()
        .get(`/like`, { params: { postId: postId }, headers: { Cookie: 'jwt=' + (await getJwtFromCookie()) } })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}

export async function likePost(postId: string): Promise<any> {
    return await getLikeServiceApi()
        .post(
            `/like/${postId}`,
            {},
            {
                headers: { Cookie: 'jwt=' + (await getJwtFromCookie()) },
            },
        )
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}

export async function unlikePost(postId: string): Promise<any> {
    return await getLikeServiceApi()
        .delete(`/like`, {
            params: { postId: postId },
            headers: { Cookie: 'jwt=' + (await getJwtFromCookie()) },
        })

        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}
