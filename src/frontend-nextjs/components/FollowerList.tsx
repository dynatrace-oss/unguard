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

import { useFollowersList } from '@/hooks/useFollowersList';
import { User } from '@/components/User';

interface FollowerListProps {
    username: string;
}

export function FollowerList(props: FollowerListProps) {
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
                                    {!followers || followers?.length === 0
                                        ? 'No users found...'
                                        : followers?.map(
                                              (user: { userId: string; userName: string }, index: number) => (
                                                  <div key={index}>
                                                      <User roles={[]} userid={user.userId} username={user.userName} />
                                                  </div>
                                              ),
                                          )}
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
