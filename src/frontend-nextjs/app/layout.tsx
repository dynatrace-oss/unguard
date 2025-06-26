import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import { PropsWithChildren } from 'react';

import { Providers } from './providers';

import { siteConfig } from '@/config/site';
import { NavigationBar } from '@/components/Navbar/NavigationBar';
import { Footer } from '@/components/Footer/Footer';
import { BASE_PATH } from '@/constants';

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
};

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
};

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html suppressHydrationWarning lang='en'>
            <head>
                <title />
                <link color='#ea5455' href={BASE_PATH + '/safari-pinned-tab.svg'} rel='mask-icon' />
                <link href={BASE_PATH + '/manifest.json'} rel='manifest' />
                <meta content='#ea5455' name='msapplication-TileColor' />
                <meta content='ui/ms-icon-144x144.png' name='msapplication-TileImage' />
                <meta content='#ffffff' name='theme-color' />
            </head>

            <body>
                <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
                    <div className='relative flex flex-col h-screen'>
                        <div className='container mx-auto max-w-7xl pt-8 px-6'>
                            <NavigationBar />
                        </div>
                        <main className='container mx-auto max-w-7xl pt-12 px-6 flex-grow p-6 pl-20 pr-20 '>
                            {children}
                        </main>
                        <hr />
                        <footer className='w-full flex items-center justify-center py-3 text-center'>
                            <Footer />
                        </footer>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
