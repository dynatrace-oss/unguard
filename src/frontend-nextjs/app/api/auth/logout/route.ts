import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * @swagger
 * /ui/api/auth/logout:
 *   post:
 *     description: Log out the user.
 */

export async function POST(): Promise<NextResponse> {
    const cookieStore = await cookies();

    cookieStore.delete('jwt');

    return NextResponse.json('Logout successful');
}
