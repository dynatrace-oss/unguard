import { NextResponse } from 'next/server';

import { followUser, unfollowUser, isFollowing } from '@/services/api/FollowService';

export async function POST(req: Request, { params }: { params: Promise<{ username: string }> }): Promise<NextResponse> {
    const { username } = await params;
    const res = await followUser(username);

    return NextResponse.json(res.data, { status: res.status });
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ username: string }> },
): Promise<NextResponse> {
    const { username } = await params;
    const res = await unfollowUser(username);

    return NextResponse.json(res.data, { status: res.status });
}

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }): Promise<NextResponse> {
    const { username } = await params;

    const res = await isFollowing(username);

    return NextResponse.json(res.data, { status: res.status });
}
