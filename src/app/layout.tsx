// Global styles
import '@/styles/globals.css';
import '@/styles/matic.css';

// Dependencies
import { Inter } from 'next/font/google';
import { type Metadata } from 'next';

// Components
import { Providers } from '@/app/providers';

import { Layout } from '@/components/global/matic-ds';

import { Main } from '@/components/global/matic-ds';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/global/Footer';
import { Header } from '@/components/global/Header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

/**
 * Metadata for the application
 * This will be used by Next.js for SEO and browser tab information
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata: Metadata = {
  title: 'Matic - Contentful Next.js Starter',
  description: 'Modern content management and digital experiences',
  icons: [{ rel: 'icon', url: '/favicon.ico' }]
};

/**
 * Root layout component that wraps all pages
 * Features:
 * - Applies Inter font
 * - Sets HTML language
 * - Provides global context via Providers component
 *
 * @param children - Page content to be rendered
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Layout className={`${inter.variable}`}>
      <body className="flex flex-col">
        <Providers>
          <Header />
          <Main className="mt-12">{children}</Main>
          <Toaster />
          <Footer />
        </Providers>
      </body>
    </Layout>
  );
}
