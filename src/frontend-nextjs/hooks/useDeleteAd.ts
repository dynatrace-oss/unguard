import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToast } from '@heroui/react';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { deleteAd } from '@/services/AdService';

export function useDeleteAd(adName: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteAd(adName),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ads_list] }).then(() => {
                addToast({ title: `Deleted ad ${adName} successfully!`, color: 'success' });
            });
        },
        onError: (error: Error) => {
            addToast({ title: `Failed to delete ad ${adName}: ${error.message}`, color: 'danger' });
        },
    });
}
