import { NextResponse } from 'next/server';

import { unlikePost } from '@/services/api/LikeService';

/** @swagger
 * /ui/api/like/unlike:
 *   delete:
 *     description: Unlike a post by its ID.
 */

export async function DELETE(req: Request): Promise<NextResponse> {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.getAll('postId');
    const res = await unlikePost(postId);

    return NextResponse.json(res.data, { status: res.status });
}
