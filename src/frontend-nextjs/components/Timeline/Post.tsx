'use client';
import path from 'path';

import { Card, CardHeader, CardBody, CardFooter, Avatar, Link, Image } from '@heroui/react';
import { useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ROUTES } from '@/enums/routes';
import { BASE_PATH } from '@/constants';
import { useCheckLogin } from '@/hooks/queries/useCheckLogin';
import { LikeButton } from '@/components/Timeline/LikeButton';
import { ErrorCard } from '@/components/ErrorCard';

export interface PostProps {
    username: string;
    timestamp: string;
    body: string;
    imageUrl?: string;
    postId: string;
}

export function Post(props: PostProps) {
    const { isLoggedIn } = useCheckLogin();

    const navigateToUserProfile = useCallback(() => {
        /*
        Due to a currently unsolved bug in Next.js window.location.href has to be used instead of router.push() to ensure that the middleware is executed.
        Otherwise, inconsistencies in the route restriction are possible.

        https://github.com/vercel/next.js/issues/58025
        */
        window.location.href = path.join(BASE_PATH, ROUTES.user, props.username);
    }, []);

    return (
        <div>
            <Card className='p-2'>
                <CardHeader className='justify-between'>
                    <div className='flex gap-5'>
                        <Avatar
                            isBordered
                            className='cursor-pointer'
                            radius='full'
                            size='md'
                            src={`https://robohash.org/${props.username}.png?set=set1&size=35x35`}
                            onClick={() => navigateToUserProfile()}
                        />
                        <div className='flex flex-col gap-1 items-start justify-center'>
                            <h4 className='text-medium font-semibold leading-none text-default-600'>
                                <Link
                                    className='cursor-pointer'
                                    underline='hover'
                                    onPress={() => navigateToUserProfile()}
                                >
                                    {props.username}
                                </Link>
                            </h4>
                            <h5 className='text-small tracking-tight text-default-400'>
                                {new Date(props.timestamp).toString()}
                            </h5>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className='px-3 text-small text-default-600'>
                    {props.imageUrl && (
                        <div className='pb-4'>
                            <Image alt='' className='mw-100 h-100 max-h-[200px]' src={props.imageUrl} />
                        </div>
                    )}
                    <p>{props.body}</p>
                </CardBody>
                <CardFooter className='gap-3 justify-end px-3'>
                    {isLoggedIn && (
                        <div className='flex gap-1'>
                            <ErrorBoundary fallbackRender={(props) => <ErrorCard message={props.error.message} />}>
                                <LikeButton postId={props.postId} />
                            </ErrorBoundary>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
