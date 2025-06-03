import { cookies } from 'next/headers';
import { jwtDecode, JwtPayload } from 'jwt-decode';

export interface CustomPayLoad extends JwtPayload {
    username: string;
    userid: string;
    roles: string[];
}

export async function isOwnProfile(username: string): Promise<boolean> {
    const cookieStore = await cookies();

    if (cookieStore.has('jwt')) {
        const jwt = cookieStore.get('jwt')?.value;

        if (jwt) {
            const decodedPayload = jwtDecode<CustomPayLoad>(jwt);

            if (decodedPayload.username == username) {
                return true;
            }
        }
    }

    return false;
}

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

export async function getUsernameFromJwt(): Promise<string | undefined> {
    const cookieStore = await cookies();

    if (cookieStore.has('jwt')) {
        const jwt = cookieStore.get('jwt')?.value;

        if (jwt) {
            try {
                const decodedPayload = jwtDecode<CustomPayLoad>(jwt);

                return decodedPayload.username;
            } catch {
                return undefined;
            }
        }
    }

    return undefined;
}
