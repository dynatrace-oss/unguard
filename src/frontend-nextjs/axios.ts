import path from 'path';

import axios from 'axios';

function createAxiosInstance(baseURL: string, headers: Object) {
    return axios.create({
        baseURL: baseURL,
        headers: headers,
    });
}

function requireEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Environment variable ${name} is required but not defined`);
    }

    return value;
}

let microblogApiInstance: ReturnType<typeof createAxiosInstance> | undefined;
let userAuthApiInstance: ReturnType<typeof createAxiosInstance> | undefined;
let profileServiceInstance: ReturnType<typeof createAxiosInstance> | undefined;
let membershipServiceApiInstance: ReturnType<typeof createAxiosInstance> | undefined;
let proxyInstance: ReturnType<typeof createAxiosInstance> | undefined;
let statusServiceApiInstance: ReturnType<typeof createAxiosInstance> | undefined;
let likeServiceApiInstance: ReturnType<typeof createAxiosInstance> | undefined;
let paymentServiceApiInstance: ReturnType<typeof createAxiosInstance> | undefined;
let adServiceApiInstance: ReturnType<typeof createAxiosInstance> | undefined;

export function getMicroblogApi() {
    if (!microblogApiInstance) {
        microblogApiInstance = createAxiosInstance(path.join('http://', requireEnv('MICROBLOG_SERVICE_ADDRESS')), {
            'Content-Type': 'application/json',
        });
    }

    return microblogApiInstance;
}

export function getUserAuthApi() {
    if (!userAuthApiInstance) {
        userAuthApiInstance = createAxiosInstance(path.join('http://', requireEnv('USER_AUTH_SERVICE_ADDRESS')), {
            'Content-Type': 'application/json',
        });
    }

    return userAuthApiInstance;
}

export function getProfileService() {
    if (!profileServiceInstance) {
        profileServiceInstance = createAxiosInstance(path.join('http://', requireEnv('PROFILE_SERVICE_ADDRESS')), {
            'Content-Type': 'application/json',
        });
    }

    return profileServiceInstance;
}

export function getMembershipServiceApi() {
    if (!membershipServiceApiInstance) {
        membershipServiceApiInstance = createAxiosInstance(
            path.join('http://', requireEnv('MEMBERSHIP_SERVICE_ADDRESS'), requireEnv('MEMBERSHIP_SERVICE_BASE_PATH')),
            { 'Content-Type': 'application/json' },
        );
    }

    return membershipServiceApiInstance;
}

export function getProxy() {
    if (!proxyInstance) {
        proxyInstance = createAxiosInstance('http://' + requireEnv('PROXY_SERVICE_ADDRESS'), {
            'Content-Type': 'application/json',
        });
    }

    return proxyInstance;
}

export function getStatusServiceApi() {
    if (!statusServiceApiInstance) {
        statusServiceApiInstance = createAxiosInstance(
            path.join('http://', requireEnv('STATUS_SERVICE_ADDRESS'), requireEnv('STATUS_SERVICE_BASE_PATH')),
            { 'Content-Type': 'application/json' },
        );
    }

    return statusServiceApiInstance;
}

export function getLikeServiceApi() {
    if (!likeServiceApiInstance) {
        likeServiceApiInstance = createAxiosInstance(path.join('http://', requireEnv('LIKE_SERVICE_ADDRESS')), {
            'Content-Type': 'application/json',
        });
    }

    return likeServiceApiInstance;
}

export function getPaymentServiceApi() {
    if (!paymentServiceApiInstance) {
        paymentServiceApiInstance = createAxiosInstance(path.join('http://', requireEnv('PAYMENT_SERVICE_ADDRESS')), {
            'Content-Type': 'application/json',
        });
    }

    return paymentServiceApiInstance;
}

export function getAdServiceApi() {
    if (!adServiceApiInstance) {
        adServiceApiInstance = createAxiosInstance(
            path.join('http://', requireEnv('AD_SERVICE_ADDRESS'), requireEnv('AD_SERVICE_BASE_PATH')),
            {},
        );
    }

    return adServiceApiInstance;
}
