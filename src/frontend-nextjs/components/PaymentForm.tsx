'use client';

import { addToast, Button, Card, CardBody, CardFooter, CardHeader, Form, Input, Spinner } from '@heroui/react';
import React, { FormEvent, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { ExpirationDateInput } from '@/components/ExpirationDateInput';
import { PaymentData, updatePaymentData } from '@/services/PaymentService';
import { QUERY_KEYS } from '@/enums/queryKeys';
import { usePaymentInfo } from '@/hooks/usePaymentInformation';

export interface PaymentFormProps {
    username: string;
}

export function PaymentForm(props: PaymentFormProps) {
    const queryClient = useQueryClient();
    const [errorMsg, setErrorMsg] = useState('');
    const { data: paymentInfo, isLoading } = usePaymentInfo(props.username);

    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.currentTarget));

        const paymentData: PaymentData = {
            cardHolderName: formData.cardHolderName.toString(),
            cardNumber: formData.cardNumber.toString(),
            expiryDate: formData.expiryDate.toString(),
            cvv: formData.cvv.toString(),
        };

        updatePaymentData(paymentData, props.username).then((res: any) => {
            if (!res.ok) {
                res.json().then((data: any) => {
                    const errorMessage = data.message?.toString() || 'Error updating payment data';

                    setErrorMsg(errorMessage);
                    addToast({
                        color: 'danger',
                        title: 'Failed to update payment information',
                        description: errorMessage,
                    });
                });
            } else {
                setErrorMsg('');
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.payment_data, props.username] }).then(() =>
                    addToast({
                        color: 'success',
                        title: 'Success',
                        description: 'Your Payment Info is now up to date!',
                    }),
                );
            }
        });
    }, []);

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
                                maxLength={16}
                                minLength={16}
                                name='cardNumber'
                                pattern='^[0-9]{16}$'
                                placeholder='1234567890123456'
                                type='text'
                                variant='flat'
                                onInput={(e) => {
                                    const input = e.target as HTMLInputElement;

                                    input.value = input.value.replace(/\D/g, '');
                                }}
                            />
                        </div>
                    </div>
                    <div className='flex flex-row w-full gap-2'>
                        <div className='mb-4 w-full'>
                            <ExpirationDateInput
                                isRequired
                                defaultValue={paymentInfo?.expiryDate || ''}
                                errorMessage='Please enter a valid expiration date'
                                label='Expiration Date (MM/YY)'
                                name='expiryDate'
                                variant='flat'
                            />
                        </div>
                        <div className='w-full'>
                            <Input
                                isRequired
                                defaultValue={paymentInfo?.cvv || ''}
                                errorMessage='Please enter a valid CVV'
                                label='CVV'
                                maxLength={3}
                                minLength={3}
                                name='cvv'
                                pattern='^[0-9]{3}$'
                                placeholder='123'
                                type='text'
                                variant='flat'
                                onInput={(e) => {
                                    const input = e.target as HTMLInputElement;

                                    input.value = input.value.replace(/\D/g, '');
                                }}
                            />
                        </div>
                    </div>
                </CardBody>
                <CardFooter className='flex flex-col gap-1'>
                    {errorMsg.length > 0 && <p className='text-red-700 font-bold'>{errorMsg}</p>}
                    <Button color='primary' type='submit'>
                        Update Payment Information
                    </Button>
                </CardFooter>
            </Form>
        </Card>
    );
}
