'use client';

import React, { useState } from 'react';
import { Image, Button, Form, Input, Spacer } from '@heroui/react';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/app/enums/routes';

async function register(data: {}) {
    const res = await fetch('api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    return res;
}

async function login(data: {}) {
    const res = await fetch('api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    //TODO: store JWT

    return res;
}

function getErrorMsg(code: number): string {
    switch (code) {
        case 400:
            return 'Only numbers, underscores, upper- and lowercase letters are allowed in the username.';
        case 401:
            return 'Incorrect username or password';
        case 404:
            return 'Incorrect username or password.';
        case 409:
            return 'User with this username already exists';
        case 500:
            return 'Error registering or logging in.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
}

export default function LoginRegister() {
    const [isLogin, setIsLogin] = useState(true); //if false, is register
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

    return (
        <div className='flex flex-col items-center align-items-center justify-center'>
            <Spacer y={6} />
            <Image
                alt='Unguard Logo'
                className='justify-content-center'
                height='55'
                src='/ui/unguard_logo_black.svg'
                width='55'
            />
            <Spacer y={6} />
            <Form
                className=' w-full max-w-xs flex flex-col gap-4 items-center'
                onSubmit={(e) => {
                    e.preventDefault();
                    let data = Object.fromEntries(new FormData(e.currentTarget));

                    if (isLogin) {
                        login(data).then((res) => {
                            if (!res.ok) {
                                setErrorMsg(getErrorMsg(res.status));
                            } else {
                                setErrorMsg('');
                                router.push(ROUTES.home);
                            }
                        });
                    } else {
                        register(data).then((res) => {
                            if (!res.ok) {
                                setErrorMsg(getErrorMsg(res.status));
                                throw new Error('Error creating new user');
                            } else {
                                setErrorMsg('');
                                login(data).then((res) => {
                                    if (!res.ok) {
                                        setErrorMsg(getErrorMsg(res.status));
                                        throw new Error('Error logging in new user');
                                    } else {
                                        router.push(ROUTES.home);
                                    }
                                });
                            }
                        });
                    }
                }}
            >
                <Input
                    isRequired
                    errorMessage='Please enter a username'
                    label='Username'
                    name='username'
                    type='text'
                    variant='flat'
                />

                <Input
                    isRequired
                    errorMessage='Please enter a password'
                    label='Password'
                    name='password'
                    type='password'
                    variant='flat'
                />
                {errorMsg.length > 0 && <p className='text-red-700 font-bold'>{errorMsg}</p>}
                <div className='flex gap-2'>
                    <Button color='primary' type='submit' onPress={() => setIsLogin(true)}>
                        Login
                    </Button>
                    <Button
                        className='bg-gray-500 text-gray-50'
                        type='submit'
                        variant='flat'
                        onPress={() => setIsLogin(false)}
                    >
                        Sign Up
                    </Button>
                </div>
                <p>Forgot your password? Not our problem!</p>
            </Form>
        </div>
    );
}
