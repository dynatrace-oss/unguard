import { NextResponse } from 'next/server';

import { fetchRoles } from '@/services/api/UserService';

export async function GET(): Promise<NextResponse> {
    const roles = await fetchRoles();

    return NextResponse.json(roles);
}
