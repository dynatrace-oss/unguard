'use client';
import { Card, Spacer, Spinner } from '@heroui/react';

import { Post } from '@/components/Post';
import { PostProps } from '@/components/Post';
import { ErrorCard } from '@/components/ErrorCard';

interface TimelineProps {
    posts: [];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
}

export function Timeline({ posts, isLoading, isError, error }: TimelineProps) {
    if (isLoading)
        return (
            <Card className='flex items-center justify-center min-h-20'>
                <Spinner />
            </Card>
        );
    if (isError) {
        let errormessage = 'Error loading timeline';

        if (error instanceof Error) {
            errormessage = errormessage + ': ' + error.message;
        }

        return <ErrorCard message={errormessage} />;
    }

    if (posts?.length === 0) {
        return <Card className='flex items-center justify-center font-bold'>Nothing to see here...</Card>;
    }

    return (
        <div>
            {posts?.map((post: PostProps, index: number) => (
                <div key={index}>
                    <Post
                        body={post.body}
                        imageUrl={post.imageUrl}
                        likes={post.likes}
                        timestamp={post.timestamp}
                        username={post.username}
                    />
                    <Spacer y={4} />
                </div>
            ))}
        </div>
    );
}
