import { NextResponse } from 'next/server';

import { fetchPostsForUser } from '@/services/api/PostService';
import { UserParams } from '@/app/api/user/[username]/bio/route';

/**
 * @swagger
 * /ui/api/posts/{username}:
 *   get:
 *     description: Get posts for a user by username.
 */

export async function GET(req: Request, { params }: { params: Promise<UserParams> }): Promise<NextResponse> {
    const { username } = await params;
    const posts = await fetchPostsForUser(username);

    return NextResponse.json(posts);
}
