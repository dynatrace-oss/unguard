import { NextResponse } from 'next/server';

import { fetchUserIdForUsername } from '@/services/userIdforUsername';
import { fetchMembership } from '@/services/API/UserService';

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }): Promise<NextResponse> {
    const { username } = await params;

    const res_userid = await fetchUserIdForUsername(username);

    const res_membership = await fetchMembership(res_userid.userId);

    return NextResponse.json(res_membership);
}
