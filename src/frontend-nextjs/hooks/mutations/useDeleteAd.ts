import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { deleteAd } from '@/services/AdService';

export function useDeleteAd(adName: string, onSuccess: () => void, onError: (error: any) => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteAd(adName),
        onSuccess: () => {
            onSuccess();
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ad_list] });
        },
        onError: (error: any) => {
            onError(error);
        },
    });
}
