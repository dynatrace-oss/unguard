import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
    return NextResponse.json({ src: '/ad-service' }, { status: 200 });
}
