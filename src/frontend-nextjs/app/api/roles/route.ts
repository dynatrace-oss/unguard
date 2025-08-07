import { NextResponse } from 'next/server';

import { fetchRoles } from '@/services/api/UserService';

/**
 * @swagger
 * /ui/api/roles:
 *   get:
 *     description: Get all existing roles.
 */

export async function GET(): Promise<NextResponse> {
    const roles = await fetchRoles();

    return NextResponse.json(roles);
}
