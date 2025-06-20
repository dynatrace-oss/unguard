'use client';
import { Card, Spacer, Spinner } from '@heroui/react';

import { Post } from '@/components/Timeline/Post';
import { PostProps } from '@/components/Timeline/Post';

interface TimelineProps {
    posts: PostProps[] | undefined;
    isLoading: boolean;
}

export function Timeline({ posts, isLoading }: TimelineProps) {
    if (isLoading)
        return (
            <Card className='flex items-center justify-center min-h-20'>
                <Spinner />
            </Card>
        );

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
                        postId={post.postId}
                        timestamp={post.timestamp}
                        username={post.username}
                    />
                    <Spacer y={4} />
                </div>
            ))}
        </div>
    );
}
