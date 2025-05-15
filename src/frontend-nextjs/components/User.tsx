'use client';

import { Card, CardBody, Avatar, Link } from '@heroui/react';

import { useNavigation } from '@/hooks/useNavigation';

export interface UserProps {
    username: string;
    roles: string[];
    userid: string;
}

export function User(props: UserProps) {
    const navigation = useNavigation();

    return (
        <div>
            <Card className='p-2'>
                <CardBody className='className=justify-between'>
                    <div className='flex gap-5'>
                        <Avatar
                            isBordered
                            className='cursor-pointer'
                            radius='full'
                            size='md'
                            src={`https://robohash.org/${props.username}.png?set=set1&size=35x35`}
                            onClick={() => navigation.useNavigateToUserProfile(props.username)}
                        />
                        <div className='flex flex-col gap-1 items-start justify-center'>
                            <h4 className='text-medium font-semibold leading-none text-default-600'>
                                <Link
                                    className='cursor-pointer'
                                    underline='hover'
                                    onPress={() => navigation.useNavigateToUserProfile(props.username)}
                                >
                                    {props.username}
                                </Link>
                            </h4>
                            <h5 className='text-small tracking-tight text-default-400'>{props.roles.toString()}</h5>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
