'use client';
import { Card, Spacer, Spinner } from '@heroui/react';

import { Post } from '@/components/Post';
import { PostProps } from '@/components/Post';
import { ErrorCard } from '@/components/ErrorCard';
import { usePosts } from '@/hooks/usePosts';
import { CreatePost } from '@/components/CreatePost';
import { useCheckLogin } from '@/hooks/useCheckLogin';

//this is just for now for testing, should be removed later
async function registerUser() {
    const res = await fetch('/ui/api/user', { method: 'POST' });

    if (!res.ok) {
        throw new Error('Failed to create new user');
    }

    return res.json();
}

interface TimelineProps {
    username?: string;
}

export function Timeline({ username }: TimelineProps) {
    const { data, isLoading, isError, error } = usePosts(username || undefined);
    const { data: isLoggedIn } = useCheckLogin();

    registerUser(); //just for testing purposes, remove later

    if (isLoading)
        return (
            <Card className='flex items-center justify-center'>
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

    if (data?.length === 0) {
        return <Card className='flex items-center justify-center font-bold'>Nothing to see here...</Card>;
    }

    return (
        <div>
            {!username && isLoggedIn && <CreatePost />}
            {data?.map((post: PostProps, index: number) => (
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
