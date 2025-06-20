'use client';
import { ErrorBoundary } from 'react-error-boundary';

import { useAllPosts } from '@/hooks/queries/usePosts';
import { Timeline } from '@/components/Timeline/Timeline';
import { ErrorCard } from '@/components/ErrorCard';

export function GlobalTimelineComponent() {
    const { data, isLoading } = useAllPosts();

    return <Timeline isLoading={isLoading} posts={data} />;
}

export function GlobalTimeline() {
    return (
        <ErrorBoundary fallbackRender={(props) => <ErrorCard message={props.error.message} />}>
            <GlobalTimelineComponent />
        </ErrorBoundary>
    );
}
