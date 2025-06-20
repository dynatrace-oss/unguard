'use client';
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    Link,
    useDisclosure,
} from '@heroui/react';

import { useFollowersList } from '@/hooks/queries/useFollowersList';
import { FollowerList } from '@/components/UserProfile/FollowerList';

interface FollowerListProps {
    username: string;
}

export function FollowersView(props: FollowerListProps) {
    const { data: followers, isLoading } = useFollowersList(props.username);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        !isLoading && (
            <h4 className='text-medium font-semibold leading-none text-default-600 pb-4'>
                <Link className='cursor-pointer' underline='hover' onPress={onOpen}>
                    {followers?.length} {followers?.length === 1 ? 'Follower' : 'Followers'}
                </Link>
                <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
                    <DrawerContent>
                        {(onClose) => (
                            <>
                                <DrawerHeader className='text-2xl flex flex-col gap-1'>
                                    Followers of {props.username}
                                </DrawerHeader>
                                <DrawerBody>
                                    <FollowerList followers={followers} />
                                </DrawerBody>
                                <DrawerFooter>
                                    <Button color='danger' variant='light' onPress={onClose}>
                                        Close
                                    </Button>
                                </DrawerFooter>
                            </>
                        )}
                    </DrawerContent>
                </Drawer>
            </h4>
        )
    );
}
