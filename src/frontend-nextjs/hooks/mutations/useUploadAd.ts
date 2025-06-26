import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { uploadAd } from '@/services/AdService';

export function useUploadAd(onSuccess: () => void, onError: (error: any) => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => uploadAd(formData),
        onSuccess: () => {
            onSuccess();
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ad_list] });
        },
        onError: (error: any) => {
            onError(error);
        },
    });
}
