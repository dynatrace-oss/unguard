import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

import { CustomPayLoad } from '@/app/api/auth/jwt-payload/route';

export async function isOwnProfile(username: string) {
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
