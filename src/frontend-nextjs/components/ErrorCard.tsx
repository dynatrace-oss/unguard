import { Card } from '@heroui/react';
import { BsExclamationTriangle } from 'react-icons/bs';

interface ErrorCardProps {
    message: string;
}

export function ErrorCard({ message }: ErrorCardProps) {
    return (
        <Card className='w-full flex items-center justify-center'>
            <p className='text-red-600 font-bold'>
                <BsExclamationTriangle />
                {message}
            </p>
        </Card>
    );
}
