import { NextResponse } from 'next/server';

import { fetchPostsForUser } from '@/services/api/PostService';
import { UserParams } from '@/app/api/user/[username]/bio/route';

export async function GET(req: Request, { params }: { params: Promise<UserParams> }): Promise<NextResponse> {
    const { username } = await params;
    const posts = await fetchPostsForUser(username);

    return NextResponse.json(posts);
}
