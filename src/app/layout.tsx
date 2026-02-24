import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ContractStoreProvider } from '@/context/ContractStore';
import { SettingsProvider } from '@/context/SettingsContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Larimar City | CLM Platform',
  description: 'Contract Lifecycle Management for Larimar City & Resort',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen bg-background text-foreground flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SettingsProvider>
            <ContractStoreProvider>
              <DashboardLayout>
                {children}
              </DashboardLayout>
            </ContractStoreProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
