import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as cheerio from 'cheerio';

import { MICROBLOG_API, PROXY } from '@/axios';

async function fetchMetadataFromProxy(body: any) {
    const res_proxy = await PROXY.get('/', {
        params: {
            header: body.language,
            url: body.url,
        },
    });

    // fetch some metadata out of the proxy response so it was not for nothing
    const $ = cheerio.load(res_proxy.data);

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

async function handleUrlPost(body: any, jwt?: string) {
    const [metaTitle, metaImgSrc] = await fetchMetadataFromProxy(body);
    const res = await MICROBLOG_API.post(
        '/post',
        {
            content: `${metaTitle} ${body.url}`,
            imageUrl: metaImgSrc,
        },
        { headers: { Cookie: 'jwt=' + jwt } },
    );

    if (res.status !== 200) {
        throw new Error('Failed to create new post');
    }

    return res.data;
}

async function handleImagePost(body: any, jwt?: string): Promise<any> {
    const res_proxy = await PROXY.get('/image', {
        params: {
            url: body.imageUrl,
        },
    });
    const res = await MICROBLOG_API.post(
        '/post',
        {
            content: body.content,
            imageUrl: res_proxy.data,
        },
        { headers: { Cookie: 'jwt=' + jwt } },
    );

    return res.data;
}

async function handleContentPost(body: any, jwt?: string): Promise<any> {
    const res = await MICROBLOG_API.post(
        '/post',
        {
            content: body.content,
        },
        { headers: { Cookie: 'jwt=' + jwt } },
    );

    return res.data;
}

async function createNewPost(body: any): Promise<any> {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    if (body.url) {
        return handleUrlPost(body, jwt);
    } else if (body.imageUrl) {
        return handleImagePost(body, jwt);
    } else if (body.content) {
        return handleContentPost(body, jwt);
    } else {
        return new NextResponse('Missing data', { status: 400 });
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    const response = await createNewPost(body);

    return NextResponse.json(response.postId, { status: response.status });
}
