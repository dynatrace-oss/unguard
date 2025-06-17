import path from 'path';

import { BASE_PATH } from '@/constants';

export interface PaymentData {
    cardHolderName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

export async function updatePaymentData(data: PaymentData, username: string): Promise<Response> {
    const res = await fetch(path.join(BASE_PATH, `/api/user/${username}/payment`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const data = await res.json();

        throw new Error(data.message?.toString() || 'Error updating payment data');
    }

    return res;
}
