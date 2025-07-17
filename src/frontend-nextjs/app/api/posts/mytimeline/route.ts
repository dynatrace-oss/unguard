import { NextResponse } from 'next/server';

import { fetchPersonalTimeline } from '@/services/api/PostService';

/**
 * @swagger
 * /ui/api/posts/mytimeline:
 *   get:
 *     description: Get the personal timeline for the authenticated user.
 */

export async function GET(): Promise<NextResponse> {
    const posts = await fetchPersonalTimeline();

    return NextResponse.json(posts);
}
