'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HeroOrbital from '../components/HeroOrbital';
import { IconSun, IconMoon, IconArrowRight } from '../components/Icons';

export default function HomePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.dataset.theme = saved;
    } else {
      document.documentElement.dataset.theme = 'dark';
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.dataset.theme = next;
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Barra superior de servicio y metadatos */}
      <div style={{ borderBottom: '1px solid var(--ink-faint)', padding: '6px 0', fontSize: '0.8rem', backgroundColor: 'var(--paper-elevated)' }}>
        <div className="editorial-container font-mono" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--ink-soft)' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ color: 'var(--ink)' }}>ROSARIO, SANTA FE</span>
            <span>•</span>
            <span>VIERNES 17 DE OCTUBRE DE 2026</span>
            <span>•</span>
            <span style={{ color: 'var(--blue-parana)', fontWeight: 600 }}>RÍO PARANÁ: 3.42M (CRECIENDO)</span>
            <span>•</span>
            <span>DÓLAR: $1.240 / $1.260</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>CLIMA: 22°C (VIENTO DEL RÍO)</span>
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                background: 'none',
                border: '1px solid var(--ink-faint)',
                padding: '3px 10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                color: 'var(--ink)',
                borderRadius: '3px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
              }}
            >
              {theme === 'dark' ? (
                <>
                  <IconSun size={12} style={{ color: 'var(--marker-yellow)' }} />
                  <span>MODO DÍA</span>
                </>
              ) : (
                <>
                  <IconMoon size={12} style={{ color: 'var(--blue-parana)' }} />
                  <span>MODO NOCTURNO</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="editorial-container">
        {/* Cabecera Principal del Periódico */}
        <header style={{ textAlign: 'center', padding: '24px 0 12px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--red-urgent)',
                border: '1px solid var(--red-urgent)',
                padding: '2px 8px',
                borderRadius: '2px',
                letterSpacing: '0.1em',
              }}
            >
              PORTAL REGIONAL 24HS
            </span>
            <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', letterSpacing: '0.1em' }}>
              AGREGADOR & SALA DE REDACCIÓN EN VIVO
            </span>
            <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--red-urgent)', fontWeight: 'bold' }}>
              ● CABLES EN DIRECTO
            </span>
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.5rem, 6.5vw, 5.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              margin: '8px 0',
              color: 'var(--ink)',
            }}
          >
            Rosario En Tiempo Real
          </h1>

          <p
            className="font-body"
            style={{
              fontSize: '1.15rem',
              fontStyle: 'italic',
              color: 'var(--ink-soft)',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            "La velocidad de los cables, la jerarquía de un gran diario"
          </p>

          <div className="rule-double" />

          {/* Barra de Navegación del Diario */}
          <nav
            className="font-mono"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 0',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              fontWeight: 600,
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Link href="/" style={{ color: 'var(--ink)', textDecoration: 'none', borderBottom: '2px solid var(--red-urgent)' }}>
                Portada 3D
              </Link>
              <span style={{ color: 'var(--ink-soft)', cursor: 'pointer' }}>Seguridad & Ciudad</span>
              <span style={{ color: 'var(--ink-soft)', cursor: 'pointer' }}>Economía & Puerto</span>
              <span style={{ color: 'var(--ink-soft)', cursor: 'pointer' }}>Fútbol: Newell&apos;s / Central</span>
              <span style={{ color: 'var(--ink-soft)', cursor: 'pointer' }}>Cultura & Noche</span>
            </div>
            <div>
              <Link
                href="/redaccion"
                style={{
                  backgroundColor: 'var(--red-urgent)',
                  color: '#FFFFFF',
                  padding: '5px 14px',
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '3px',
                  boxShadow: '0 2px 8px var(--red-glow)',
                }}
              >
                <span>SALA DE REDACCIÓN EN VIVO</span>
                <IconArrowRight size={13} />
              </Link>
            </div>
          </nav>

          <div className="rule-single" />
        </header>
      </div>

      {/* SECCIÓN HERO ORBITAL 3D CON MICROANIMACIONES Y PARALLAX */}
      <HeroOrbital />

      <div className="editorial-container" style={{ marginTop: '36px' }}>

        {/* Ticker / Fe de Erratas Rotativa */}
        <div
          className="font-mono"
          style={{
            backgroundColor: 'var(--paper-elevated)',
            border: '1px solid var(--ink-faint)',
            padding: '8px 14px',
            fontSize: '0.82rem',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ backgroundColor: 'var(--red-urgent)', color: '#FFF', padding: '1px 6px', fontWeight: 'bold' }}>
            FE DE ERRATAS:
          </span>
          <span style={{ color: 'var(--ink)' }}>
            En la edición de ayer donde dijimos <em>"Las negociaciones avanzan favorablemente"</em>, debió decir <em>"Nadie se habló durante cuatro horas y pidieron medialunas"</em>.
          </span>
        </div>

        {/* Grilla Principal Asimétrica */}
        <main
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'start',
          }}
        >
          {/* Columna Principal: Lead Story (65% del peso visual) */}
          <article style={{ gridColumn: 'span 2' }}>
            <span className="badge-deadpan">SEGÚN FUENTES QUE PREFIEREN NO EXISTIR</span>

            {/* Gesto firma: Titular tachado oficial + Titular satírico */}
            <h2 style={{ margin: '10px 0 16px 0' }}>
              <span className="strikethrough-official">
                Gobierno anuncia histórico paquete de medidas de shock para estabilizar de una vez por todas la economía
              </span>
              <span className="satirical-correction" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
                Autoridades anuncian que seguirán anunciando anuncios hasta que la realidad decida cooperar
              </span>
            </h2>

            {/* Copete periodístico en Newsreader */}
            <p
              style={{
                fontSize: '1.25rem',
                lineHeight: 1.5,
                color: 'var(--ink-soft)',
                marginBottom: '20px',
                borderLeft: '3px solid var(--red-urgent)',
                paddingLeft: '16px',
              }}
            >
              En una conferencia de prensa convocada con carácter de urgencia, los voceros aseguraron que el nuevo plan entrará en vigencia inmediatamente después de que alguien encuentre el archivo en la computadora.
            </p>

            {/* Foto de Prensa Tratada */}
            <div className="press-photo-container" style={{ maxHeight: '420px', marginBottom: '8px' }}>
              <img
                src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80"
                alt="Conferencia oficial de prensa solemne"
                className="press-photo"
                style={{ height: '380px' }}
              />
            </div>
            <div className="press-caption">
              FOTO DE ARCHIVO: Funcionarios observando con seriedad institucional un gráfico que apunta directamente hacia abajo con elegancia geométrica. (Foto: Agencia Prensa Abierta)
            </div>

            {/* Cuerpo de la crónica con método periodístico */}
            <div style={{ marginTop: '20px', fontSize: '1.1rem', lineHeight: 1.7 }}>
              <p style={{ marginBottom: '16px' }}>
                <strong>GINEBRA / BUENOS AIRES (De nuestros enviados especiales).</strong> Con la solemnidad que amerita una catástrofe que ocurre cada quince días, las autoridades gubernamentales presentaron esta mañana el documento titulado <em>"Hacia una certidumbre plausible 2026-2035"</em>, compuesto por ochenta páginas encuadernadas en espiral plástico.
              </p>
              <p style={{ marginBottom: '16px' }}>
                <span className="highlight-marker">
                  "El problema de los planes anteriores no fue su inviabilidad matemática, sino que fueron puestos en práctica en este planeta"
                </span>, explicó un asesor de alto rango que solicitó estricto anonimato porque aún le quedan dos meses de contrato de monotributo.
              </p>
              <p style={{ marginBottom: '16px' }}>
                El acto culminó con un saludo protocolar de cinco segundos y la firma simbólica de una carpeta vacía que luego fue archivada bajo la categoría de asuntos pendientes e inaplazables.
              </p>
            </div>

            <div className="rule-faint" />

            {/* Bloque: Lo Real que es Peor */}
            <div
              style={{
                backgroundColor: 'var(--paper-elevated)',
                border: '1px solid var(--ink-faint)',
                padding: '16px 20px',
                marginTop: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--red-urgent)' }}>
                  LO REAL, QUE ES PEOR:
                </span>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>
                  FUENTE: REUTERS / LA NACIÓN
                </span>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink)', marginBottom: '8px' }}>
                Cable original verídico: <em>"Ministro ratifica metas de inflación del 2% mientras el índice interanual roza el 180% en los registros oficiales."</em>
              </p>
              <a
                href="https://www.reuters.com"
                target="_blank"
                rel="noreferrer"
                className="font-mono"
                style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', textDecoration: 'underline' }}
              >
                ➔ Comparar con el despacho original de prensa oficial
              </a>
            </div>
          </article>

          {/* Columna Lateral: Última Hora & Cables Breves */}
          <aside style={{ borderLeft: '1px solid var(--ink-faint)', paddingLeft: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Última Hora
              </h3>
              <span className="badge-urgent badge-deadpan" style={{ margin: 0 }}>EN VIVO</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Cable 1 */}
              <div style={{ borderBottom: '1px solid var(--ink-faint)', paddingBottom: '16px' }}>
                <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', marginBottom: '4px' }}>
                  15:20 GMT • GEOPOLÍTICA (POR DECIR ALGO)
                </div>
                <h4 style={{ fontSize: '1.15rem', lineHeight: 1.25, marginBottom: '6px' }}>
                  <span className="strikethrough-official" style={{ fontSize: '0.85rem' }}>
                    Cumbre del Clima concluye con histórico acuerdo no vinculante
                  </span>
                  <span className="satirical-correction">
                    Líderes mundiales acuerdan preocuparse con mayor intensidad visual en 2030
                  </span>
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                  Los 190 mandatarios volaron de regreso en 140 jets privados distintos para reflexionar sobre la huella de carbono individual.
                </p>
              </div>

              {/* Cable 2 */}
              <div style={{ borderBottom: '1px solid var(--ink-faint)', paddingBottom: '16px' }}>
                <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', marginBottom: '4px' }}>
                  14:05 GMT • SOCIEDAD & TECNOLOGÍA
                </div>
                <h4 style={{ fontSize: '1.15rem', lineHeight: 1.25, marginBottom: '6px' }}>
                  <span className="strikethrough-official" style={{ fontSize: '0.85rem' }}>
                    Nueva actualización de sistema promete revolucionar la productividad laboral
                  </span>
                  <span className="satirical-correction">
                    Tres millones de empleados pierden la mañana aprendiendo dónde quedó el botón de imprimir
                  </span>
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                  La compañía desarrolladora describió el cambio como <em>"más intuitivo para quien programó la interfaz"</em>.
                </p>
              </div>

              {/* Cable 3 */}
              <div style={{ borderBottom: '1px solid var(--ink-faint)', paddingBottom: '16px' }}>
                <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', marginBottom: '4px' }}>
                  12:45 GMT • ECONOMÍA CASERA
                </div>
                <h4 style={{ fontSize: '1.15rem', lineHeight: 1.25, marginBottom: '6px' }}>
                  <span className="strikethrough-official" style={{ fontSize: '0.85rem' }}>
                    Especialistas recomiendan diversificar cartera de ahorros familiares
                  </span>
                  <span className="satirical-correction">
                    Familia tipo reparte sus últimos tres mil pesos en cuatro bolsillos diferentes
                  </span>
                </h4>
              </div>

              {/* Caja de Promoción de la Sala de Redacción */}
              <div
                style={{
                  border: '2px solid var(--ink)',
                  padding: '16px',
                  backgroundColor: 'var(--paper-elevated)',
                  textAlign: 'center',
                }}
              >
                <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--red-urgent)' }}>
                  TERMINAL DE REDACCIÓN
                </span>
                <h4 className="font-display" style={{ margin: '8px 0', fontSize: '1.2rem' }}>
                  ¿Querés transformar cables del mundo en vivo?
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginBottom: '14px' }}>
                  Buscá noticias internacionales de agencias abiertas y mirá cómo el redactor WebSocket las convierte en periodismo satírico.
                </p>
                <Link
                  href="/redaccion"
                  style={{
                    backgroundColor: 'var(--ink)',
                    color: 'var(--paper)',
                    padding: '8px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    textDecoration: 'none',
                    fontWeight: 700,
                    display: 'block',
                  }}
                >
                  ABRIR SALA DE CABLES ➔
                </Link>
              </div>
            </div>
          </aside>
        </main>

        <div className="rule-double" style={{ marginTop: '48px' }} />

        {/* Footer Institucional */}
        <footer
          className="font-mono"
          style={{
            padding: '20px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'var(--ink-soft)',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <strong>EL DIARIO SERIO</strong> — Publicación periódica de ficción periodística y sátira institucional.
            <br />
            Cualquier parecido con la realidad es negligencia exclusiva de los acontecimientos mundiales.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>AVISO LEGAL</span>
            <span>•</span>
            <span>MANUAL DE ESTILO</span>
            <span>•</span>
            <Link href="/redaccion" style={{ color: 'var(--red-urgent)', textDecoration: 'none', fontWeight: 'bold' }}>
              REDACCIÓN [SYS]
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
