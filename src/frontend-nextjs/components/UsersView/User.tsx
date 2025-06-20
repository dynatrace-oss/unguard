'use client';

import { Card, CardBody, Avatar } from '@heroui/react';

import { useNavigation } from '@/hooks/useNavigation';

export interface UserProps {
    username: string;
    roles: string[];
    userId: string;
}

export function User(props: UserProps) {
    const { navigateToUserProfile } = useNavigation();

    return (
        <div>
            <Card
                isPressable
                className='p-1 cursor-pointer hover:bg-gray-100 w-full'
                onPress={() => navigateToUserProfile(props.username)}
            >
                <CardBody className='justify-between'>
                    <div className='flex gap-5'>
                        <Avatar
                            isBordered
                            className='cursor-pointer'
                            radius='full'
                            size='md'
                            src={`https://robohash.org/${props.username}.png?set=set1&size=35x35`}
                        />
                        <div className='flex flex-col gap-1 items-start justify-center'>
                            <h4 className='text-medium font-semibold leading-none text-primary'>{props.username}</h4>
                            <h5 className='text-small tracking-tight text-default-400'>{props.roles.toString()}</h5>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
