import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToast } from '@heroui/react';

import { PaymentData, updatePaymentData } from '@/services/PaymentService';
import { QUERY_KEYS } from '@/enums/queryKeys';

export function useUpdatePaymentInfo(username: string, setErrorMsg: (msg: string) => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (paymentData: PaymentData) => updatePaymentData(paymentData, username),
        onSuccess: async () => {
            setErrorMsg('');
            addToast({
                color: 'success',
                title: 'Success',
                description: 'Your Payment Info is now up to date!',
            });
            await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.payment_data, username] });
        },
        onError: (error: any) => {
            const errorMessage = error.message || 'Error updating payment data';

            setErrorMsg(errorMessage);
            addToast({
                color: 'danger',
                title: 'Failed to update payment information',
                description: errorMessage,
            });
        },
    });
}
