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

    return res.json();
}
