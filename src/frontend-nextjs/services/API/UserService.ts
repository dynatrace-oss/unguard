import { MEMBERSHIP_SERVICE_API, PROFILE_SERVICE, STATUS_SERVICE_API } from '@/axios';
import { UserProps } from '@/components/User';

export async function fetchAllUsers(params: any): Promise<UserProps[]> {
    const res = await STATUS_SERVICE_API.get('/users', {
        params: params,
    });

    if (res.status !== 200) {
        throw new Error('Failed to fetch Users from Status Service');
    }

    return res.data;
}

export async function fetchRoles(): Promise<string[]> {
    const res = await STATUS_SERVICE_API.get('/roles');

    if (res.status !== 200) {
        throw new Error('Failed to fetch roles from Status-Service');
    }

    return res.data;
}

export async function fetchMembership(userid: string): Promise<string> {
    const res = await MEMBERSHIP_SERVICE_API.get(`/${userid}`);

    return res.data;
}

export async function fetchBio(userid: string): Promise<{ bioText: string }> {
    const res = await PROFILE_SERVICE.get(`/user/${userid}/bio`);

    return res.data;
}

export async function editBio(userid: string, body: { bioText: string; enableMarkdown: boolean }): Promise<any> {
    const res = await PROFILE_SERVICE.post(
        `/user/${userid}/bio`,
        {},
        {
            params: {
                bioText: body.bioText,
                enableMarkdown: Boolean(body.enableMarkdown),
            },
        },
    );

    if (res.status !== 200) {
        throw new Error('Failed to edit bio of user ');
    }

    return res.data;
}
