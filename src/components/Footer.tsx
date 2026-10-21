import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: '60px',
        borderTop: '2px solid var(--ink)',
        padding: '36px 0 48px 0',
        backgroundColor: 'var(--paper-elevated)',
        color: 'var(--ink-soft)',
        fontSize: '0.88rem',
      }}
    >
      <div className="editorial-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
            marginBottom: '32px',
          }}
        >
          <div>
            <h4
              className="font-display"
              style={{ fontSize: '1.2rem', color: 'var(--ink)', marginBottom: '10px', textTransform: 'uppercase' }}
            >
              Rosario En Tiempo Real
            </h4>
            <p style={{ lineHeight: 1.6 }}>
              Diario regional digital y agregador de noticias en directo del Gran Rosario y el Litoral argentino.
            </p>
          </div>

          <div>
            <h5 className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--ink)', marginBottom: '8px', textTransform: 'uppercase' }}>
              Secciones
            </h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 1.8 }}>
              <li><Link href="/categoria/politica" style={{ color: 'inherit', textDecoration: 'none' }}>Política Santafesina</Link></li>
              <li><Link href="/categoria/seguridad" style={{ color: 'inherit', textDecoration: 'none' }}>Seguridad & Ciudad</Link></li>
              <li><Link href="/categoria/economia" style={{ color: 'inherit', textDecoration: 'none' }}>Economía & Puerto</Link></li>
              <li><Link href="/categoria/deportes" style={{ color: 'inherit', textDecoration: 'none' }}>Newell&apos;s y Rosario Central</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--ink)', marginBottom: '8px', textTransform: 'uppercase' }}>
              Herramientas
            </h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 1.8 }}>
              <li><Link href="/redaccion" style={{ color: 'inherit', textDecoration: 'none' }}>Sala de Redacción (Teletipo)</Link></li>
              <li><Link href="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>Panel de Control Editorial</Link></li>
              <li><a href="/api/live" style={{ color: 'inherit', textDecoration: 'none' }}>Feed Server-Sent Events (/api/live)</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--blue-parana)', marginBottom: '8px', textTransform: 'uppercase' }}>
              Compromiso Editorial
            </h5>
            <p style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
              Compromiso con el rigor informativo, la pluralidad de fuentes y la inmediatez regional. Los despachos de agencias conservan su autoría y propiedad intelectual de origen.
            </p>
          </div>
        </div>

        <div className="rule-faint" style={{ margin: '20px 0' }} />

        <div className="font-mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
          <span>© 2026 ROSARIO EN TIEMPO REAL • PERIODISMO DIGITAL INDEPENDIENTE</span>
          <span>REDACCIÓN METROPOLITANA • ROSARIO, SANTA FE, ARGENTINA</span>
        </div>
      </div>
    </footer>
  );
}
