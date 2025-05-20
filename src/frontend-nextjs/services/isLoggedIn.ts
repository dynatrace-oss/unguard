import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

export async function isLoggedIn(): Promise<boolean> {
    const cookieStore = await cookies();

    if (cookieStore.has('jwt')) {
        const jwt = cookieStore.get('jwt')?.value;

        if (jwt) {
            try {
                jwtDecode(jwt);

                return true;
            } catch {
                return false;
            }
        }
    }

    return false;
}
