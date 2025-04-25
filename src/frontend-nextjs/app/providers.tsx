'use client';
import type { ThemeProviderProps } from 'next-themes';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { HeroUIProvider } from '@heroui/system';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ToastProvider } from '@heroui/react';

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

const queryClient = new QueryClient();

export function Providers({ children, themeProps }: ProvidersProps) {
    const router = useRouter();

    return (
        <QueryClientProvider client={queryClient}>
            <HeroUIProvider navigate={router.push}>
                <NextThemesProvider {...themeProps}>
                    <ToastProvider />
                    {children}
                </NextThemesProvider>
            </HeroUIProvider>
        </QueryClientProvider>
    );
}
