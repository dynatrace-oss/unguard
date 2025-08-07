import { NextResponse } from 'next/server';

import { loginUser } from '@/services/api/AuthService';
import { isLoggedIn } from '@/services/LocalUserService';

/**
 * @swagger
 * /ui/api/auth/login:
 *   post:
 *     description: Log in a user with email and password.
 *   get:
 *     description: Check if the user is logged in.
 */

export async function POST(request: Request): Promise<NextResponse> {
    const body = await request.json();
    const response = await loginUser(body);

    const res = NextResponse.json(response.data, { status: response.status });

    res.cookies.set('jwt', response.data?.jwt, { path: '/' });

    return res;
}

export async function GET(): Promise<NextResponse<boolean>> {
    const loginStatus = await isLoggedIn();

    return NextResponse.json(loginStatus);
}
