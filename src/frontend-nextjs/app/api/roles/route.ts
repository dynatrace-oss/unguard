import { NextResponse } from 'next/server';
import { AxiosResponse } from 'axios';

import { STATUS_SERVICE_API } from '@/axios';

async function fetchRoles(): Promise<AxiosResponse> {
    const res = await STATUS_SERVICE_API.get('/roles');

    if (res.status !== 200) {
        throw new Error('Failed to fetch roles from Status-Service');
    }

    return res.data;
}

export async function GET(): Promise<NextResponse> {
    const roles = await fetchRoles();

    return NextResponse.json(roles, { status: 200 });
}
