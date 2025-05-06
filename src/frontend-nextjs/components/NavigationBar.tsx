'use client';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Image } from '@heroui/react';
import { usePathname } from 'next/navigation';

import { ROUTES } from '@/enums/routes';
import { useCheckLogin } from '@/hooks/useCheckLogin';
import NavbarProfileDropdown from '@/components/NavbarProfileDropdown';

export function UnguardLogo() {
    return <Image alt='Unguard Logo' height='32' src='/ui/unguard_logo.svg' width='32' />;
}

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
            <Link href={ROUTES.home}>
                <NavbarBrand className='max-w-36'>
                    <UnguardLogo />
                    <p className='font-bold text-inherit px-2 text-large text-secondary'>Unguard</p>
                </NavbarBrand>
            </Link>
            <NavbarContent className='hidden sm:flex gap-4' justify='center'>
                <NavbarItem isActive={pathname === ROUTES.home}>
                    <Link color='secondary' href={ROUTES.home}>
                        Home
                    </Link>
                </NavbarItem>
                {isLoggedIn && (
                    <NavbarItem isActive={pathname === ROUTES.users}>
                        <Link color='secondary' href={ROUTES.users}>
                            Users
                        </Link>
                    </NavbarItem>
                )}
                {isLoggedIn && (
                    <NavbarItem isActive={pathname === ROUTES.mytimeline}>
                        <Link color='secondary' href={ROUTES.mytimeline}>
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
                    {isLoggedIn && <NavbarProfileDropdown />}
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
