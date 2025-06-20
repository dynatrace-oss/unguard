import { getMembershipServiceApi, getProfileService, getStatusServiceApi } from '@/axios';
import { UserProps } from '@/components/UsersView/User';

export async function fetchAllUsers(params: any): Promise<UserProps[]> {
    const res = await getStatusServiceApi().get('/users', {
        params: params,
    });

    if (res.status !== 200) {
        throw new Error('Failed to fetch Users from Status Service');
    }

    return res.data;
}

export async function fetchRoles(): Promise<string[]> {
    const res = await getStatusServiceApi().get('/roles');

    if (res.status !== 200) {
        throw new Error('Failed to fetch roles from Status-Service');
    }

    return res.data;
}

export async function fetchMembership(userid: string): Promise<string> {
    const res = await getMembershipServiceApi().get(`/${userid}`);

    return res.data;
}

export async function fetchBio(userid: string): Promise<{ bioText: string }> {
    const res = await getProfileService().get(`/user/${userid}/bio`);

    return res.data;
}

export async function editBio(userid: string, body: { bioText: string; enableMarkdown: boolean }): Promise<any> {
    const res = await getProfileService().post(
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
