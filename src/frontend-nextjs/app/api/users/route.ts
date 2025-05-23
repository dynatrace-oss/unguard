import { NextResponse } from 'next/server';

import { fetchAllUsers } from '@/services/api/UserService';

export async function POST(request: Request): Promise<NextResponse> {
    let params = await request.json();

    const users = await fetchAllUsers(params);

    return NextResponse.json(users);
}
