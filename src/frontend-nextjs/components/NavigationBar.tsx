'use client';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Image } from '@heroui/react';
import { usePathname } from 'next/navigation';

import { ROUTES } from '@/app/enums/routes';

export function UnguardLogo() {
    return <Image alt='Unguard Logo' height='32' src='/ui/unguard_logo_white.svg' width='32' />;
}

export function NavigationBar() {
    const pathname = usePathname();

    return (
        <Navbar
            maxWidth='full'
            style={{
                backgroundColor: '#4ab973',
                color: '#f1f1f1',
                borderRadius: '15px',
            }}
        >
            <NavbarBrand className='max-w-36'>
                <UnguardLogo />
                <p className='font-bold text-inherit px-2 text-large'>Unguard</p>
            </NavbarBrand>
            <NavbarContent className='hidden sm:flex gap-4' justify='center'>
                <NavbarItem isActive={pathname === ROUTES.home}>
                    <Link color='secondary' href={ROUTES.home}>
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={pathname === ROUTES.users}>
                    <Link color='secondary' href={ROUTES.users}>
                        Users
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={pathname === ROUTES.mytimeline}>
                    <Link color='secondary' href={ROUTES.mytimeline}>
                        My Timeline
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify='end'>
                <NavbarItem className='justify-items-end'>
                    <Button as={Link} color='default' href={ROUTES.login} variant='solid'>
                        Login/Register
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
