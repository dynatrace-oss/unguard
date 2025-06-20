import { cookies } from 'next/headers';
import { jwtDecode, JwtPayload } from 'jwt-decode';

import { ROLE } from '@/enums/roles';

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
    const username = await getUsernameFromJwt();

    return username !== undefined;
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

export async function isAdManager(): Promise<boolean> {
    const cookieStore = await cookies();

    if (cookieStore.has('jwt')) {
        const jwt = cookieStore.get('jwt')?.value;

        if (jwt) {
            try {
                const decodedPayload = jwtDecode<CustomPayLoad>(jwt);

                return decodedPayload.roles.includes(ROLE.AD_MANAGER);
            } catch {
                return false;
            }
        }
    }

    return false;
}
