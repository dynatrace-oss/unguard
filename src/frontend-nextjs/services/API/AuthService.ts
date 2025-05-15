import { USER_AUTH_API } from '@/axios';

export async function registerUser(user: { username: string; password: string }): Promise<any> {
    return await USER_AUTH_API.get('/user/register', {
        params: {
            username: user.username,
            password: user.password,
        },
    })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}

export async function loginUser(user: { username: string; password: string }): Promise<any> {
    return await USER_AUTH_API.get('/user/login', {
        params: {
            username: user.username,
            password: user.password,
        },
    })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}
