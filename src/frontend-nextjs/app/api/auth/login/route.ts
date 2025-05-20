import { NextResponse } from 'next/server';

import { loginUser } from '@/services/API/AuthService';
import { isLoggedIn } from '@/services/isLoggedIn';

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
