import path from 'path';

import { BASE_PATH } from '@/constants';

export interface PaymentData {
    cardHolderName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

export async function updatePaymentData(data: PaymentData, username: string): Promise<Response> {
    return await fetch(path.join(BASE_PATH, `/api/user/${username}/payment`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}
