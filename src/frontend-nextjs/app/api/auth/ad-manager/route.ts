import { NextResponse } from 'next/server';

import { isAdManager } from '@/services/LocalUserService';

export async function GET(): Promise<NextResponse<boolean>> {
    const hasAdManagerRole = await isAdManager();

    return NextResponse.json(hasAdManagerRole);
}
