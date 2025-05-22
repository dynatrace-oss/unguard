import { cookies } from 'next/headers';

import { LIKE_SERVICE_API } from '@/axios';

export async function fetchLikes(postId: string): Promise<any> {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    return await LIKE_SERVICE_API.get(`/like`, { params: { postId: postId }, headers: { Cookie: 'jwt=' + jwt } })
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

    return await LIKE_SERVICE_API.post(
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

    return await LIKE_SERVICE_API.delete(`/like`, {
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
