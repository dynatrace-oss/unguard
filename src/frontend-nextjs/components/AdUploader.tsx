import path from 'path';

import { Button, Card, CardBody, Form, Input } from '@heroui/react';
import { FormEvent, useCallback, useRef } from 'react';

import { BASE_PATH } from '@/constants';

export function AdUploader() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadFile = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const file = fileInputRef.current?.files?.[0];

            if (!file) return;
            const formData = new FormData();

            formData.append('file', file);

            await fetch(path.join(BASE_PATH, '/api/ad'), {
                method: 'POST',
                body: formData,
            });
        },
        [fileInputRef],
    );

    return (
        <Card>
            <Form onSubmit={uploadFile}>
                <CardBody className='flex flex-row gap-1 p-2'>
                    <h3 className='justify-center'> File Upload</h3>
                    <Input ref={fileInputRef} accept='.zip' className='max-w-[200]' type='file' />
                    <Button className='align-right' color='primary' type='submit'>
                        Upload
                    </Button>
                </CardBody>
            </Form>
        </Card>
    );
}
