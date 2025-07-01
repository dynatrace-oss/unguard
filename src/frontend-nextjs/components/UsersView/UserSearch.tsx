'use client';
import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Card,
    CardBody,
    Select,
    SelectItem,
    Spacer,
    Spinner,
} from '@heroui/react';
import { BsSearch } from 'react-icons/bs';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorCard } from '@/components/ErrorCard';
import { useUserList } from '@/hooks/queries/useUserList';
import { User, UserProps } from '@/components/UsersView/User';
import { useRoles } from '@/hooks/queries/useRoles';
import { QUERY_KEYS } from '@/enums/queryKeys';

function UserSearchComponent() {
    const { data: userList, isLoading: userListIsLoading } = useUserList({}, QUERY_KEYS.all_users);
    const params: any = {};
    const { data: filteredUserList, isLoading: filteredUserListIsLoading } = useUserList(
        params,
        QUERY_KEYS.filtered_users,
    );
    const { data: roles } = useRoles();
    const queryClient = useQueryClient();
    const [filteredRoles, setFilteredRoles] = useState<string[]>([]);
    const [filteredName, setFilteredName] = useState('');

    const filterList = useCallback(() => {
        params.name = filteredName;
        if (filteredRoles.length > 0) {
            params.roles = filteredRoles;
        }

        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.filtered_users] });
    }, [filteredRoles, filteredName]);

    if (userListIsLoading || filteredUserListIsLoading)
        return (
            <Card className='flex items-center justify-center min-h-20'>
                <Spinner />
            </Card>
        );

    return (
        <div>
            <Card>
                <CardBody className='flex flex-row gap-1'>
                    <Autocomplete
                        allowsCustomValue
                        defaultItems={userList}
                        id='userSearch'
                        label='Search Users'
                        name='filteredName'
                        variant='bordered'
                        onInputChange={(value) => setFilteredName(value)}
                    >
                        {(user: any) => <AutocompleteItem key={user.username}>{user.username}</AutocompleteItem>}
                    </Autocomplete>
                    {roles && (
                        <Select
                            className='max-w-60'
                            label='Roles'
                            name='filteredRoles'
                            placeholder='Filter roles'
                            selectionMode='multiple'
                            onChange={(e) => {
                                setFilteredRoles(e.target.value.length > 0 ? e.target.value.split(',') : []);
                            }}
                        >
                            {roles?.map((role: any) => <SelectItem key={role.name}>{role.name}</SelectItem>)}
                        </Select>
                    )}
                    <Button
                        isIconOnly
                        className='self-center'
                        color='primary'
                        name='searchUsersButton'
                        onPress={() => filterList()}
                    >
                        <BsSearch />
                    </Button>
                </CardBody>
            </Card>
            <Spacer y={2} />
            {!filteredUserList || filteredUserList?.length === 0 ? (
                <Card className='flex items-center justify-center font-bold h-20'>No users found...</Card>
            ) : (
                filteredUserList?.map((user: UserProps, index: number) => (
                    <div key={index}>
                        <User roles={user.roles} userId={user.userId} username={user.username} />
                        <Spacer y={2} />
                    </div>
                ))
            )}
        </div>
    );
}

export function UserSearch() {
    return (
        <ErrorBoundary fallbackRender={(props) => <ErrorCard message={props.error.message} />}>
            <UserSearchComponent />
        </ErrorBoundary>
    );
}
