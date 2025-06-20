import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { updateMembership } from '@/services/MembershipService';

export function useUpdateMembership(username: string, onSuccess: () => void, onError: (error: any) => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (membership: string) => updateMembership({ membership: membership }, username),
        onSuccess: () => {
            onSuccess();
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.membership, username] });
        },
        onError: (error: any) => {
            onError(error);
        },
    });
}
