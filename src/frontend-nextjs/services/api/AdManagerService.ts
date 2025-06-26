import { AxiosResponse } from 'axios';

import { getAdServiceApi } from '@/axios';
import { getJwtFromCookie } from '@/services/api/AuthService';

export type AdList = {
    name: string;
    creationTime: string;
}[];

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

export async function getAdList(): Promise<any> {
    const jwt = await getJwtFromCookie();

    return await getAdServiceApi()
        .get(`/ads`, {
            headers: { Cookie: 'jwt=' + jwt },
        })
        .then((response: AxiosResponse<AdList>) => {
            response.data.forEach((ad) => {
                ad.creationTime = new Date(ad.creationTime).toLocaleString('de-at');
            });

            return response;
        })
        .catch((error) => {
            return error.response;
        });
}

export async function deleteAd(adName: string): Promise<any> {
    const jwt = await getJwtFromCookie();

    const formData = new FormData();

    formData.append('fileName', adName);

    return await getAdServiceApi()
        .post(`/ads/delete`, formData, {
            headers: { Cookie: 'jwt=' + jwt },
        })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}
