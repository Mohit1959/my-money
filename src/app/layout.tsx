import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MuiProviders from '@/components/providers/mui-providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MoMoney',
  description: 'Zero-cost personal finance management using Google Sheets',
  keywords: ['finance', 'personal finance', 'budgeting', 'investment tracking'],
  authors: [{ name: 'MoMoney' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MuiProviders>
          <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {children}
          </div>
        </MuiProviders>
      </body>
    </html>
  );
}
