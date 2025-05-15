'use client';
import path from 'path';

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User, addToast } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { ROUTES } from '@/enums/routes';
import { useJwtPayload } from '@/hooks/useJwtPayload';
import { QUERY_KEYS } from '@/enums/queryKeys';

async function logout() {
    return await fetch('/ui/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
}

export default function NavbarProfileDropdown() {
    const { data: jwt_payload } = useJwtPayload();
    const router = useRouter();
    const queryClient = useQueryClient();

    function handleLogout(res: Response) {
        if (res.ok) {
            queryClient
                .invalidateQueries({ queryKey: [QUERY_KEYS.isLoggedIn] })
                .then(() => router.push(ROUTES.login))
                .then(() => addToast({ title: 'Logout successful', description: 'Goodbye!' }));
        }
    }

    return (
        <div className='flex items-center gap-4'>
            <Dropdown>
                <DropdownTrigger>
                    <User
                        as='button'
                        avatarProps={{
                            isBordered: true,
                            src: `https://robohash.org/${jwt_payload?.username}.png?set=set1&size=35x35`,
                            alt: jwt_payload?.username,
                        }}
                        className='transition-transform font-bold max-h-36'
                        name={jwt_payload?.username}
                    />
                </DropdownTrigger>
                <DropdownMenu aria-label='User Actions' variant='flat'>
                    <DropdownItem key='profile' href={path.join(ROUTES.user, jwt_payload?.username || '')}>
                        Profile
                    </DropdownItem>
                    <DropdownItem key='settings'>Payment Information</DropdownItem>
                    <DropdownItem
                        key='logout'
                        color='primary'
                        onPress={() => logout().then((res) => handleLogout(res))}
                    >
                        Logout
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}
