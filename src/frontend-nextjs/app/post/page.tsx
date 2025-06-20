'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { Button, Card, Spinner } from '@heroui/react';
import { ErrorBoundary } from 'react-error-boundary';

import { usePost } from '@/hooks/queries/usePost';
import { Post as PostComponent } from '@/components/Timeline/Post';
import { ErrorCard } from '@/components/ErrorCard';

function SinglePost() {
    const searchParams = useSearchParams();

    const postId = searchParams.get('id');
    const { data: postData, isLoading } = usePost(postId || '');

    if (isLoading) {
        return (
            <Card className='flex items-center justify-center min-h-20 w-full'>
                <Spinner />
            </Card>
        );
    }

    return (
        <div className='w-full'>
            {postData && (
                <PostComponent
                    body={postData.body}
                    imageUrl={postData.imageUrl}
                    postId={postData.postId}
                    timestamp={postData.timestamp}
                    username={postData.username}
                />
            )}
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
                    <ErrorBoundary fallbackRender={(props) => <ErrorCard message={props.error.message} />}>
                        <SinglePost />
                    </ErrorBoundary>
                </Suspense>
            </div>
        </div>
    );
}
