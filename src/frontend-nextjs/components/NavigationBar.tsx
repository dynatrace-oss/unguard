'use client';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Image, addToast } from '@heroui/react';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { ROUTES } from '@/app/enums/routes';
import { useCheckLogin } from '@/hooks/useCheckLogin';

export function UnguardLogo() {
    return <Image alt='Unguard Logo' height='32' src='/ui/unguard_logo.svg' width='32' />;
}

async function logout() {
    return await fetch('/ui/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
}

export default function NavigationBar() {
export function NavigationBar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: isLoggedIn } = useCheckLogin();
    const queryClient = useQueryClient();

    function handleLogout(res: Response) {
        if (res.ok) {
            queryClient
                .invalidateQueries({ queryKey: ['isLoggedIn'] })
                .then(() => router.push(ROUTES.login))
                .then(() => addToast({ title: 'Logout successful', description: 'Goodbye!' }));
        }
    }

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
                    {isLoggedIn && (
                        <Button
                            color='default'
                            variant='solid'
                            onPress={() => logout().then((res) => handleLogout(res))}
                        >
                            Logout
                        </Button>
                    )}
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
