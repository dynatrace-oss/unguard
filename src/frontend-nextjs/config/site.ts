export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: 'Unguard',
    description:
        'An insecure cloud-native microservices demo application. It consists of eight app services, a load generator, and two databases.',
    navItems: [
        {
            label: 'Home',
            href: '/',
        },
        {
            label: 'Users',
            href: '/users',
        },
        {
            label: 'My Timeline',
            href: '/mytimeline',
        },
        {
            label: 'Login/Register',
            href: '/login',
        },
    ],
};
