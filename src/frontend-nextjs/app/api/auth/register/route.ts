import { NextResponse } from 'next/server';

import { USER_AUTH_API } from '@/axios';

async function registerUser(user: { username: string; password: string }) {
    const res_user = await USER_AUTH_API.get('/user/register', {
        params: {
            username: user.username,
            password: user.password}
    }).catch();

    if (res_user.status !== 200) {
        throw new Error('Failed to register new user');
    }

    return res_user.data;
}

export async function POST(request: Request) {
    const body = await request.json();
    const response = await registerUser(body);

    return NextResponse.json(response, { status: response.status });
}
