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
                <title />
            </head>
            <body>
                <Providers
                    themeProps={{ attribute: "class", defaultTheme: "light" }}
                >
                    <div className="relative flex flex-col h-screen">
                        <div className="container mx-auto max-w-7xl pt-16 px-6">
                            <NavigationBar />
                        </div>
                        <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                            {children}
                        </main>
                        <hr />
                        <footer className="w-full flex items-center justify-center py-3">
                            <Footer />
                        </footer>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
