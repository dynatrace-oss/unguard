import path from 'path';

import { BASE_PATH } from '@/constants';

export interface Post {
    content?: string;
    url?: string;
    imageUrl?: string;
    language?: string;
}

export async function createNewPost(data: Post) {
    const res = await fetch(path.join(BASE_PATH, '/api/post'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error_res = await res.json();
        throw new Error(error_res.statusText || 'Failed to create new post');
    }

    return res.json();
}
