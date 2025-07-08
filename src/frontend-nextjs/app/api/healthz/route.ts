import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
    return NextResponse.json('Unguard frontend is up and running!', { status: 200 });
}
