import { NextResponse } from 'next/server';

import { createNewPost } from '@/services/api/CreatePostService';

/**
 * @swagger
 * /ui/api/post:
 *   post:
 *     description: Create a new post.
 */

export async function POST(request: Request): Promise<NextResponse> {
    const body = await request.json();
    let header = request.headers.get('header');
    if (header) {
        header = Buffer.from(header, 'latin1').toString('utf-8');
    }

    const response = await createNewPost(body, header);

    if (response.status !== 200) {
        return NextResponse.json(
            { error: response.data, statusText: response.data.message },
            { status: response.status },
        );
    }

    return NextResponse.json(response.data.postId);
}
