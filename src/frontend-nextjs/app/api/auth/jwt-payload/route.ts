import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

import { type CustomPayLoad } from '@/services/LocalUserService';

/**
 * @swagger
 * /ui/api/auth/jwt-payload:
 *   get:
 *     description: Get the JWT payload of the current user.
 */

export async function GET(): Promise<NextResponse> {
    const cookieStore = await cookies();

    if (cookieStore.has('jwt')) {
        const jwt = cookieStore.get('jwt')?.value;

        if (jwt) {
            const decodedPayload = jwtDecode<CustomPayLoad>(jwt);

            return NextResponse.json(decodedPayload);
        }
    }

    return NextResponse.json({ error: 'Could not get JWT Payload' });
}
