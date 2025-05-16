import { addBasePath } from 'next/dist/client/add-base-path';

export async function updateBio(
    username: string,
    data: { bioText: string; enableMarkdown: boolean },
): Promise<Response> {
    return await fetch(addBasePath(`/api/user/${username}/bio`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}
