import { AxiosResponse } from 'axios';

import { getPaymentServiceApi } from '@/axios';
import { PaymentData } from '@/services/PaymentService';

export async function fetchPaymentDataOfUser(userId: string): Promise<AxiosResponse<PaymentData>> {
    return await getPaymentServiceApi()
        .get(`/payment-info/${userId}`)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}

export async function updatePaymentDataForUser(
    paymentData: PaymentData,
    userId: string,
): Promise<AxiosResponse<PaymentData>> {
    return await getPaymentServiceApi()
        .post(
            `/payment-info/${userId}`,
            {
                cardHolderName: paymentData.cardHolderName,
                cardNumber: paymentData.cardNumber,
                expiryDate: paymentData.expiryDate,
                cvv: paymentData.cvv,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}
