import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'Mohammad Awais Ansari — Full-Stack Developer',
  description:
    'Computer Science graduate and postgraduate student building AI-powered full-stack web applications and intelligent digital products.',
  keywords: [
    'Mohammad Awais Ansari',
    'Full-Stack Developer',
    'AI Engineer',
    'Next.js',
    'TypeScript',
    'React',
    'PostgreSQL',
    'Software Engineer',
    'Portfolio',
  ],
  authors: [{ name: 'Mohammad Awais Ansari' }],
  openGraph: {
    title: 'Mohammad Awais Ansari — Full-Stack Developer',
    description:
      'Computer Science graduate and postgraduate student building AI-powered full-stack web applications and intelligent digital products.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Mohammad Awais Ansari Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohammad Awais Ansari — Full-Stack Developer',
    description:
      'Computer Science graduate and postgraduate student building AI-powered full-stack web applications and intelligent digital products.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#F7F6F3' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-material="liquid" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#F7F6F3] dark:bg-[#0A0A0A] text-neutral-950 dark:text-[#F5F3EF] antialiased selection:bg-neutral-900 selection:text-white dark:selection:bg-[#F5F3EF] dark:selection:text-neutral-950 transition-colors duration-300"
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
