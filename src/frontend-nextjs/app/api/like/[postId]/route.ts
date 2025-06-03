import { NextResponse } from 'next/server';

import { likePost } from '@/services/api/LikeService';
import { unlikePost } from '@/services/api/LikeService';

export type PostParams = {
    postId: string;
};

export async function POST(req: Request, { params }: { params: Promise<PostParams> }): Promise<NextResponse> {
    const { postId } = await params;
    const res = await likePost(postId);

    return NextResponse.json(res.data, { status: res.status });
}

export async function DELETE(req: Request, { params }: { params: Promise<PostParams> }): Promise<NextResponse> {
    const { postId } = await params;
    const res = await unlikePost(postId);

    return NextResponse.json(res.data, { status: res.status });
}
