import { NextResponse } from 'next/server';

import { fetchPostsForUser } from '@/services/API/PostService';

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }): Promise<NextResponse> {
    const { username } = await params;
    const posts = await fetchPostsForUser(username);

    return NextResponse.json(posts);
}
