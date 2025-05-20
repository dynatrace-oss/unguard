import path from 'path';

import { BASE_PATH } from '@/constants';

export async function updateBio(
    username: string,
    data: { bioText: string; enableMarkdown: boolean },
): Promise<Response> {
    return await fetch(path.join(BASE_PATH, `/api/user/${username}/bio`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}
