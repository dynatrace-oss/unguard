import path from 'path';

import { BASE_PATH } from '@/constants';

export async function deleteAd(adName: string): Promise<Response> {
    return await fetch(path.join(BASE_PATH, `/api/ad/${adName}`), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
}
