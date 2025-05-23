import { NextResponse } from 'next/server';

import { fetchAllPosts } from '@/services/api/PostService';

export async function GET(): Promise<NextResponse> {
    const posts = await fetchAllPosts();

    return NextResponse.json(posts);
}
