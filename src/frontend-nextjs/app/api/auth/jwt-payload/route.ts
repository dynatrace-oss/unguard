import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from 'jwt-decode';

export interface CustomPayLoad extends JwtPayload {
    username: string;
    userid: string;
    roles: string[];
}

export async function GET(): Promise<NextResponse> {
    const cookieStore = await cookies();

    if (cookieStore.has('jwt')) {
        const jwt = cookieStore.get('jwt')?.value;

        if (jwt) {
            const username = jwtDecode(jwt) as CustomPayLoad['username'];

            return NextResponse.json(username);
        }
    }

    return NextResponse.json({ error: 'Could not get username from JWT' }, { status: 500 });
}
