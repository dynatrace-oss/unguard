'use client';

import type { ThemeProviderProps } from 'next-themes';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { HeroUIProvider } from '@heroui/system';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useState } from 'react';
import { ToastProvider } from '@heroui/react';

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
    const router = useRouter();
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <HeroUIProvider navigate={router.push}>
                <ToastProvider toastProps={{ color: 'primary' }} />
                <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
            </HeroUIProvider>
        </QueryClientProvider>
    );
}
