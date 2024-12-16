import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';
import { TRPCReactProvider } from '~/trpc/react';

import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Create T3 App',
  description: 'Generated by create-t3-app',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html className={GeistSans.variable} lang='en'>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
};

export default RootLayout;
