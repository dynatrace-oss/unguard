'use client';

import { Card, CardHeader, CardBody, CardFooter, Avatar, Button } from '@heroui/react';

export interface PostProps {
    name: string;
    timestamp: string;
    text: string;
    likes: number;
    avatar_url: string;
}

export default function PostComponent(props: PostProps) {
    function like() {
        //TODO
    }

    return (
        <Card>
            <CardHeader className='justify-between'>
                <div className='flex gap-5'>
                    <Avatar isBordered radius='full' size='md' src={props.avatar_url} />
                    <div className='flex flex-col gap-1 items-start justify-center'>
                        <h4 className='text-medium font-semibold leading-none text-default-600'>{props.name}</h4>
                        <h5 className='text-small tracking-tight text-default-400'>{props.timestamp}</h5>
                    </div>
                </div>
            </CardHeader>
            <CardBody className='px-3 text-small text-default-600'>
                <p>{props.text}</p>
            </CardBody>
            <CardFooter className='gap-3 justify-end px-3'>
                <div className='flex gap-1'>
                    <Button className=' text-default-600 bg-transparent' onPress={like}>
                        <p>{props.likes}</p>
                        <i className='bi bi-hand-thumbs-up' />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
