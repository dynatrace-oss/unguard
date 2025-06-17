import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PaymentData, updatePaymentData } from '@/services/PaymentService';
import { QUERY_KEYS } from '@/enums/queryKeys';

export function useUpdatePaymentInfo(username: string, onSuccess: () => void, onError: (error: any) => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (paymentData: PaymentData) => updatePaymentData(paymentData, username),
        onSuccess: () => {
            onSuccess();
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.payment_data, username] });
        },
        onError: (error: any) => {
            onError(error);
        },
    });
}
