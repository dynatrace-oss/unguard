import { Card } from '@heroui/react';

interface ErrorCardProps {
    message: string;
}

export function ErrorCard({ message }: ErrorCardProps) {
    return (
        <Card className='w-full flex items-center justify-center'>
            <p className='text-red-600 font-bold'>
                <i className='bi bi-exclamation-triangle pr-1' />
                {message}
            </p>
        </Card>
    );
}
