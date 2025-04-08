import { NextResponse } from 'next/server';
import { AxiosResponse } from 'axios';

import { MICROBLOG_API } from '@/axios';

async function fetchPosts(): Promise<AxiosResponse> {
    const res = await MICROBLOG_API.get('/timeline');

    if (res.status !== 200) {
        throw new Error('Failed to fetch Posts from Microblog-Service');
    }

    return res.data;
}

export async function GET(): Promise<NextResponse> {
    const posts = await fetchPosts();

    return NextResponse.json(posts, { status: 200 });
}
