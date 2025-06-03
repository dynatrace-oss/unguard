import { NextResponse } from 'next/server';

import { fetchUserIdForUsername } from '@/services/api/AuthService';
import { fetchMembership } from '@/services/api/UserService';
import { UserParams } from '@/app/api/user/[username]/bio/route';

export async function GET(req: Request, { params }: { params: Promise<UserParams> }): Promise<NextResponse> {
    const { username } = await params;

    const userId = await fetchUserIdForUsername(username);

    const res_membership = await fetchMembership(userId);

    return NextResponse.json(res_membership);
}
