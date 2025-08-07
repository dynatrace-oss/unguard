import { NextResponse } from 'next/server';

/**
 * @swagger
 * /ui/api/healthz:
 *   get:
 *     description: Check if the Unguard frontend is running.
 */

export async function GET(): Promise<NextResponse> {
    return NextResponse.json('Unguard frontend is up and running!', { status: 200 });
}
