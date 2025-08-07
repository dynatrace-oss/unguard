import { NextResponse } from 'next/server';

import { fetchPostById } from '@/services/api/PostService';
import { PostParams } from '@/app/api/like/[postId]/route';

/**
 * @swagger
 * /ui/api/post/{postId}:
 *   get:
 *     description: Get a post by its ID.
 */

export async function GET(req: Request, { params }: { params: Promise<PostParams> }): Promise<NextResponse> {
    const { postId } = await params;
    const posts = await fetchPostById(postId);

    return NextResponse.json(posts);
}
