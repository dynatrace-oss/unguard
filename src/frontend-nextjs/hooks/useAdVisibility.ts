import { useJwtPayload } from '@/hooks/useJwtPayload';
import { useMembership } from '@/hooks/useMembership';

export function useAdVisibility() {
    const { data: jwt_payload, isLoading: isJwtLoading } = useJwtPayload();
    const username = jwt_payload?.username;

    const membershipResult = useMembership(username || '');

    return {
        isLoading: isJwtLoading || membershipResult.isLoading,
        isPro: membershipResult.data === 'PRO',
    };
}
