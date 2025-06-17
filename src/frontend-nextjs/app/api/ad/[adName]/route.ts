import { NextResponse } from 'next/server';

import { deleteAd } from '@/services/api/AdManagerService';

type AdParams = {
    adName: string;
};

export async function DELETE(req: Request, { params }: { params: Promise<AdParams> }): Promise<NextResponse> {
    const { adName } = await params;
    const res = await deleteAd(adName);

    return NextResponse.json(res.data, { status: res.status });
}
