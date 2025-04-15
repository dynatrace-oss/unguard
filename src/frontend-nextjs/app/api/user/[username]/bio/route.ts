import { NextResponse } from 'next/server';

import { PROFILE_SERVICE } from '@/axios';
import { fetchUserId } from '@/helpers/userIdforUsername';

async function fetchBio(userid: string): Promise<any> {
    const res = await PROFILE_SERVICE.get(`/user/${userid}/bio`);

    return res.data;
}

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }): Promise<NextResponse> {
    const { username } = await params;

    const res_userid = await fetchUserId(username);

    try {
        const res_bio = await fetchBio(res_userid.userId);

        return NextResponse.json(res_bio, { status: 200 });
    } catch (error: any) {
        if (error.response && error.response.status == 404) {
            return NextResponse.json('', { status: 200 });
        } else {
            return NextResponse.json('Error retrieving bio', { status: 500 });
        }
    }
}
