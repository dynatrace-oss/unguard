import { NextResponse } from 'next/server';

import { USER_AUTH_API } from '@/axios';

/*
This file is just for testing purposes and should be removed later.
The actual functionality for registering a new user is implemented in the API route /auth/register.
 */
async function postUser(user: {}) {
    const res_user = await USER_AUTH_API.post('/user/register', {
        username: 'user1',
        password: 'password123',
    }).catch();

    if (res_user.status !== 200) {
        throw new Error('Failed to register new user');
    }

    return res_user.data;
}

export async function POST(request: Request) {
    const response = await postUser(JSON.stringify(request.body));

    return new NextResponse(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
