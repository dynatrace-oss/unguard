import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { MICROBLOG_API } from '@/axios';

async function fetchPostsForUser(username: string): Promise<any> {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    const res = await MICROBLOG_API.get(`/users/${username}/posts`, { headers: { Cookie: 'jwt=' + jwt } });

    if (res.status !== 200) {
        throw new Error('Failed to fetch Posts from Microblog-Service');
    }

    return res.data;
}

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }): Promise<NextResponse> {
    const { username } = await params;
    const posts = await fetchPostsForUser(username);

    return NextResponse.json(posts, { status: 200 });
}
