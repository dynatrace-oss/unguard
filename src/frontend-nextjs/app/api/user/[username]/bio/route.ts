import { NextResponse } from 'next/server';

import { fetchUserIdForUsername } from '@/services/api/AuthService';
import { editBio, fetchBio } from '@/services/api/UserService';

/**
 * @swagger
 * /ui/api/user/{username}/bio:
 *   get:
 *     description: Get the bio for a user by username.
 *   post:
 *     description: Edit the bio for a user by username.
 */

export type UserParams = {
    username: string;
};

export async function GET(req: Request, { params }: { params: Promise<UserParams> }): Promise<NextResponse> {
    const { username } = await params;

    const userId = await fetchUserIdForUsername(username);

    try {
        const bioResponse = await fetchBio(userId);

        return NextResponse.json(bioResponse.bioText, { status: 200 });
    } catch (error: any) {
        if (error.response && error.response.status == 404) {
            //bio can be empty
            return NextResponse.json('', { status: 200 });
        } else {
            return NextResponse.json('Error retrieving bio', { status: 500 });
        }
    }
}

export async function POST(req: Request, { params }: { params: Promise<UserParams> }): Promise<NextResponse> {
    const { username } = await params;
    const userId = await fetchUserIdForUsername(username);

    const body = await req.json();
    const bioResponse = await editBio(userId, body);

    return NextResponse.json(bioResponse);
}
