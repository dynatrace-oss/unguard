import { NextResponse } from 'next/server';

import { fetchPersonalTimeline } from '@/services/API/PostService';

export async function GET(): Promise<NextResponse> {
    const posts = await fetchPersonalTimeline();

    return NextResponse.json(posts);
}
