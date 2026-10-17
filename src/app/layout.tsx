import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F6F2' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0F19' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Rosario en Tiempo Real | Portal de Noticias & Crónica Fluvial',
  description: 'Plataforma periodística digital e independiente de Rosario y el Gran Rosario. Cobertura en directo las 24 horas, cables fluviales, análisis histórico y seguimiento metropolitano.',
  keywords: [
    'Rosario',
    'Noticias Rosario',
    'Río Paraná',
    'Clásico Rosarino',
    'Newells',
    'Rosario Central',
    'Hidrovía',
    'Belgrano',
    'Urquiza',
    'Puerto Rosario',
  ],
  authors: [{ name: 'Redacción Rosario en Tiempo Real' }],
  metadataBase: new URL('https://rosarioentiempreal.com.ar'),
  openGraph: {
    title: 'Rosario en Tiempo Real | Portal de Noticias & Crónica Fluvial',
    description: 'La velocidad de los cables, la jerarquía de un gran diario y la memoria rebelde de las barrancas.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'Rosario en Tiempo Real',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rosario en Tiempo Real',
    description: 'La velocidad de los cables, la jerarquía de un gran diario y la memoria rebelde de las barrancas.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}

