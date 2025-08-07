import { NextResponse } from 'next/server';

import { fetchUserIdForUsername } from '@/services/api/AuthService';
import { fetchMembership } from '@/services/api/UserService';
import { UserParams } from '@/app/api/user/[username]/bio/route';
import { updateMembershipForUser } from '@/services/api/MembershipService';

/**
 * @swagger
 * /ui/api/user/{username}/membership:
 *   get:
 *     description: Get the membership for a user by username.
 *   post:
 *     description: Update the membership for a user by username.
 */

export async function GET(req: Request, { params }: { params: Promise<UserParams> }): Promise<NextResponse> {
    const { username } = await params;

    const userId = await fetchUserIdForUsername(username);

    const membershipResponse = await fetchMembership(userId);

    return NextResponse.json(membershipResponse);
}

export async function POST(req: Request, { params }: { params: Promise<UserParams> }): Promise<NextResponse> {
    const { username } = await params;
    const body = await req.json();

    const userId = await fetchUserIdForUsername(username);
    const membershipResponse = await updateMembershipForUser(body, userId);

    return NextResponse.json(membershipResponse.data, { status: membershipResponse.status });
}
