import path from 'path';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { BASE_PATH } from '@/constants';

export type DeploymentDetails = {
    microservice: string;
    status: string;
    availableReplicas: number;
    isHealthy: boolean;
};

export type DeploymentHealthData = {
    availableDeployments: number;
    totalDeployments: number;
    deploymentDetails: DeploymentDetails[];
};

async function fetchDeploymentHealth(): Promise<any> {
    const res = await fetch(path.join(BASE_PATH, '/api/deployment-health'));

    if (!res.ok) {
        throw new Error('Failed to fetch deployment health');
    }

    return res.json();
}

function prepareDeploymentHealthData(rawData: any): DeploymentHealthData {
    const availableDeployments = rawData?.available ?? 0;
    const totalDeployments = rawData?.total ?? 0;
    const deployments = rawData?.microservices ?? {};

    const deploymentDetails: DeploymentDetails[] = Object.entries(deployments).map(([name, health]: any) => ({
        microservice: name,
        status: health.healthy ? 'Available' : 'Failing',
        availableReplicas: rawData?.[name]?.status?.availableReplicas ?? 0,
        isHealthy: health.healthy,
    }));

    return {
        availableDeployments: availableDeployments,
        totalDeployments: totalDeployments,
        deploymentDetails: deploymentDetails,
    };
}

export function useDeploymentHealth() {
    const { data, ...rest } = useQuery({
        queryKey: [QUERY_KEYS.deployment_health],
        queryFn: fetchDeploymentHealth,
        throwOnError: true,
    });

    return { deploymentHealthData: prepareDeploymentHealthData(data), ...rest };
}
