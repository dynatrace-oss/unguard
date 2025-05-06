'use client';
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Link, Image } from '@heroui/react';
import path from 'path';

import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Link } from '@heroui/react';
import { BsHandThumbsUp } from 'react-icons/bs';

import { ROUTES } from '@/enums/routes';

export interface PostProps {
    username: string;
    timestamp: string;
    body: string;
    likes: number;
    imageUrl?: string;
}

export function Post(props: PostProps) {
    function like() {
        //TODO
    }

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
                            onClick={() => (window.location.href = path.join('/ui', ROUTES.user, props.username))}
                        />
                        <div className='flex flex-col gap-1 items-start justify-center'>
                            <h4 className='text-medium font-semibold leading-none text-default-600'>
                                <Link
                                    className='cursor-pointer'
                                    underline='hover'
                                    onPress={() => {
                                        {
                                            /*
                                            Due to a currently unsolved bug in Next.js window.location.href has to be used instead of router.push() to ensure that the middleware is executed.
                                            Otherwise, inconsistencies in the route restriction are possible.

                                            https://github.com/vercel/next.js/issues/58025
                                            */
                                        }
                                        window.location.href = path.join('/ui', ROUTES.user, props.username);
                                    }}
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
                    <div className='flex gap-1'>
                        <Button className=' text-default-600 bg-transparent' onPress={like}>
                            <p>{props.likes}</p>
                            <BsHandThumbsUp />
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
