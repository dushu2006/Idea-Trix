import type { Metadata, Viewport } from 'next';

import '@fontsource-variable/fraunces';
import '@fontsource-variable/fraunces/wght-italic.css';
import '@fontsource-variable/hanken-grotesk';
import '@fontsource-variable/hanken-grotesk/wght-italic.css';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'IDEATRIX — Ideathon by AI & DS × Matrix Club, VIIT',
  description:
    'IDEATRIX is an ideathon by the Department of AI & DS and Matrix Club at VIIT, Visakhapatnam. Teams of up to two present ideas as a PowerPoint. Registration is ₹100 per team.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'IDEATRIX — Turn a problem into a presentable idea',
    description:
      'An ideathon by AI & DS × Matrix Club, VIIT. Teams of up to two, ₹100 per team, PowerPoint presentations.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#F5F0E5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-paper font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
