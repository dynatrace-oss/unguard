'use client';

import { ErrorBoundary } from 'react-error-boundary';

import { usePersonalTimeline } from '@/hooks/queries/usePosts';
import { CreatePost } from '@/components/CreatePost';
import { Timeline } from '@/components/Timeline/Timeline';
import { Ad } from '@/components/Ad';
import { ErrorCard } from '@/components/ErrorCard';

function PersonalTimeline() {
    const { data, isLoading } = usePersonalTimeline();

    return <Timeline isLoading={isLoading} posts={data} />;
}

export default function MyTimeline() {
    return (
        <div>
            <h1 className='mb-6 text-4xl font-extrabold leading-none tracking-tight text-gray-800'>My Timeline</h1>
            <div className='grid gap-8 grid-cols-[70%_30%]'>
                <div>
                    <CreatePost />
                    <ErrorBoundary fallbackRender={(props) => <ErrorCard message={props.error.message} />}>
                        <PersonalTimeline />
                    </ErrorBoundary>
                </div>
                <Ad />
            </div>
        </div>
    );
}
