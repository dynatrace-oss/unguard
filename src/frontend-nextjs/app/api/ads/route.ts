import { NextResponse } from 'next/server';

import { getAdList } from '@/services/api/AdManagerService';

export async function GET(): Promise<NextResponse> {
    const res = await getAdList();

    return NextResponse.json(res.data, { status: res.status });
}
