import { NextResponse } from 'next/server';
import { AxiosResponse } from 'axios';

import { USER_AUTH_API } from '@/axios';

/*
This file is just for testing purposes and should be removed later.
The actual functionality for registering a new user is implemented in the API route /auth/register.
 */
async function postUser(user: {}) {
async function postUser(user: {}): Promise<AxiosResponse> {
    //insert a user for testing, this should be removed later
    const res_user = await USER_AUTH_API.get('/user/register', {
        params: {
        username: 'user1',
        password: 'password123'}
    }).catch();

    if (res_user.status !== 200) {
        throw new Error('Failed to register new user');
    }

    return res_user.data;
}

export async function POST(request: Request): Promise<NextResponse> {
    const response = await postUser(JSON.stringify(request.body));

    return NextResponse.json(response, { status: 200 });
}
