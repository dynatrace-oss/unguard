import * as cheerio from 'cheerio';

import { getMicroblogApi, getProxy } from '@/axios';
import { getJwtFromCookie } from '@/services/api/AuthService';
import { AxiosResponse } from 'axios';

async function fetchMetadataFromProxy(
    body: any,
    header: any,
): Promise<[metaTitle: string, metaImgSrc: string | undefined]> {
    const proxyResponse = await getProxy().get('/', {
        params: {
            header: header ?? body.language,
            url: body.url,
        },
    });

    // fetch some metadata out of the proxy response so it was not for nothing
    const $ = cheerio.load(proxyResponse.data);

    let metaImgSrc = $('meta[property="og:image"]').attr('content');

    if (!metaImgSrc) {
        // fall back to twitter meta image if no opengraph image is set
        metaImgSrc = $('meta[property="twitter:image"]').attr('content');
    }

    let metaTitle = $('meta[property="og:title"]').attr('content');

    if (!metaTitle) {
        // fall back to twitter meta image if no opengraph image is set
        metaTitle = $('meta[property="twitter:title"]').attr('content');
    }
    if (!metaTitle) {
        metaTitle = $('title').text();
    }

    return [metaTitle, metaImgSrc];
}

async function handleUrlPost(body: any, header: any, jwt?: string): Promise<AxiosResponse<{ postId: string }>> {
    const [metaTitle, metaImgSrc] = await fetchMetadataFromProxy(body, header);
    return await getMicroblogApi()
        .post(
            '/post',
            {
                content: `${metaTitle} ${body.url}`,
                imageUrl: metaImgSrc,
            },
            { headers: { Cookie: 'jwt=' + jwt } },
        )
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}

async function handleImagePost(body: any, jwt?: string): Promise<AxiosResponse<{ postId: string }>> {
    return await getProxy()
        .get('/image', {
            params: {
                url: body.imageUrl,
            },
        })
        .then(async (proxyResponse) => {
            try {
                return await getMicroblogApi().post(
                    '/post',
                    {
                        content: body.content,
                        imageUrl: proxyResponse.data,
                    },
                    { headers: { Cookie: 'jwt=' + jwt } },
                );
            } catch (error: any) {
                throw new Error('Failed to create image post: ' + error.message);
            }
        })
        .catch((error) => {
            return error.response;
        });
}

async function handleContentPost(body: any, jwt?: string): Promise<AxiosResponse<{ postId: string }>> {
    return await getMicroblogApi()
        .post(
            '/post',
            {
                content: body.content,
            },
            { headers: { Cookie: 'jwt=' + jwt } },
        )
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}

export async function createNewPost(
    body: any,
    header: any,
): Promise<
    AxiosResponse<{
        message?: any;
        postId: string;
    }>
> {
    const jwt = await getJwtFromCookie();

    if (body.url) {
        return handleUrlPost(body, header, jwt);
    } else if (body.imageUrl) {
        return handleImagePost(body, jwt);
    } else if (body.content) {
        return handleContentPost(body, jwt);
    } else {
        throw new Error('Missing data');
    }
}
