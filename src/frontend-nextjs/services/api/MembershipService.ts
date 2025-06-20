import querystring from 'querystring';

import { getMembershipServiceApi } from '@/axios';
import { MembershipData } from '@/services/MembershipService';

export async function updateMembershipForUser(membershipData: MembershipData, userId: string): Promise<any> {
    return await getMembershipServiceApi()
        .post(`/add/${userId}`, querystring.stringify(membershipData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}
