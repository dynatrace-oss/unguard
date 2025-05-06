import { NextResponse } from 'next/server';

import { MEMBERSHIP_SERVICE_API } from '@/axios';
import { fetchUserIdForUsername } from '@/services/userIdforUsername';

async function fetchMembership(userid: string): Promise<any> {
    const res = await MEMBERSHIP_SERVICE_API.get(`/${userid}`);

    return res.data;
}

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }): Promise<NextResponse> {
    const { username } = await params;

    const res_userid = await fetchUserIdForUsername(username);

    const res_membership = await fetchMembership(res_userid.userId);

    return NextResponse.json(res_membership);
}
