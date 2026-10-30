import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import './editorial.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { absoluteUrl, isPreview, site } from '@/lib/site';

const jakarta = localFont({ src: '../public/fonts/plus-jakarta-sans.ttf', weight: '200 800', variable: '--font-jakarta', display: 'swap' });
const jetBrainsMono = localFont({ src: '../public/fonts/jetbrains-mono.ttf', weight: '100 800', variable: '--font-jetbrains-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  openGraph: {
    title: site.title,
    description: site.description,
    url: absoluteUrl('/'),
    type: 'website',
    locale: 'en_US',
    siteName: `${site.name} Portfolio`,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
    images: [{ url: absoluteUrl('/opengraph-image'), alt: `${site.name} — Developer Portfolio` }],
  },
  robots: {
    index: !isPreview,
    follow: true,
    googleBot: { index: !isPreview, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
};
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0D0F10' },
    { media: '(prefers-color-scheme: light)', color: '#F7F6F2' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetBrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script src="/arcade.js" async />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='theme';var s=localStorage.getItem(k);var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=s==='dark'||(s!=='light'&&m);var r=document.documentElement;if(d){r.classList.add('dark');r.style.colorScheme='dark';}else{r.classList.remove('dark');r.style.colorScheme='light';}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#F7F6F2] dark:bg-[#0D0F10] text-[#171717] dark:text-[#F5F3EF] antialiased selection:bg-[#171717] selection:text-white dark:selection:bg-[#F5F3EF] dark:selection:text-neutral-950 transition-colors duration-300"
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
