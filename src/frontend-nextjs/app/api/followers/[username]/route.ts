import { NextResponse } from 'next/server';

import { getFollowers } from '@/services/api/FollowService';

/**
 * @swagger
 * /ui/api/followers/{username}:
 *   get:
 *     description: Get a list of followers for a user by username.
 */

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }): Promise<NextResponse> {
    const { username } = await params;

    const res = await getFollowers(username);

    return NextResponse.json(res.data, { status: res.status });
}
