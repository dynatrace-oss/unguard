import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';

export async function isLoggedIn(): Promise<NextResponse<boolean>> {
    const cookieStore = await cookies();

    if (cookieStore.has('jwt')) {
        const jwt = cookieStore.get('jwt')?.value;

        if (jwt) {
            try {
                jwtDecode(jwt);

                return NextResponse.json(true);
            } catch {
                return NextResponse.json(false);
            }
        }
    }

    return NextResponse.json(false);
}
