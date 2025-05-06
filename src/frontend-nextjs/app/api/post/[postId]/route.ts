import { AxiosResponse } from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { MICROBLOG_API } from '@/axios';

async function fetchSinglePost(postId: string): Promise<AxiosResponse> {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    const res = await MICROBLOG_API.get(`/post/${postId}`, { headers: { Cookie: 'jwt=' + jwt } });

    if (res.status !== 200) {
        throw new Error(`Failed to fetch Post with ID ${postId} from Microblog-Service`);
    }

    return res.data;
}

export async function GET(req: Request, { params }: { params: Promise<{ postId: string }> }): Promise<NextResponse> {
    const { postId } = await params;
    const posts = await fetchSinglePost(postId);

    return NextResponse.json(posts, { status: 200 });
}
