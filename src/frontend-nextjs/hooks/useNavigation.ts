import path from 'path';

import { useRouter } from 'next/navigation';

import { ROUTES } from '@/enums/routes';

export function useNavigation() {
    const router = useRouter();

    const navigateToLoginRegister = () => {
        router.push(ROUTES.login);
    };

    const navigateToUserProfile = (username: string) => {
        router.push(path.join(ROUTES.user, username));
    };

    const navigateToPost = (postId: string) => {
        router.push(path.join(ROUTES.post + '?id=' + postId));
    };

    const navigateToHomePage = () => {
        router.push(ROUTES.home);
    };

    const navigateToPersonalTimeline = () => {
        router.push(ROUTES.mytimeline);
    };

    const navigateToUsersList = () => {
        router.push(ROUTES.users);
    };

    const navigateToMembershipPage = () => {
        router.push(ROUTES.membership_plans);
    };

    return {
        navigateToLoginRegister,
        navigateToUserProfile,
        navigateToPost,
        navigateToHomePage,
        navigateToPersonalTimeline,
        navigateToUsersList,
        navigateToMembershipPage,
    };
}
