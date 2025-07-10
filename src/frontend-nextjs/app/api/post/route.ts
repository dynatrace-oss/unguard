import { NextResponse } from 'next/server';

import { createNewPost } from '@/services/api/CreatePostService';

export async function POST(request: Request): Promise<NextResponse> {
    const body = await request.json();
    const header = request.headers.get('header');

    const response = await createNewPost(body, header);

    if (response.status !== 200) {
        return NextResponse.json(
            { error: response.data, statusText: response.data.message },
            { status: response.status },
        );
    }

    return NextResponse.json(response.data.postId);
}
