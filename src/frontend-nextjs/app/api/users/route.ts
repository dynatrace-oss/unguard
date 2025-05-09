import { NextResponse } from 'next/server';
import { AxiosResponse } from 'axios';

import { STATUS_SERVICE_API } from '@/axios';

async function fetchUsers(params: any): Promise<AxiosResponse> {
    const res = await STATUS_SERVICE_API.get('/users', {
        params: params,
    });

    if (res.status !== 200) {
        throw new Error('Failed to fetch Users from Status Service');
    }

    return res.data;
}

export async function POST(request: Request): Promise<NextResponse> {
    let params = await request.json();

    const users = await fetchUsers(params);

    return NextResponse.json(users, { status: 200 });
}
