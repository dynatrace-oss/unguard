import { NextResponse } from 'next/server';

import { fetchLikes } from '@/services/api/LikeService';
import { PostParams } from '@/app/api/like/[postId]/route';

export async function GET(req: Request, { params }: { params: Promise<PostParams> }): Promise<NextResponse> {
    const { postId } = await params;
    const res = await fetchLikes(postId);

    return NextResponse.json(res.data);
}
