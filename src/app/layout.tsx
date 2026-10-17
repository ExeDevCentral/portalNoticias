import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rosario en Tiempo Real | Portal de Noticias & Sala en Vivo',
  description: 'Plataforma periodística digital de alta velocidad e identidad regional. Cobertura en vivo las 24 horas en Rosario y el Gran Rosario.',
  openGraph: {
    title: 'Rosario en Tiempo Real',
    description: 'Portal de noticias y sala de redacción en vivo las 24 horas.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
