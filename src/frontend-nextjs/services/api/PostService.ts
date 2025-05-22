import { cookies } from 'next/headers';

import { MICROBLOG_API } from '@/axios';
import { PostProps } from '@/components/Post';

export async function fetchAllPosts(): Promise<PostProps[]> {
    const res = await MICROBLOG_API.get('/timeline');

    if (res.status !== 200) {
        throw new Error('Failed to fetch Posts from Microblog-Service');
    }

    return res.data;
}

export async function fetchPersonalTimeline(): Promise<PostProps[]> {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    const res = await MICROBLOG_API.get(`/mytimeline`, { headers: { Cookie: 'jwt=' + jwt } });

    if (res.status !== 200) {
        throw new Error('Failed to fetch personal timeline from Microblog-Service');
    }

    return res.data;
}

export async function fetchPostsForUser(username: string): Promise<PostProps[]> {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    const res = await MICROBLOG_API.get(`/users/${username}/posts`, { headers: { Cookie: 'jwt=' + jwt } });

    if (res.status !== 200) {
        throw new Error('Failed to fetch Posts from Microblog-Service');
    }

    return res.data;
}

export async function fetchPostById(postId: string): Promise<PostProps> {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    const res = await MICROBLOG_API.get(`/post/${postId}`, { headers: { Cookie: 'jwt=' + jwt } });

    if (res.status !== 200) {
        throw new Error(`Failed to fetch Post with ID ${postId} from Microblog-Service`);
    }

    return res.data;
}
