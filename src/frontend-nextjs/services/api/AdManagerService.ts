import { getAdServiceApi } from '@/axios';
import { getJwtFromCookie } from '@/services/api/AuthService';

export async function uploadAd(ad: FormDataEntryValue): Promise<any> {
    const jwt = await getJwtFromCookie();
    const formData = new FormData();

    formData.append('file', ad);

    return await getAdServiceApi()
        .post(`/ads/upload`, formData, {
            headers: { Cookie: 'jwt=' + jwt },
        })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}
