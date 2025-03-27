'use client';

import { useQuery } from '@tanstack/react-query';

import PostComponent from '@/components/PostComponent';
import { PostProps } from '@/components/PostComponent';

async function fetchPosts() {
    const res = await fetch('ui/api/posts');

    if (!res.ok) {
        throw new Error('Failed to fetch posts');
    }

    return res.json();
}

export default function Timeline() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
    });

    if (isLoading) return <p>Loading timeline...</p>;
    if (isError) {
        return <p>Error loading timeline {error instanceof Error ? error.message : ''}</p>;
    }

    return (
        <div>
            {data?.map((post: PostProps, index: number) => (
                <PostComponent
                    key={index}
                    avatar_url={post.avatar_url}
                    likes={post.likes}
                    name={post.name}
                    text={post.text}
                    timestamp={post.timestamp}
                />
            ))}
        </div>
    );
}
