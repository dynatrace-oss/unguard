import "@/styles/globals.css";
import { Metadata, Viewport } from "next";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    icons: {
        icon: "favicon.ico",
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html suppressHydrationWarning lang="en">
        <head>
            <title/>
            <link rel="apple-touch-icon" href="/ui/apple-touch-icon-57x57.png" type="image/png" sizes="57x57"/>
            <link rel="apple-touch-icon" href="/ui/apple-touch-icon-60x60.png" type="image/png" sizes="60x60"/>
            <link rel="apple-touch-icon" href="/ui/apple-touch-icon-72x72.png" type="image/png" sizes="72x72"/>
            <link rel="apple-touch-icon" href="/ui/apple-touch-icon-76x76.png" type="image/png" sizes="76x76"/>
            <link rel="apple-touch-icon" href="/ui/apple-touch-icon-114x114.png" type="image/png" sizes="114x114"/>
            <link rel="apple-touch-icon" href="/ui/apple-touch-icon-120x120.png" type="image/png" sizes="144x144"/>
            <link rel="apple-touch-icon" href="/ui/apple-touch-icon-152x152.png" type="image/png" sizes="152x152"/>
            <link rel="apple-touch-icon" href="/ui/apple-touch-icon-167x167.png" type="image/png" sizes="167x167"/>
            <link rel="apple-touch-icon" href="/ui/apple-touch-icon-180x180.png" type="image/png" sizes="180x180"/>
            <link rel="apple-touch-icon" sizes="57x57" href="ui/apple-icon-57x57.png" type="image/png" />
            <link rel="apple-touch-icon" sizes="60x60" href="/ui/apple-icon-60x60.png" type="image/png" />
            <link rel="apple-touch-icon" sizes="72x72" href="/ui/apple-icon-72x72.png" type="image/png" />
            <link rel="apple-touch-icon" sizes="76x76" href="/ui/apple-icon-76x76.png" type="image/png" />
            <link rel="apple-touch-icon" sizes="114x114" href="/ui/apple-icon-114x114.png" type="image/png" />
            <link rel="apple-touch-icon" sizes="120x120" href="/ui/apple-icon-120x120.png" type="image/png" />
            <link rel="apple-touch-icon" sizes="144x144" href="/ui/apple-icon-144x144.png" type="image/png" />
            <link rel="apple-touch-icon" sizes="152x152" href="/ui/apple-icon-152x152.png" type="image/png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/ui/apple-icon-180x180.png" type="image/png" />
            <link rel="mask-icon" href="/ui/safari-pinned-tab.svg" color="#ea5455"/>
            <link rel="icon" type="image/png" sizes="192x192" href="/ui/android-icon-192x192.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/ui/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="96x96" href="/ui/favicon-96x96.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/ui/favicon-16x16.png"/>
            <link rel="manifest" href="/ui/manifest.json"/>
            <meta name="msapplication-TileColor" content="#ea5455"/>
            <meta name="msapplication-TileImage" content="ui/ms-icon-144x144.png"/>
            <meta name="theme-color" content="#ffffff"/>
        </head>
        <body>
        <Providers
            themeProps={{attribute: "class", defaultTheme: "light"}}
        >
            <div className="relative flex flex-col h-screen">
                <div className="container mx-auto max-w-7xl pt-16 px-6">
                    <NavigationBar/>
                </div>
                <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                    {children}
                </main>
                <hr/>
                <footer className="w-full flex items-center justify-center py-3">
                    <Footer/>
                </footer>
            </div>
        </Providers>
        </body>
        </html>
    );
}
