import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap' });

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
    { media: '(prefers-color-scheme: light)', color: '#F1F0EC' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-material="liquid" className={`${jakarta.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='theme';var s=localStorage.getItem(k);var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=s==='dark'||(s!=='light'&&m);var r=document.documentElement;if(d){r.classList.add('dark');r.style.colorScheme='dark';}else{r.classList.remove('dark');r.style.colorScheme='light';}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#F1F0EC] dark:bg-[#0A0A0A] text-[#171717] dark:text-[#F5F3EF] antialiased selection:bg-[#171717] selection:text-white dark:selection:bg-[#F5F3EF] dark:selection:text-neutral-950 transition-colors duration-300"
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
