import { cookies } from 'next/headers';

import { getLikeServiceApi } from '@/axios';

export async function fetchLikes(postId: string): Promise<any> {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    return await getLikeServiceApi()
        .get(`/like`, { params: { postId: postId }, headers: { Cookie: 'jwt=' + jwt } })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}

export async function likePost(postId: string): Promise<any> {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    return await getLikeServiceApi()
        .post(
            `/like/${postId}`,
            {},
            {
                headers: { Cookie: 'jwt=' + jwt },
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
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    return await getLikeServiceApi()
        .delete(`/like`, {
            params: { postId: postId },
            headers: { Cookie: 'jwt=' + jwt },
        })

        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}
