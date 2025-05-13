export async function updateBio(
    username: string,
    data: { bioText: string; enableMarkdown: boolean },
): Promise<Response> {
    return await fetch(`/ui/api/user/${username}/bio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}
