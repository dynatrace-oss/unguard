'use client';
import { ErrorBoundary } from 'react-error-boundary';

import { usePostsOfUser } from '@/hooks/queries/usePosts';
import { Timeline } from '@/components/Timeline/Timeline';
import { ErrorCard } from '@/components/ErrorCard';

interface UserTimelineProps {
    username: string;
}

function UserTimelineComponent({ username }: UserTimelineProps) {
    const { data, isLoading } = usePostsOfUser(username);

    return <Timeline isLoading={isLoading} posts={data} />;
}

export function UserTimeline({ username }: UserTimelineProps) {
    return (
        <ErrorBoundary fallbackRender={(props) => <ErrorCard message={props.error.message} />}>
            <UserTimelineComponent username={username} />
        </ErrorBoundary>
    );
}
