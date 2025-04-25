import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

import { USER_AUTH_API } from '@/axios';

async function loginUser(user: { username: string; password: string }): Promise<any> {
    const res_user = await USER_AUTH_API.get('/user/login', {
        params: {
            username: user.username,
            password: user.password,
        },
    }).catch();

    if (res_user.status !== 200) {
        throw new Error('Failed to login user');
    }

    return res_user.data;
}

export async function POST(request: Request): Promise<NextResponse> {
    const body = await request.json();
    const response = await loginUser(body);

    const res = NextResponse.json(response, { status: response.status });

    res.cookies.set('jwt', response.jwt, { path: '/' });

    return res;
}

export async function GET(): Promise<NextResponse> {
    const cookieStore = await cookies();

    if (cookieStore.has('jwt')) {
        const jwt = cookieStore.get('jwt')?.value;

        if (jwt) {
            try {
                jwtDecode(jwt);

                return NextResponse.json(true);
            } catch (e) {
                return NextResponse.json(false);
            }
        }
    }

    return NextResponse.json(false);
}
