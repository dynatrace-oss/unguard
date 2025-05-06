import { Card } from '@heroui/react';
import { BsExclamationTriangle } from 'react-icons/bs';

interface ErrorCardProps {
    message: string;
}

export function ErrorCard({ message }: ErrorCardProps) {
    return (
        <Card className='w-full flex items-center justify-center min-h-20 text-red-600 font-bold'>
            <BsExclamationTriangle />
            {message}
        </Card>
    );
}
