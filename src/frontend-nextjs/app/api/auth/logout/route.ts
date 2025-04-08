import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(): Promise<NextResponse> {
    const cookieStore = await cookies();

    cookieStore.delete('jwt');

    return NextResponse.json('Logout successful');
}
