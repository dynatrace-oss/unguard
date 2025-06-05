import path from 'path';

import { BASE_PATH } from '@/constants';

export type MembershipData = {
    membership: string;
};

export async function updateMembership(data: MembershipData, username: string): Promise<Response> {
    return await fetch(path.join(BASE_PATH, `/api/user/${username}/membership`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}
