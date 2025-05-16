import { NextResponse } from 'next/server';

import { registerUser } from '@/services/API/AuthService';

export async function POST(request: Request): Promise<NextResponse> {
    const body = await request.json();
    const response = await registerUser(body);

    return NextResponse.json(response.data, { status: response.status });
}
