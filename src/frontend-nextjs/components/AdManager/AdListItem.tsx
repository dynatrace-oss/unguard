'use client';

import { addToast, Button, Card, CardBody, Spinner } from '@heroui/react';
import { BsTrash } from 'react-icons/bs';
import { useCallback } from 'react';

import { useDeleteAd } from '@/hooks/mutations/useDeleteAd';

export interface AdListItemProps {
    name: string;
    creationTime: string;
}

export function AdListItem(props: AdListItemProps) {
    const handleSuccess = useCallback(() => {
        addToast({ title: `Deleted ad ${props.name} successfully!`, color: 'success' });
    }, []);

    const handleError = useCallback((error: any) => {
        const errorMessage = error.message || 'Error deleting ad';

        addToast({
            title: `Failed to delete ad ${props.name}: ${error.message}`,
            description: errorMessage,
            color: 'danger',
        });
    }, []);

    const { mutate, isPending } = useDeleteAd(props.name, handleSuccess, handleError);

    const handleDeleteButtonClick = useCallback(() => {
        mutate();
    }, [mutate]);

    if (isPending) {
        return <Spinner />;
    }

    return (
        <Card className='p-1 w-full'>
            <CardBody>
                <div className='flex justify-between items-center gap-5 w-full'>
                    <h4 className='text-medium font-semibold text-default-900'>{props.name}</h4>
                    <div className='flex flex-row items-center gap-2'>
                        <p className='text-default-800'>{props.creationTime}</p>
                        <Button
                            color='danger'
                            startContent={<BsTrash />}
                            variant='bordered'
                            onPress={() => handleDeleteButtonClick()}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
