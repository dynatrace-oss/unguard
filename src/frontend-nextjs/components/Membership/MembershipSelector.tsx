'use client';

import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { addToast, Button, Card, CardBody, CardFooter, CardHeader, Form, Spinner } from '@heroui/react';

import { MEMBERSHIP } from '@/enums/memberships';
import { BlueCheckmarkIcon } from '@/components/UserProfile/BlueCheckmarkIcon';
import { useMembership } from '@/hooks/queries/useMembership';
import { useUpdateMembership } from '@/hooks/mutations/useUpdateMembership';

interface MembershipSelectorProps {
    username: string;
}

export function MembershipSelector(props: MembershipSelectorProps) {
    const { data: currentMembership, isLoading } = useMembership(props.username);
    const [isSelected, setIsSelected] = useState(currentMembership);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        setIsSelected(currentMembership);
    }, [currentMembership]);

    const handleSuccess = useCallback(() => {
        setErrorMsg('');
        addToast({
            title: 'Updated Membership Successfully',
            description: `You're ${isSelected == MEMBERSHIP.FREE ? 'on free plan now!' : 'a Pro now!'}`,
            color: 'success',
        });
    }, [isSelected]);

    const handleError = useCallback((error: any) => {
        const errorMessage = error.message || 'Error updating membership plan';

        setErrorMsg(errorMessage);
        addToast({
            color: 'danger',
            title: 'Failed to update membership plan',
            description: errorMessage,
        });
    }, []);

    const updateMembership = useUpdateMembership(props.username, handleSuccess, handleError);

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (isSelected && isSelected !== currentMembership) {
                updateMembership.mutate(isSelected);
            }
        },
        [isSelected, currentMembership],
    );

    if (isLoading) {
        return (
            <Card className='flex items-center justify-center min-h-20 w-full'>
                <Spinner />
            </Card>
        );
    }

    return (
        <Form onSubmit={(e) => handleSubmit(e)}>
            <Card className='p-8 items-center gap-2 w-full'>
                <h1 className='text-3xl font-bold mb-8'>Membership Plans</h1>
                <p className='mb-4'>Pick your desired new membership:</p>
                <div className='flex flex-row gap-8 w-2/3'>
                    <Card
                        isPressable
                        className={`cursor-pointer w-full hover:bg-gray-100 ${isSelected == MEMBERSHIP.FREE ? 'border-2 border-default-800' : ''}`}
                        id='freeMembershipCard'
                        onPress={() => setIsSelected(MEMBERSHIP.FREE)}
                    >
                        <CardHeader className='p-4 text-2xl font-bold text-center bg-gray-300'>
                            <p className='text-center w-full'>{MEMBERSHIP.FREE}</p>
                        </CardHeader>
                        <CardBody className='p-4 gap-2 text-center'>
                            <p className='text-3xl text-default-900 mt-4 mb-4'>
                                $0 <span className='text-xl text-gray-600'>/ mo</span>
                            </p>
                            <p className='text-small text-default-700'>Ads included</p>
                            <p className='text-small text-default-700'>Plenty of vulnerabilities</p>
                        </CardBody>
                    </Card>
                    <Card
                        isPressable
                        className={`cursor-pointer w-full hover:bg-gray-100 ${isSelected == MEMBERSHIP.PRO ? 'border-2 border-default-800' : ''}`}
                        id='proMembershipCard'
                        onPress={() => setIsSelected(MEMBERSHIP.PRO)}
                    >
                        <CardHeader className='p-4 text-2xl font-bold text-center bg-blue-500 text-white'>
                            <div className='flex items-center justify-center gap-2 w-full'>
                                <span>{MEMBERSHIP.PRO}</span>
                                <BlueCheckmarkIcon />
                            </div>
                        </CardHeader>
                        <CardBody className='p-4  gap-2 text-center'>
                            <p className='text-3xl text-default-900 mt-4 mb-4'>
                                $8 <span className='text-xl text-gray-500'>/ mo</span>
                            </p>
                            <p className='text-small text-default-700'>No Ads</p>
                            <p className='text-small text-default-700'>Still a lot of vulnerabilities</p>
                        </CardBody>
                    </Card>
                </div>
                <p className='mt-4 mb-8'>
                    Your current membership state is <i>{currentMembership}</i>.
                </p>
                <CardFooter className='flex flex-col gap-1'>
                    {errorMsg.length > 0 && <p className='text-red-700 font-bold'>{errorMsg}</p>}
                    <Button
                        className='font-semibold'
                        color='primary'
                        isDisabled={currentMembership === isSelected}
                        name='updateMembershipButton'
                        type='submit'
                    >
                        Update Membership Plan
                    </Button>
                </CardFooter>
            </Card>
        </Form>
    );
}
