import { NextResponse } from 'next/server';

import { USER_AUTH_API } from '@/axios';

async function loginUser(user: {}) {
    const res_user = await USER_AUTH_API.post('/user/login', user).catch();

    if (res_user.status !== 200) {
        throw new Error('Failed to login user');
    }

    return res_user.data;
}

export async function POST(request: Request) {
    const body = await request.json();
    const response = await loginUser(body);

    //TODO: store JWT token from response.data.jwt in NextResponse

    return new NextResponse(JSON.stringify(response), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
    });
}
