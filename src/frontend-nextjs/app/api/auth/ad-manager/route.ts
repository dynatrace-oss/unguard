import { NextResponse } from 'next/server';

import { isAdManager } from '@/services/LocalUserService';

/**
 * @swagger
 * /ui/api/auth/ad-manager:
 *   get:
 *     description: Check if the user has ad manager role.
 */

export async function GET(): Promise<NextResponse<boolean>> {
    const hasAdManagerRole = await isAdManager();

    return NextResponse.json(hasAdManagerRole);
}
