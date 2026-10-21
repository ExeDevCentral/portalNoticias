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
  title: 'Rosario en Tiempo Real | Diario Digital & Monitoreo Metropolitano',
  description: 'Plataforma periodística digital e independiente de Rosario y la región. Información verificada, cables de agencia y cobertura en directo las 24 horas.',
  keywords: [
    'Rosario',
    'Noticias Rosario',
    'Río Paraná',
    'Clásico Rosarino',
    'Newells',
    'Rosario Central',
    'Hidrovía',
    'Puerto Rosario',
    'Monumento a la Bandera',
    'Seguridad Rosario',
  ],
  authors: [{ name: 'Redacción Rosario en Tiempo Real' }],
  metadataBase: new URL('https://rosarioentiempreal.com.ar'),
  openGraph: {
    title: 'Rosario en Tiempo Real | Diario Digital & Monitoreo Metropolitano',
    description: 'Información verificada, cables de agencia y cobertura continua las 24 horas.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'Rosario en Tiempo Real',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rosario en Tiempo Real',
    description: 'Información verificada, cables de agencia y cobertura continua las 24 horas.',
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

