import { NextResponse } from 'next/server';

import { fetchDeploymentHealth } from '@/services/api/DeploymentHealthService';

export async function GET(): Promise<NextResponse> {
    const res = await fetchDeploymentHealth();

    return NextResponse.json(res.data, { status: res.status });
}
