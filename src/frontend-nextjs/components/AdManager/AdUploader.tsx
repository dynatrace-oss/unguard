import { addToast, Button, Card, CardBody, Form, Input } from '@heroui/react';
import { FormEvent, useCallback, useRef } from 'react';

import { useUploadAd } from '@/hooks/mutations/useUploadAd';

export function AdUploader() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSuccess = useCallback(() => {
        addToast({
            color: 'success',
            title: 'Success',
            description: 'New ad uploaded successfully!',
        });
    }, []);

    const handleError = useCallback((error: any) => {
        const errorMessage = error.message || 'Error uploading new ad';

        addToast({
            color: 'danger',
            title: 'Failed to upload ad',
            description: errorMessage,
        });
    }, []);

    const uploadAd = useUploadAd(handleSuccess, handleError);

    const uploadFile = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const file = fileInputRef.current?.files?.[0];

            if (!file) return;
            const formData = new FormData();

            formData.append('file', file);
            uploadAd.mutate(formData);
        },
        [fileInputRef],
    );

    return (
        <Card className='border-1 border-primary p-1 max-w-[500]'>
            <Form onSubmit={uploadFile}>
                <CardBody className='flex flex-row gap-1 justify-between items-center'>
                    <div className='flex flex-row items-center gap-2'>
                        <Input ref={fileInputRef} accept='.zip' className='w-[180]' type='file' />
                        <Button className='align-right' color='primary' type='submit'>
                            Upload
                        </Button>
                    </div>
                </CardBody>
            </Form>
        </Card>
    );
}
