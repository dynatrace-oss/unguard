import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    //TODO: get ad from ad-service
    const ad = {
        src: 'https://heroui.com/images/card-example-4.jpeg',
    };

    return new NextResponse(JSON.stringify(ad), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
