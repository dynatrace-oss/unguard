import { NextResponse } from 'next/server';

import { likePost } from '@/services/api/LikeService';

/**
 * @swagger
 * /ui/api/like/{postId}:
 *   post:
 *     description: Like a post by its ID.
 */

export type PostParams = {
    postId: string;
};

export async function POST(req: Request, { params }: { params: Promise<PostParams> }): Promise<NextResponse> {
    const { postId } = await params;
    const res = await likePost(postId);

    return NextResponse.json(res.data, { status: res.status });
}
