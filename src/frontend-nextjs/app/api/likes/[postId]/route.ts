import { NextResponse } from 'next/server';

import { fetchLikes } from '@/services/api/LikeService';

export async function GET(req: Request, { params }: { params: Promise<{ postId: string }> }): Promise<NextResponse> {
    const { postId } = await params;
    const res = await fetchLikes(postId);

    return NextResponse.json(res.data);
}
