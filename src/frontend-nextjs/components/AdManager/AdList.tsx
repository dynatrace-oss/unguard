import { Card, Spacer, Spinner } from '@heroui/react';

import { AdListItem } from '@/components/AdManager/AdListItem';
import { useAdList } from '@/hooks/queries/useAdList';

export function AdList() {
    const { data: adList, isLoading } = useAdList();

    if (isLoading) {
        return (
            <Card className='flex items-center justify-center min-h-20'>
                <Spinner />
            </Card>
        );
    }

    return (
        <div>
            <div>
                {!adList || adList.length === 0
                    ? 'No ads found...'
                    : adList.toReversed().map((ad: { name: string; creationTime: string }) => (
                          <div key={ad.name}>
                              <AdListItem creationTime={ad.creationTime} name={ad.name} />
                              <Spacer y={2} />
                          </div>
                      ))}
            </div>
        </div>
    );
}
