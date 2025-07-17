import { NextResponse } from 'next/server';

import { deleteAd } from '@/services/api/AdManagerService';

type AdParams = {
    adName: string;
};

/**
 * @swagger
 * /ui/api/ad/{adName}:
 *   delete:
 *     description: Delete an Ad by its name.
 */

export async function DELETE(req: Request, { params }: { params: Promise<AdParams> }): Promise<NextResponse> {
    const { adName } = await params;
    const res = await deleteAd(adName);

    return NextResponse.json(res.data, { status: res.status });
}
