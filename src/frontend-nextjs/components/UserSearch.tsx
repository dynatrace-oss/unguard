'use client';
import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Card,
    CardBody,
    Form,
    Select,
    SelectItem,
    Spacer,
    Spinner,
} from '@heroui/react';
import { BsSearch } from 'react-icons/bs';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { ErrorCard } from '@/components/ErrorCard';
import { useUserList } from '@/hooks/useUserList';
import { User, UserProps } from '@/components/User';
import { useRoles } from '@/hooks/useRoles';
import { QUERY_KEYS } from '@/enums/queryKeys';

export function UserSearch() {
    const { data: userList, isLoading: userListIsLoading } = useUserList({}, QUERY_KEYS.all_users);
    const params: any = {};
    const {
        data: filteredUserList,
        isLoading: filteredUserListIsLoading,
        isError: filteredUserListIsError,
        error: filteredUserListError,
    } = useUserList(params, QUERY_KEYS.filtered_users);
    const { data: roles } = useRoles();
    const queryClient = useQueryClient();
    const [filteredRoles, setFilteredRoles] = useState<string[]>([]);

    if (userListIsLoading || filteredUserListIsLoading)
        return (
            <Card className='flex items-center justify-center min-h-20'>
                <Spinner />
            </Card>
        );

    if (filteredUserListIsError) {
        let errormessage = 'Error loading users';

        if (filteredUserListError instanceof Error) {
            errormessage = errormessage + ': ' + filteredUserListError.message;
        }

        return <ErrorCard message={errormessage} />;
    }

    return (
        <div>
            <Card>
                <CardBody>
                    <Form
                        className='flex flex-row gap-1'
                        onSubmit={(e) => {
                            e.preventDefault();

                            const filters: { filteredName?: string; filteredRoles?: {} } = Object.fromEntries(
                                new FormData(e.currentTarget),
                            );

                            params.name = filters.filteredName;
                            if (filteredRoles.length > 0) {
                                params.roles = filteredRoles;
                            }

                            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.filtered_users] });
                        }}
                    >
                        <Autocomplete
                            allowsCustomValue
                            defaultItems={userList}
                            label='Search Users'
                            name='filteredName'
                            variant='bordered'
                        >
                            {(user: any) => <AutocompleteItem key={user.username}>{user.username}</AutocompleteItem>}
                        </Autocomplete>
                        <Select
                            className='max-w-60'
                            label='Roles'
                            name='filteredRoles'
                            placeholder='Filter roles'
                            selectionMode='multiple'
                            onChange={(e) => {
                                setFilteredRoles(
                                    e.target.value.length > 0 ? Array.from(e.target.value.split(',')) : [],
                                );
                            }}
                        >
                            {roles?.map((role: any) => <SelectItem key={role.name}>{role.name}</SelectItem>)}
                        </Select>
                        <Button isIconOnly className='self-center' color='primary' type='submit'>
                            <BsSearch />
                        </Button>
                    </Form>
                </CardBody>
            </Card>
            <Spacer y={2} />
            {!filteredUserList || filteredUserList?.length === 0 ? (
                <Card className='flex items-center justify-center font-bold h-20'>No users found...</Card>
            ) : (
                filteredUserList?.map((user: UserProps, index: number) => (
                    <div key={index}>
                        <User roles={user.roles} username={user.username} />
                        <Spacer y={2} />
                    </div>
                ))
            )}
        </div>
    );
}
