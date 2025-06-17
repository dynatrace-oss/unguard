import { NextResponse } from 'next/server';

import { getAdsList } from '@/services/api/AdManagerService';

export async function GET(): Promise<NextResponse> {
    const res = await getAdsList();

    return NextResponse.json(res.data, { status: res.status });
}
