import { NextResponse } from 'next/server';

import { PROFILE_SERVICE } from '@/axios';
import { fetchUserId } from '@/services/userIdforUsername';

async function fetchBio(userid: string): Promise<any> {
    const res = await PROFILE_SERVICE.get(`/user/${userid}/bio`);

    return res.data;
}

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }): Promise<NextResponse> {
    const { username } = await params;

    const res_userid = await fetchUserId(username);

    try {
        const res_bio = await fetchBio(res_userid.userId);

        return NextResponse.json(res_bio.bioText, { status: 200 });
    } catch (error: any) {
        if (error.response && error.response.status == 404) {
            //bio can be empty
            return NextResponse.json('', { status: 200 });
        } else {
            return NextResponse.json('Error retrieving bio', { status: 500 });
        }
    }
}

async function editBio(userid: string, body: { bioText: string; enableMarkdown: boolean }) {
    const res_user = await PROFILE_SERVICE.post(
        `/user/${userid}/bio`,
        {},
        {
            params: {
                bioText: body.bioText,
                enableMarkdown: Boolean(body.enableMarkdown),
            },
        },
    );

    if (res_user.status !== 200) {
        throw new Error('Failed to edit bio of user ');
    }

    return res_user.data;
}

export async function POST(req: Request, { params }: { params: Promise<{ username: string }> }): Promise<NextResponse> {
    const { username } = await params;
    const res_userid = await fetchUserId(username);

    const body = await req.json();
    const res_bio = await editBio(res_userid.userId, body);

    return NextResponse.json(res_bio, { status: res_bio.status });
}
