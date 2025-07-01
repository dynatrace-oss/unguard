'use client';

import { addToast, Button, Card, CardBody, CardFooter, CardHeader, Form, Input, Spinner } from '@heroui/react';
import React, { FormEvent, useCallback, useState } from 'react';

import { PaymentData } from '@/services/PaymentService';
import { usePaymentInfo } from '@/hooks/queries/usePaymentInfo';
import { useUpdatePaymentInfo } from '@/hooks/mutations/useUpdatePaymentInfo';

export interface PaymentFormProps {
    username: string;
}

export function PaymentForm(props: PaymentFormProps) {
    const [errorMsg, setErrorMsg] = useState('');
    const { data: paymentInfo, isLoading } = usePaymentInfo(props.username);

    const handleSuccess = useCallback(() => {
        setErrorMsg('');
        addToast({
            color: 'success',
            title: 'Success',
            description: 'Your Payment Info is now up to date!',
        });
    }, []);

    const handleError = useCallback((error: any) => {
        const errorMessage = error.message || 'Error updating payment data';

        setErrorMsg(errorMessage);
        addToast({
            color: 'danger',
            title: 'Failed to update payment information',
            description: errorMessage,
        });
    }, []);

    const updatePaymentInfo = useUpdatePaymentInfo(props.username, handleSuccess, handleError);

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(e.currentTarget));
            const paymentData: PaymentData = {
                cardHolderName: formData.cardHolderName.toString(),
                cardNumber: formData.cardNumber.toString(),
                expiryDate: formData.expiryDate.toString(),
                cvv: formData.cvv.toString(),
            };

            updatePaymentInfo.mutate(paymentData);
        },
        [updatePaymentInfo],
    );

    if (isLoading) {
        return (
            <Card className='flex items-center justify-center min-h-20'>
                <Spinner />
            </Card>
        );
    }

    return (
        <Card className='p-2 mt-2'>
            <CardHeader>
                <h2 className='mb-2 text-2xl font-extrabold leading-none tracking-tight text-gray-800'>
                    Payment Information
                </h2>
            </CardHeader>
            <Form onSubmit={(e) => handleSubmit(e)}>
                <CardBody>
                    <div className='flex flex-row w-full gap-2'>
                        <div className='mb-4 w-full'>
                            <Input
                                isRequired
                                defaultValue={paymentInfo?.cardHolderName || ''}
                                errorMessage='Please enter the name on the card'
                                label='Name on Card'
                                name='cardHolderName'
                                placeholder='John Doe'
                                type='text'
                                variant='flat'
                            />
                        </div>
                        <div className='mb-4 w-full'>
                            <Input
                                isRequired
                                defaultValue={paymentInfo?.cardNumber || ''}
                                errorMessage='Please enter a valid card number'
                                label='Credit Card Number (16 digits)'
                                name='cardNumber'
                                placeholder='1234567890123456'
                                type='number'
                                validate={(value) => {
                                    if (value.length !== 16) {
                                        return 'Credit Card Number must be 16 digits long';
                                    }
                                }}
                                variant='flat'
                            />
                        </div>
                    </div>
                    <div className='flex flex-row w-full gap-2'>
                        <div className='mb-4 w-full'>
                            <Input
                                isRequired
                                defaultValue={paymentInfo?.expiryDate || ''}
                                errorMessage='Please enter a valid expiration date'
                                label='Expiration Date (MM/YY)'
                                name='expiryDate'
                                pattern='^(0[1-9]|1[0-2])/[0-9]{2}$'
                                placeholder='MM/YY'
                                type='text'
                                variant='flat'
                            />
                        </div>
                        <div className='w-full'>
                            <Input
                                isRequired
                                defaultValue={paymentInfo?.cvv || ''}
                                errorMessage='Please enter a valid CVV'
                                label='CVV (3 digits)'
                                name='cvv'
                                placeholder='123'
                                type='number'
                                validate={(value) => {
                                    if (value.length !== 3) {
                                        return 'CVV must be 3 digits long';
                                    }
                                }}
                                variant='flat'
                            />
                        </div>
                    </div>
                </CardBody>
                <CardFooter className='flex flex-col gap-1'>
                    {errorMsg.length > 0 && <p className='text-red-700 font-bold'>{errorMsg}</p>}
                    <Button color='primary' name='updatePaymentInfo' type='submit'>
                        Update Payment Information
                    </Button>
                </CardFooter>
            </Form>
        </Card>
    );
}
