import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ClickSoundProvider } from '@/components/climenda/ClickSoundProvider';
import { ThemeProvider } from '@/components/climenda/ThemeProvider';

export const metadata: Metadata = {
  title: 'Climenda',
  description: 'Realtime weather details and calendar.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <ClickSoundProvider>
            {children}
            <Toaster />
          </ClickSoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
