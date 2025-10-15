import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'Chromora - Generador de Paletas de Colores Inteligente',
  description: 'Genera hermosas paletas de colores con IA y herramientas profesionales. Chromora te ayuda a crear esquemas de color perfectos para tus proyectos.',
  keywords: 'colores, paletas, diseño, UI, UX, generador, IA, chroma, next.js, tailwind',
  authors: [{ name: 'Chromora Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="icon" href="/logo_chromora.png" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-dark-carbon text-white antialiased`}>
        <div className="min-h-screen">
          {/* Transición de entrada global */}
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}