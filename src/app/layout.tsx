import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'SFD AI Konsultant — Wirtualny Doradca Suplementów',
  description:
    'Inteligentny asystent zakupowy SFD. Pomogę Ci dobrać suplementy, odpowiem na pytania i złożę koszyk w kilka sekund.',
  keywords: ['SFD', 'suplementy', 'AI', 'konsultant', 'białko', 'spalacz'],
  authors: [{ name: 'SFD S.A.' }],
  openGraph: {
    title: 'SFD AI Konsultant',
    description: 'Wirtualny doradca suplementów diety',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${inter.variable} h-full antialiased`}>
      <head>
        {/* Font Awesome CDN */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
