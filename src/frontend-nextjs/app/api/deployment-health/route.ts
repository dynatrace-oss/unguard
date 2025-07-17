import { NextResponse } from 'next/server';

import { fetchDeploymentHealth } from '@/services/api/DeploymentHealthService';

/**
 * @swagger
 * /ui/api/deployment-health:
 *   get:
 *     description: Get the health status of the deployment.
 */

export async function GET(): Promise<NextResponse> {
    const res = await fetchDeploymentHealth();

    return NextResponse.json(res.data, { status: res.status });
}
