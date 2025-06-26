import { AxiosResponse } from 'axios';
import { getStatusServiceApi } from '@/axios';

export async function fetchDeploymentHealth(): Promise<any> {
    const statusServiceApi = getStatusServiceApi();

    try {
        const [deploymentDetails, deploymentHealth] = await Promise.all([
            statusServiceApi.get('deployments'),
            statusServiceApi.get('deployments/health'),
        ]);

        return {
            ...deploymentHealth,
            data: {
                ...deploymentDetails.data,
                ...deploymentHealth.data,
            },
        };
    } catch (error: any) {
        return error.response;
    }
}
