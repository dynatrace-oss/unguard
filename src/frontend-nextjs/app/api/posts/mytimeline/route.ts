import { NextResponse } from 'next/server';
import { AxiosResponse } from 'axios';
import { cookies } from 'next/headers';

import { MICROBLOG_API } from '@/axios';

async function fetchPersonalTimeline(): Promise<AxiosResponse> {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    const res = await MICROBLOG_API.get(`/mytimeline`, { headers: { Cookie: 'jwt=' + jwt } });

    if (res.status !== 200) {
        throw new Error('Failed to fetch personal timeline from Microblog-Service');
    }

    return res.data;
}

export async function GET(): Promise<NextResponse> {
    const posts = await fetchPersonalTimeline();

    return NextResponse.json(posts, { status: 200 });
}
