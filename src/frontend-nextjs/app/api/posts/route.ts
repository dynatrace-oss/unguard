import { NextResponse } from 'next/server';

import { PostProps } from '@/components/PostComponent';

export async function GET(request: Request) {
    //TODO: get post data from microblog-service
    const testPostObjects: PostProps[] = [
        {
            name: 'Name',
            timestamp: 'timestamp',
            text: 'text',
            likes: 0,
            avatar_url: 'https://heroui.com/avatars/avatar-1.png',
        },
        {
            name: 'Name2',
            timestamp: 'timestamp2',
            text: 'text2',
            likes: 1,
            avatar_url: 'https://heroui.com/avatars/avatar-1.png',
        },
        {
            name: 'Name3',
            timestamp: 'timestamp3',
            text: 'text3',
            likes: 2,
            avatar_url: 'https://heroui.com/avatars/avatar-1.png',
        },
        {
            name: 'Name4',

            timestamp: 'timestamp4',
            text: 'text4',
            likes: 3,
            avatar_url: 'https://heroui.com/avatars/avatar-1.png',
        },
    ];

    return new NextResponse(JSON.stringify(testPostObjects), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
