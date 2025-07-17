import { NextResponse } from 'next/server';

import { getAdList } from '@/services/api/AdManagerService';

/**
 * @swagger
 * /ui/api/ads:
 *   get:
 *     description: Get a list of all ads.
 */

export async function GET(): Promise<NextResponse> {
    const res = await getAdList();

    return NextResponse.json(res.data, { status: res.status });
}
