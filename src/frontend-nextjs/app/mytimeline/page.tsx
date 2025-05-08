'use client';

import { usePersonalTimeline } from '@/hooks/usePosts';
import { CreatePost } from '@/components/CreatePost';
import { Timeline } from '@/components/Timeline';
import { Ad } from '@/components/Ad';

export default function MyTimeline() {
    const { data, isLoading, isError, error } = usePersonalTimeline();

    return (
        <div>
            <h1 className='mb-6 text-4xl font-extrabold leading-none tracking-tight text-gray-800'>My Timeline</h1>
            <div className='grid gap-8 grid-cols-[70%_30%] min-h-screen'>
                <div>
                    <CreatePost />
                    <Timeline error={error} isError={isError} isLoading={isLoading} posts={data} />
                </div>
                <Ad />
            </div>
        </div>
    );
}
