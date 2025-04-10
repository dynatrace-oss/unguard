'use client';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Image } from '@heroui/react';
import { usePathname } from 'next/navigation';

import { ROUTES } from '@/app/enums/routes';
import { useCheckLogin } from '@/hooks/useCheckLogin';
import ProfileMenu from '@/components/ProfileMenu';

export function UnguardLogo() {
    return <Image alt='Unguard Logo' height='32' src='/ui/unguard_logo.svg' width='32' />;
}

export default function NavigationBar() {
export function NavigationBar() {
    const pathname = usePathname();
    const { data: isLoggedIn } = useCheckLogin();

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
                {isLoggedIn && (
                    <NavbarItem>
                        <Link
                            isActive={pathname === ROUTES.users}
                            color='secondary'
                            href={ROUTES.users}
                        >
                            Users
                        </Link>
                    </NavbarItem>
                )}
                {isLoggedIn && (
                    <NavbarItem>
                        <Link
                            isActive={pathname === ROUTES.mytimeline}
                            color='secondary'
                            href={ROUTES.mytimeline}
                        >
                            My Timeline
                        </Link>
                    </NavbarItem>
                )}
            </NavbarContent>
            <NavbarContent justify='end'>
                <NavbarItem className='justify-items-end'>
                    {!isLoggedIn && (
                        <Button as={Link} color='default' href={ROUTES.login} variant='solid'>
                            Login/Register
                        </Button>
                    )}
                    {isLoggedIn && <ProfileMenu />}
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
