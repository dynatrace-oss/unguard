import { ROUTES } from '@/enums/routes';

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: 'Unguard',
    description:
        'An insecure cloud-native microservices demo application. It consists of eight app services, a load generator, and two databases.',
    navItems: [
        {
            label: 'Home',
            href: ROUTES.home,
        },
        {
            label: 'Users',
            href: ROUTES.users,
        },
        {
            label: 'My Timeline',
            href: ROUTES.mytimeline,
        },
        {
            label: 'Login/Register',
            href: ROUTES.login,
        },
        {
            label: 'Membership Plans',
            href: ROUTES.membership_plans,
        },
        {
            label: 'Payment Information',
            href: ROUTES.payment,
        },
    ],
};
