import { useJwtPayload } from '@/hooks/queries/useJwtPayload';
import { useMembership } from '@/hooks/queries/useMembership';
import { MEMBERSHIP } from '@/enums/memberships';

export function useAdVisibility() {
    const { data: jwt_payload, isLoading: isJwtLoading } = useJwtPayload();
    const username = jwt_payload?.username;

    const membershipResult = useMembership(username || '');

    return {
        isLoading: isJwtLoading || membershipResult.isLoading,
        isPro: membershipResult.data == MEMBERSHIP.PRO,
    };
}
