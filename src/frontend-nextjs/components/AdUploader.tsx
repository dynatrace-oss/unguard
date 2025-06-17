import path from 'path';

import { Button, Card, CardBody, Form, Input } from '@heroui/react';
import { FormEvent, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { BASE_PATH } from '@/constants';
import { QUERY_KEYS } from '@/enums/queryKeys';

export function AdUploader() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

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
            }).then(() => {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ads_list] });
            });
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
