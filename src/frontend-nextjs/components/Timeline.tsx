'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, Spinner } from '@heroui/react';

import PostComponent from '@/components/PostComponent';
import { PostProps } from '@/components/PostComponent';
import ErrorCard from '@/components/ErrorCard';

async function fetchPosts() {
    const res = await fetch('ui/api/posts');

    if (!res.ok) {
        throw new Error('Failed to fetch posts');
    }

    return res.json();
}

//this is just for now for testing, should be removed later
async function registerUser() {
    const res = await fetch('ui/api/user', { method: 'POST' });

    if (!res.ok) {
        throw new Error('Failed to create new user');
    }

    return res.json();
}

export default function Timeline() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
    });

    registerUser(); //just for testing purposes, remove later

    console.log(data);

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

    if (data.length === 0) {
        return <ErrorCard message='No data' />;
    }

    console.log(new Date(data[0].timestamp).toString());

    return (
        <div>
            {data?.map((post: PostProps, index: number) => (
                <PostComponent
                    key={index}
                    body={post.body}
                    imageUrl={post.imageUrl}
                    likes={post.likes}
                    timestamp={post.timestamp}
                    username={post.username}
                />
            ))}
        </div>
    );
}
