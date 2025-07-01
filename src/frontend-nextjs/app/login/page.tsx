'use client';
import path from 'path';

import React, { useState } from 'react';
import { Image, Button, Form, Input, Spacer, addToast } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/enums/queryKeys';
import { useNavigation } from '@/hooks/useNavigation';
import { BASE_PATH } from '@/constants';

async function authenticateUser(path: string, data: {}): Promise<Response> {
    return await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
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
    const { navigateToHomePage } = useNavigation();
    const queryClient = useQueryClient();

    function handleLogin(res: Response) {
        if (!res.ok) {
            setErrorMsg(getErrorMsg(res.status));
            throw new Error('Error logging in');
        } else {
            setErrorMsg('');
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.isLoggedIn] }).then(() => navigateToHomePage());
        }
    }

    function handleRegister(res: Response, data: {}) {
        if (!res.ok) {
            setErrorMsg(getErrorMsg(res.status));
            throw new Error('Error registering user');
        } else {
            setErrorMsg('');
            authenticateUser(path.join(BASE_PATH, '/api/auth/login'), data).then((res) => handleLogin(res));
        }
    }

    return (
        <div className='flex flex-col items-center align-items-center justify-center'>
            <Spacer y={6} />
            <Image
                alt='Unguard Logo'
                className='justify-content-center'
                height='55'
                src={path.join(BASE_PATH, '/unguard_logo_black.svg')}
                width='55'
            />
            <Spacer y={6} />
            <Form
                className=' w-full max-w-xs flex flex-col gap-4 items-center'
                onSubmit={(e) => {
                    e.preventDefault();
                    let data = Object.fromEntries(new FormData(e.currentTarget));

                    if (isLogin) {
                        authenticateUser(path.join(BASE_PATH, '/api/auth/login'), data)
                            .then((res) => handleLogin(res))
                            .then(() => addToast({ title: 'Login successful', description: 'Welcome back!' }))
                            .catch(() => {
                                addToast({ title: 'Login failed', description: 'Please try again!' });
                            });
                    } else {
                        authenticateUser(path.join(BASE_PATH, '/api/auth/register'), data)
                            .then((res) => handleRegister(res, data))
                            .then(() => addToast({ title: 'Register successful', description: 'Welcome to Unguard!' }))
                            .catch(() => {
                                addToast({ title: 'Sign-in failed', description: 'Please try again!' });
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
                    <Button color='primary' name='login' type='submit' onPress={() => setIsLogin(true)}>
                        Login
                    </Button>
                    <Button
                        className='bg-gray-500 text-gray-50'
                        name='register'
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
