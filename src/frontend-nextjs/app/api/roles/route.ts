import { NextResponse } from 'next/server';

import { fetchRoles } from '@/services/API/UserService';

export async function GET(): Promise<NextResponse> {
    const roles = await fetchRoles();

    return NextResponse.json(roles);
}
