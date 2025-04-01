'use client';

import { Form, Image, Input, Button, Spacer } from '@heroui/react';
import React, { useState } from 'react';

export function UnguardLogo() {
    return (
        <Image
            alt='Unguard Logo'
            className='justify-content-center'
            height='55'
            src='/ui/unguard_logo_black.svg'
            width='55'
        />
    );
}

async function register(data: any) {
    //TODO
}

function login(data: {}) {
    //TODO
}

export default function LoginRegister() {
    const [isLogin, setIsLogin] = useState(true); //if false, is register

    return (
        <div className='flex flex-col items-center align-items-center justify-center'>
            <Spacer y={6} />
            <UnguardLogo />
            <Spacer y={6} />
            <Form
                className=' w-full max-w-xs flex flex-col gap-4 items-center'
                onSubmit={(e) => {
                    e.preventDefault();
                    let data = Object.fromEntries(new FormData(e.currentTarget));

                    if (isLogin) {
                        login(data);
                    } else {
                        register({ data: data });
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
