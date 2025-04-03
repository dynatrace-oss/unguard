import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    return new NextResponse(
        JSON.stringify({
            src: '/ad-service',
        }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        },
    );
}
