'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { Button, Card, Spinner } from '@heroui/react';

import { usePost } from '@/hooks/usePost';
import { Post as PostComponent } from '@/components/Post';
import { ErrorCard } from '@/components/ErrorCard';

function SinglePost() {
    const searchParams = useSearchParams();

    const postId = searchParams.get('id');
    const { data: postData, isLoading, isError } = usePost(postId || '');

    if (isLoading) {
        return (
            <Card className='flex items-center justify-center min-h-20 w-full'>
                <Spinner />
            </Card>
        );
    }

    if (isError) {
        return <ErrorCard message='Post does not exist!' />;
    }

    return (
        <div className='w-full'>
            <PostComponent
                body={postData?.body}
                imageUrl={postData?.imageUrl}
                likes={postData?.likes}
                timestamp={postData?.timestamp}
                username={postData?.username}
            />
        </div>
    );
}

export default function Post() {
    const router = useRouter();

    return (
        <div>
            <div className='grid gap-8 grid-cols-[5%_90%_5%]' />
            <div className='flex flex-column w-full gap-2'>
                <Button isIconOnly color='primary' onPress={() => router.back()}>
                    <BsArrowLeft className='stroke-1' />
                </Button>
                <Suspense>
                    <SinglePost />
                </Suspense>
            </div>
        </div>
    );
}
