'use client';

import { Card, CardHeader, CardBody, CardFooter, Avatar, Button } from '@heroui/react';
import { BsHandThumbsUp } from 'react-icons/bs';

export interface PostProps {
    username: string;
    timestamp: string;
    body: string;
    likes: number;
    imageUrl: string;
}

export function Post(props: PostProps) {
    function like() {
        //TODO
    }

    return (
        <div>
            <Card>
                <CardHeader className='justify-between'>
                    <div className='flex gap-5'>
                        <Avatar isBordered radius='full' size='md' src={props.imageUrl} />
                        <div className='flex flex-col gap-1 items-start justify-center'>
                            <h4 className='text-medium font-semibold leading-none text-default-600'>
                                {props.username}
                            </h4>
                            <h5 className='text-small tracking-tight text-default-400'>
                                {new Date(props.timestamp).toString()}
                            </h5>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className='px-3 text-small text-default-600'>
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
