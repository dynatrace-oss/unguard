import path from 'path';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { BASE_PATH } from '@/constants';
import { PaymentData } from '@/services/PaymentService';

async function fetchPaymentInfo(username: string): Promise<PaymentData> {
    const res = await fetch(path.join(BASE_PATH, `/api/user/${username}/payment`));

    if (!res.ok) {
        if (res.status === 404) {
            return {
                cardHolderName: '',
                cardNumber: '',
                cvv: '',
                expiryDate: '',
            };
        } else {
            throw new Error('Failed to fetch payment information for user ' + username);
        }
    }

    return res.json();
}

export function usePaymentInfo(username: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.payment_data, username],
        queryFn: () => fetchPaymentInfo(username),
    });
}
