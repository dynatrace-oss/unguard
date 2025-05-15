import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import { PropsWithChildren } from 'react';
import { addBasePath } from 'next/dist/client/add-base-path';

import { Providers } from './providers';

import { siteConfig } from '@/config/site';
import { NavigationBar } from '@/components/NavigationBar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    icons: {
        icon: addBasePath('/favicon.ico'),
    },
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
                <link
                    href={addBasePath('/apple-touch-icon-57x57.png')}
                    rel='apple-touch-icon'
                    sizes='57x57'
                    type='image/png'
                />
                <link
                    href={addBasePath('/apple-touch-icon-60x60.png')}
                    rel='apple-touch-icon'
                    sizes='60x60'
                    type='image/png'
                />
                <link
                    href={addBasePath('apple-touch-icon-72x72.png')}
                    rel='apple-touch-icon'
                    sizes='72x72'
                    type='image/png'
                />
                <link
                    href={addBasePath('/apple-touch-icon-76x76.png')}
                    rel='apple-touch-icon'
                    sizes='76x76'
                    type='image/png'
                />
                <link
                    href={addBasePath('/apple-touch-icon-114x114.png')}
                    rel='apple-touch-icon'
                    sizes='114x114'
                    type='image/png'
                />
                <link
                    href={addBasePath('/apple-touch-icon-120x120.png')}
                    rel='apple-touch-icon'
                    sizes='144x144'
                    type='image/png'
                />
                <link
                    href={addBasePath('/apple-touch-icon-152x152.png')}
                    rel='apple-touch-icon'
                    sizes='152x152'
                    type='image/png'
                />
                <link
                    href={addBasePath('/apple-touch-icon-167x167.png')}
                    rel='apple-touch-icon'
                    sizes='167x167'
                    type='image/png'
                />
                <link
                    href={addBasePath('/apple-touch-icon-180x180.png')}
                    rel='apple-touch-icon'
                    sizes='180x180'
                    type='image/png'
                />
                <link color='#ea5455' href={addBasePath('/safari-pinned-tab.svg')} rel='mask-icon' />
                <link href={addBasePath('/android-chrome-192x192.png')} rel='icon' sizes='192x192' type='image/png' />
                <link href={addBasePath('/android-chrome-512x512.png')} rel='icon' sizes='192x192' type='image/png' />
                <link href={addBasePath('/favicon-32x32.png')} rel='icon' sizes='32x32' type='image/png' />
                <link href={addBasePath('/favicon-96x96.png')} rel='icon' sizes='96x96' type='image/png' />
                <link href={addBasePath('/favicon-16x16.png')} rel='icon' sizes='16x16' type='image/png' />
                <link href={addBasePath('/manifest.json')} rel='manifest' />
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
