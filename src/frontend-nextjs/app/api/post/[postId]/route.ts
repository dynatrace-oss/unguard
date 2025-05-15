import { NextResponse } from 'next/server';

import { fetchPostById } from '@/services/API/PostService';

export async function GET(req: Request, { params }: { params: Promise<{ postId: string }> }): Promise<NextResponse> {
    const { postId } = await params;
    const posts = await fetchPostById(postId);

    return NextResponse.json(posts);
}
