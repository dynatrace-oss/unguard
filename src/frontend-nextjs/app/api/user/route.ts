import { NextResponse } from 'next/server';

import { USER_AUTH_API } from '@/axios';

async function postUser(user: {}) {
    //insert a user for testing, this should be removed later
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
