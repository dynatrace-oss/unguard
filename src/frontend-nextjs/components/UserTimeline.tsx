'use client';
import { usePostsOfUser } from '@/hooks/usePosts';
import { Timeline } from '@/components/Timeline';

interface UserTimelineProps {
    username: string;
}

export function UserTimeline({ username }: UserTimelineProps) {
    const { data, isLoading, isError, error } = usePostsOfUser(username);

    return <Timeline error={error} isError={isError} isLoading={isLoading} posts={data} />;
}
