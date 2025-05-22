import { NextResponse } from 'next/server';

import { fetchUserIdForUsername } from '@/services/api/AuthService';
import { fetchMembership } from '@/services/api/UserService';

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }): Promise<NextResponse> {
    const { username } = await params;

    const res_userid = await fetchUserIdForUsername(username);

    const res_membership = await fetchMembership(res_userid.userId);

    return NextResponse.json(res_membership);
}
