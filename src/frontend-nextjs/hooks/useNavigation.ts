import path from 'path';

import { useRouter } from 'next/navigation';

import { ROUTES } from '@/enums/routes';

export interface Navigation {
    useNavigateToUserProfile: (username: string) => void;
    useNavigateToPost: (postId: string) => void;
    useNavigateToHomePage: () => void;
    useNavigateToPersonalTimeline: () => void;
    useNavigateToUsersList: () => void;
    useNavigateToLoginRegister: () => void;
}

export function useNavigation() {
    const router = useRouter();

    const navigation: Navigation = {
        useNavigateToUserProfile: () => {},
        useNavigateToPost: () => {},
        useNavigateToHomePage: () => {},
        useNavigateToPersonalTimeline: () => {},
        useNavigateToUsersList: () => {},
        useNavigateToLoginRegister: () => {},
    };

    navigation.useNavigateToLoginRegister = () => {
        router.push(ROUTES.login);
    };

    navigation.useNavigateToUserProfile = (username: string) => {
        router.push(path.join(ROUTES.user, username));
    };

    navigation.useNavigateToPost = (postId: string) => {
        router.push(path.join(ROUTES.post + '?id=' + postId));
    };

    navigation.useNavigateToHomePage = () => {
        router.push(ROUTES.home);
    };

    navigation.useNavigateToPersonalTimeline = () => {
        router.push(ROUTES.mytimeline);
    };

    navigation.useNavigateToUsersList = () => {
        router.push(ROUTES.users);
    };

    return navigation;
}
