'use client';

import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';

import { MEMBERSHIP } from '@/enums/memberships';
import { BlueCheckmarkIcon } from '@/components/BlueCheckmarkIcon';

export function MembershipSelector() {
    const currentMembership = 'FREE'; //TODO: get from API
    const [isSelected, setIsSelected] = useState(currentMembership);

    return (
        <div>
            <Card className='p-8 items-center gap-2'>
                <h1 className='text-3xl font-bold mb-8'>Membership Plans</h1>
                <p className='mb-4'>Pick your desired new membership:</p>
                <div className='flex flex-row gap-8 w-2/3'>
                    <Card
                        isPressable
                        className={`cursor-pointer w-full hover:bg-gray-100 ${isSelected === MEMBERSHIP.FREE ? 'border-2 border-default-800' : ''}`}
                        onPress={() => setIsSelected('FREE')}
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
                        className={`cursor-pointer w-full hover:bg-gray-100 ${isSelected === MEMBERSHIP.PRO ? 'border-2 border-default-800' : ''}`}
                        onPress={() => setIsSelected('PRO')}
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
                <Button className='font-semibold' color='primary'>
                    Update Membership Plan
                </Button>
            </Card>
        </div>
    );
}
