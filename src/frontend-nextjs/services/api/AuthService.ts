import { getUserAuthApi } from '@/axios';

type UserCredentials = {
    username: string;
    password: string;
};

export async function registerUser(user: UserCredentials): Promise<any> {
    return await getUserAuthApi()
        .get('/user/register', {
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

export async function loginUser(user: UserCredentials): Promise<any> {
    return await getUserAuthApi()
        .get('/user/login', {
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

export async function fetchUserIdForUsername(username: string): Promise<string> {
    const res = await getUserAuthApi().post('/user/useridForName', { username: username });

    if (res.status !== 200) {
        throw new Error('Failed to resolve UserID from Username');
    }

    return res.data.userId;
}
