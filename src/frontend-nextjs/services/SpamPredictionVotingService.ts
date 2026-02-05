import path from 'path';

import { BASE_PATH } from '@/constants';

export async function handleSpamPredictionDownvote(postId: string): Promise<Response> {
    return await fetch(path.join(BASE_PATH, `/api/post/${postId}/spam-prediction-user-rating/downvote/`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function handleSpamPredictionUpvote(postId: string): Promise<Response> {
    return await fetch(path.join(BASE_PATH, `/api/post/${postId}/spam-prediction-user-rating/upvote/`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
}
