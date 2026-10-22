import type { Metadata, Viewport } from 'next';

import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { JourneyChips } from '@/components/journey/JourneyChips';
import { JourneyProvider } from '@/components/journey/JourneyProvider';
import { JourneyRail } from '@/components/journey/JourneyRail';
import { NeuralScene } from '@/components/neural/NeuralScene';
import './globals.css';

export const metadata: Metadata = {
  title: 'IDEATRIX — Ideathon by AI & DS × Matrix Club, VIIT',
  description:
    'IDEATRIX is an ideathon by the Department of AI & DS and Matrix Club at VIIT, Visakhapatnam. Teams of up to two present ideas as a PowerPoint. Registration is ₹100 per team.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'IDEATRIX — Ideas connect here',
    description:
      'An ideathon by AI & DS × Matrix Club, VIIT. Teams of up to two, ₹100 per team, PowerPoint presentations.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#080F19',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-void font-sans text-mist antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-beam focus:px-4 focus:py-2 focus:font-semibold focus:text-inkbtn"
        >
          Skip to content
        </a>
        <JourneyProvider>
          <NeuralScene />
          <Header />
          <JourneyRail />
          {children}
          <Footer />
          <JourneyChips />
        </JourneyProvider>
      </body>
    </html>
  );
}
