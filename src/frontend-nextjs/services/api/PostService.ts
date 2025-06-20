import { getMicroblogApi } from '@/axios';
import { PostProps } from '@/components/Timeline/Post';
import { getJwtFromCookie } from '@/services/api/AuthService';

export async function fetchAllPosts(): Promise<PostProps[]> {
    const res = await getMicroblogApi().get('/timeline');

    if (res.status !== 200) {
        throw new Error('Failed to fetch Posts from Microblog-Service');
    }

    return res.data;
}

export async function fetchPersonalTimeline(): Promise<PostProps[]> {
    const res = await getMicroblogApi().get(`/mytimeline`, {
        headers: { Cookie: 'jwt=' + (await getJwtFromCookie()) },
    });

    if (res.status !== 200) {
        throw new Error('Failed to fetch personal timeline from Microblog-Service');
    }

    return res.data;
}

export async function fetchPostsForUser(username: string): Promise<PostProps[]> {
    const res = await getMicroblogApi().get(`/users/${username}/posts`, {
        headers: { Cookie: 'jwt=' + (await getJwtFromCookie()) },
    });

    if (res.status !== 200) {
        throw new Error('Failed to fetch Posts from Microblog-Service');
    }

    return res.data;
}

export async function fetchPostById(postId: string): Promise<PostProps> {
    const res = await getMicroblogApi().get(`/post/${postId}`, {
        headers: { Cookie: 'jwt=' + (await getJwtFromCookie()) },
    });

    if (res.status !== 200) {
        throw new Error(`Failed to fetch Post with ID ${postId} from Microblog-Service`);
    }

    return res.data;
}
