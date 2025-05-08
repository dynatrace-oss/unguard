'use client';
import { useAllPosts } from '@/hooks/usePosts';
import { Timeline } from '@/components/Timeline';

export function GlobalTimeline() {
    const { data, isLoading, isError, error } = useAllPosts();

    return <Timeline error={error} isError={isError} isLoading={isLoading} posts={data} />;
}
