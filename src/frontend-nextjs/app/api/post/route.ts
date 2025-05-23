import { NextResponse } from 'next/server';

import { createNewPost } from '@/services/api/CreatePostService';

export async function POST(request: Request): Promise<NextResponse> {
    const body = await request.json();
    const response = await createNewPost(body);

    return NextResponse.json(response.postId);
}
