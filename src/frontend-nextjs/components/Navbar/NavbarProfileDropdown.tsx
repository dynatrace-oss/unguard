'use client';
import path from 'path';

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User, addToast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';

import { ROUTES } from '@/enums/routes';
import { useJwtPayload } from '@/hooks/queries/useJwtPayload';
import { QUERY_KEYS } from '@/enums/queryKeys';
import { useNavigation } from '@/hooks/useNavigation';
import { BASE_PATH } from '@/constants';

async function logout() {
    return await fetch(path.join(BASE_PATH, '/api/auth/logout'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
}

export default function NavbarProfileDropdown() {
    const { data: jwt_payload } = useJwtPayload();
    const { navigateToLoginRegister } = useNavigation();
    const queryClient = useQueryClient();

    function handleLogout(res: Response) {
        if (res.ok) {
            queryClient
                .invalidateQueries({ queryKey: [QUERY_KEYS.isLoggedIn] })
                .then(() => navigateToLoginRegister())
                .then(() => addToast({ title: 'Logout successful', description: 'Goodbye!' }));
        }
    }

    return (
        <div className='flex items-center gap-4'>
            <Dropdown>
                <DropdownTrigger id='ProfileDropdownTrigger'>
                    <User
                        as='button'
                        avatarProps={{
                            src: `https://robohash.org/${jwt_payload?.username}.png?set=set1&size=35x35`,
                            alt: jwt_payload?.username,
                        }}
                        className='transition-transform font-bold max-h-36'
                        name={jwt_payload?.username}
                    />
                </DropdownTrigger>
                <DropdownMenu aria-label='User Actions' variant='flat'>
                    <DropdownItem
                        key='profile'
                        href={path.join(ROUTES.user, jwt_payload?.username || '')}
                        textValue='Profile'
                    >
                        Profile
                    </DropdownItem>
                    <DropdownItem key='membership' href={ROUTES.membership_plans} textValue='Membership Plans'>
                        Membership
                    </DropdownItem>
                    <DropdownItem key='payment' href={ROUTES.payment} textValue='Payment Information'>
                        Payment Information
                    </DropdownItem>
                    <DropdownItem
                        key='logout'
                        color='primary'
                        id='logout'
                        textValue='Logout'
                        onPress={() => logout().then((res) => handleLogout(res))}
                    >
                        <b>Logout</b>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}
