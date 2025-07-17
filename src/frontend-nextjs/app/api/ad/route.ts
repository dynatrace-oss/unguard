import { NextResponse } from 'next/server';

import { uploadAd } from '@/services/api/AdManagerService';

/**
 * @swagger
 * /ui/api/ad:
 *   get:
 *     description: Get the ad service endpoint.
 *   post:
 *     description: Upload an ad file.
 */

export async function GET(): Promise<NextResponse> {
    return NextResponse.json({ src: '/ad-service' }, { status: 200 });
}

export async function POST(req: Request): Promise<NextResponse> {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
        return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }

    const res = await uploadAd(file);

    return NextResponse.json(res.data, { status: res.status });
}
