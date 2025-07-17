import { NextResponse } from 'next/server';

import { registerUser } from '@/services/api/AuthService';

/**
 * @swagger
 * /ui/api/auth/register:
 *   post:
 *     description: Register a new user with email and password.
 */

export async function POST(request: Request): Promise<NextResponse> {
    const body = await request.json();
    const response = await registerUser(body);

    return NextResponse.json(response.data, { status: response.status });
}
