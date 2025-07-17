import { NextResponse } from 'next/server';

import { fetchAllPosts } from '@/services/api/PostService';

/**
 * @swagger
 * /ui/api/posts:
 *   get:
 *     description: Get all posts.
 */

export async function GET(): Promise<NextResponse> {
    const posts = await fetchAllPosts();

    return NextResponse.json(posts);
}
