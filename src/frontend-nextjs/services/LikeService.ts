import path from 'path';

import { BASE_PATH } from '@/constants';

export async function likePost(postId: string): Promise<Response> {
    return await fetch(path.join(BASE_PATH, `/api/like/${postId}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function unlikePost(postId: string): Promise<Response> {
    return await fetch(path.join(BASE_PATH, `/api/like/${postId}`), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
}
