import { NextResponse } from 'next/server';

import { MICROBLOG_API } from '@/axios';

async function fetchPosts() {
    const res = await MICROBLOG_API.get('/timeline');

    if (res.status !== 200) {
        throw new Error('Failed to fetch Posts from Microblog-Service');
    }

    return res.data;
}

export async function GET(request: Request) {
    const posts = await fetchPosts();

    return new NextResponse(JSON.stringify(posts), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
