import { NextResponse } from 'next/server';

import { unlikePost } from '@/services/api/LikeService';

/*
This route uses search params for the postId to allow the SQL-Injection attack in the like-service
 */
export async function DELETE(req: Request): Promise<NextResponse> {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.getAll('postId');
    const res = await unlikePost(postId);

    return NextResponse.json(res.data, { status: res.status });
}
