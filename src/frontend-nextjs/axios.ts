import axios from 'axios';

function createAxiosInstance(baseURL: string, headers: Object) {
    return axios.create({
        baseURL: baseURL,
        headers: headers,
    });
}

export const MICROBLOG_API = createAxiosInstance('http://' + process.env.MICROBLOG_SERVICE_ADDRESS, {
    'Content-Type': 'application/json',
});

export const USER_AUTH_API = createAxiosInstance('http://' + process.env.USER_AUTH_SERVICE_ADDRESS, {
    'Content-Type': 'application/json',
});
