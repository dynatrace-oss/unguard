import { NextResponse } from 'next/server';

import { fetchUserIdForUsername } from '@/services/api/AuthService';
import { editBio, fetchBio } from '@/services/api/UserService';

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }): Promise<NextResponse> {
    const { username } = await params;

    const res_userid = await fetchUserIdForUsername(username);

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

export async function POST(req: Request, { params }: { params: Promise<{ username: string }> }): Promise<NextResponse> {
    const { username } = await params;
    const res_userid = await fetchUserIdForUsername(username);

    const body = await req.json();
    const res_bio = await editBio(res_userid.userId, body);

    return NextResponse.json(res_bio);
}
