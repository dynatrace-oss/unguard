import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';

export async function isLoggedIn() {
    const cookieStore = await cookies();

    if (cookieStore.has('jwt')) {
        const jwt = cookieStore.get('jwt')?.value;

        if (jwt) {
            try {
                jwtDecode(jwt);

                return NextResponse.json(true);
            } catch (e) {
                return NextResponse.json(false);
            }
        }
    }
}
