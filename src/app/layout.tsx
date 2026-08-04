import '@/lib/globals.css';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';

import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { instrumentSerifItalic, instrumentSerifRegular, spaceGrotesk } from '@/lib/fonts';

export const metadata: Metadata = {
    title: 'Karishma',
    description: 'Strategy, taste and code for AI products.',
    applicationName: 'Karishma',
    keywords: ['Karishma', 'AI strategy', 'digital transformation', 'AI product', 'portfolio'],
    openGraph: {
        siteName: 'Karishma',
        title: 'Karishma',
        description: 'Strategy, taste and code for AI products.',
        type: 'website',
        images: ['/preview.png']
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Karishma',
        description: 'Strategy, taste and code for AI products.',
        images: ['/preview.png']
    },
    icons: [
        {
            rel: 'icon',
            type: 'image/svg+xml',
            url: '/favicon/favicon.svg'
        },
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '192x192',
            url: '/favicon/android-chrome-192x192.png'
        },
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '512x512',
            url: '/favicon/android-chrome-512x512.png'
        },
        {
            rel: 'apple-touch-icon',
            url: '/favicon/apple-touch-icon.png'
        },
        {
            rel: 'icon',
            type: 'image/x-icon',
            url: '/favicon/favicon.ico'
        },
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            url: '/favicon/favicon-16x16.png'
        },
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            url: '/favicon/favicon-32x32.png'
        }
    ]
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${spaceGrotesk.className} ${instrumentSerifRegular.variable} ${instrumentSerifItalic.variable}`}>
                <Analytics />
                <SpeedInsights />
                <ThemeProvider attribute="class" defaultTheme="dark" enableColorScheme storageKey="karishma-theme">
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
