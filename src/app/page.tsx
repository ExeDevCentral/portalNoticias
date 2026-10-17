'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HeroOrbital from '../components/HeroOrbital';
import CronicasRosarinas, { RosarioSection } from '../components/CronicasRosarinas';
import { IconSun, IconMoon, IconArrowRight } from '../components/Icons';

const sectionToStoryIndex: Record<RosarioSection, number> = {
  portada: 0,
  seguridad: 1,
  futbol: 2,
  economia: 3,
  cultura: 4,
};

const storyIndexToSection: Record<number, RosarioSection> = {
  0: 'portada',
  1: 'seguridad',
  2: 'futbol',
  3: 'economia',
  4: 'cultura',
};

const NAV_ITEMS: { key: RosarioSection; label: string }[] = [
  { key: 'portada', label: 'Portada 3D' },
  { key: 'seguridad', label: 'Seguridad & Ciudad' },
  { key: 'economia', label: 'Economía & Puerto' },
  { key: 'futbol', label: "Fútbol: Newell's / Central" },
  { key: 'cultura', label: 'Cultura & Noche' },
];

export default function HomePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [selectedSection, setSelectedSection] = useState<RosarioSection>('portada');

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

  const handleSelectSection = (section: RosarioSection) => {
    setSelectedSection(section);
  };

  const handleStoryChange = (index: number) => {
    const nextSection = storyIndexToSection[index];
    if (nextSection) {
      setSelectedSection(nextSection);
    }
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
              PAGO DE LOS ARROYOS & HISTORIA VIVA
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
            &ldquo;La velocidad de los cables, la jerarquía de un gran diario y la memoria rebelde de las barrancas&rdquo;
          </p>

          <div className="rule-double" />

          {/* Barra de Navegación Interactiva del Diario */}
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
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              {NAV_ITEMS.map((item) => {
                const isSelected = selectedSection === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleSelectSection(item.key)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '6px 0',
                      color: isSelected ? 'var(--ink)' : 'var(--ink-soft)',
                      borderBottom: isSelected ? '2px solid var(--red-urgent)' : '2px solid transparent',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                      fontWeight: isSelected ? 700 : 500,
                      textTransform: 'uppercase',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
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
      <HeroOrbital
        selectedIndex={sectionToStoryIndex[selectedSection]}
        onStoryChange={handleStoryChange}
      />

      <div className="editorial-container" style={{ marginTop: '36px' }}>

        {/* Ticker / Fe de Erratas Rotativa de Rosario */}
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
            En la edición de ayer donde dijimos <em>&ldquo;Un vecino porteño afirmó que el río Paraná es marrón y sin encanto&rdquo;</em>, debió decir <em>&ldquo;El susodicho fue escoltado pacíficamente de vuelta a la Autopista a Buenos Aires sin derecho a despedirse del carlitos&rdquo;</em>.
          </span>
        </div>

        {/* SISTEMA DE CRÓNICAS HISTÓRICAS & MANUAL AL PASO (BELGRANO, URQUIZA & CLUBS) */}
        <CronicasRosarinas
          activeSection={selectedSection}
          onSelectSection={handleSelectSection}
        />

        {/* Grilla Principal Asimétrica */}
        <main
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'start',
            marginTop: '20px',
          }}
        >
          {/* Columna Principal: Lead Story (65% del peso visual) */}
          <article style={{ gridColumn: 'span 2' }}>
            <span className="badge-deadpan">INFORME ESPECIAL • PAGO DE LOS ARROYOS</span>

            {/* Gesto firma: Titular tachado oficial + Titular satírico */}
            <h2 style={{ margin: '10px 0 16px 0' }}>
              <span className="strikethrough-official">
                Historiadores sugieren que Rosario pudo haber sido la tranquila capital federal de una república pacífica y previsible
              </span>
              <span className="satirical-correction" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
                Urquiza y Belgrano confirman desde la eternidad que la insubordinación cívica y el clásico del domingo fueron la única opción razonable
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
              Desde las barrancas donde don Manuel desobedeció a Buenos Aires izando dos paños de cielo hasta las terminales portuarias que cargan cincuenta millones de toneladas de cereal, la ciudad continúa su pacto secreto: alimentar a la nación mientras reniega cortésmente de su burocracia centralista.
            </p>

            {/* Foto de Prensa Tratada */}
            <div className="press-photo-container" style={{ maxHeight: '420px', marginBottom: '8px' }}>
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
                alt="Barrancas del Paraná frente a Rosario al atardecer"
                className="press-photo"
                style={{ height: '380px' }}
              />
            </div>
            <div className="press-caption">
              REGISTRO GRÁFICO: El río Paraná en su curso majestuoso frente a Rosario. A la izquierda, la memoria de las baterías de Belgrano; a lo lejos, las siluetas de buques graneleros aguardando turno en la Hidrovía. (Foto: Archivo Histórico Editorial)
            </div>

            {/* Cuerpo de la crónica con método periodístico */}
            <div style={{ marginTop: '20px', fontSize: '1.1rem', lineHeight: 1.7 }}>
              <p style={{ marginBottom: '16px' }}>
                <strong>ROSARIO (De nuestra Redacción en las Barrancas).</strong> Ningún conquistador con capa y espada pisó jamás este suelo para clavar una cruz fundacional. Rosario es hija natural de la conveniencia ribereña, el trueque ganadero y la irrevocable sospecha de que cualquier orden emanada de Buenos Aires requiere al menos dos semanas de análisis escéptico antes de ser ignorada con caballerosidad.
              </p>
              <p style={{ marginBottom: '16px' }}>
                <span className="highlight-marker">
                  &ldquo;A don Bernardino Rivadavia le daba taquicardia que tuviésemos bandera propia; a don Bartolomé Mitre le daba urticaria que tuviésemos puerto ultramarino&rdquo;
                </span>, reflexiona un habitué de la esquina de Córdoba y San Martín mientras remueve un cortado con la cucharita de alpaca. &ldquo;Nos vetaron la capital tres veces por miedo a que el país se gobernara mirando al agua dulce en lugar de mirar a Europa&rdquo;.
              </p>
              <p style={{ marginBottom: '16px' }}>
                El resultado es este milagro laico: una metrópoli de un millón y medio de habitantes que no le reza a los próceres porteños, que inventó su propio sándwich con ketchup caliente y que resuelve todas sus angustias existenciales cada seis meses en una cancha de fútbol dividida en dos mitades irreconciliables.
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
                  FUENTE: BOLSA DE COMERCIO DE ROSARIO & HISTORIA CONSTITUCIONAL
                </span>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink)', marginBottom: '8px' }}>
                Dato verídico: <em>El Congreso Nacional sancionó por ley la designación de Rosario como Capital Federal de la República en 1868, 1869 y 1873. El presidente Bartolomé Mitre la vetó la primera vez; Domingo Faustino Sarmiento la vetó en las dos ocasiones siguientes alegando razones de seguridad portuaria.</em>
              </p>
              <a
                href="https://www.bcr.com.ar"
                target="_blank"
                rel="noreferrer"
                className="font-mono"
                style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', textDecoration: 'underline' }}
              >
                ➔ Consultar archivo documental en la Bolsa de Comercio de Rosario
              </a>
            </div>
          </article>

          {/* Columna Lateral: Última Hora & Cables Breves */}
          <aside style={{ borderLeft: '1px solid var(--ink-faint)', paddingLeft: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Cables Rosarinos
              </h3>
              <span className="badge-urgent badge-deadpan" style={{ margin: 0 }}>EN VIVO</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Cable 1 */}
              <div style={{ borderBottom: '1px solid var(--ink-faint)', paddingBottom: '16px' }}>
                <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', marginBottom: '4px' }}>
                  16:20 GMT • PUERTO & HIDROVÍA
                </div>
                <h4 style={{ fontSize: '1.15rem', lineHeight: 1.25, marginBottom: '6px' }}>
                  <span className="strikethrough-official" style={{ fontSize: '0.85rem' }}>
                    Aduana central promete agilizar trámites en 72 días hábiles
                  </span>
                  <span className="satirical-correction">
                    Cincuenta buques Panamax cargan soja en San Lorenzo mientras el capitán griego pide un carlitos tostado
                  </span>
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                  Las terminales del cordón industrial completaron la carga en tiempo récord al ritmo de cumbia santafesina.
                </p>
              </div>

              {/* Cable 2 */}
              <div style={{ borderBottom: '1px solid var(--ink-faint)', paddingBottom: '16px' }}>
                <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', marginBottom: '4px' }}>
                  15:45 GMT • ANILLO DIGITAL & SEGURIDAD
                </div>
                <h4 style={{ fontSize: '1.15rem', lineHeight: 1.25, marginBottom: '6px' }}>
                  <span className="strikethrough-official" style={{ fontSize: '0.85rem' }}>
                    Centro de monitoreo implementa reconocimiento biométrico de alta fidelidad
                  </span>
                  <span className="satirical-correction">
                    Cámaras con IA confunden a hincha de Newell&apos;s con uno de Central por idéntica cara de sufrimiento previo al clásico
                  </span>
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                  El algoritmo municipal determinó que el nivel de estrés coronario en ambos simpatizantes era estadísticamente indistinguible.
                </p>
              </div>

              {/* Cable 3 */}
              <div style={{ borderBottom: '1px solid var(--ink-faint)', paddingBottom: '16px' }}>
                <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', marginBottom: '4px' }}>
                  14:10 GMT • MANUAL PARA EXTRANJEROS
                </div>
                <h4 style={{ fontSize: '1.15rem', lineHeight: 1.25, marginBottom: '6px' }}>
                  <span className="strikethrough-official" style={{ fontSize: '0.85rem' }}>
                    Turista confiesa que simpatiza con un equipo porteño durante un asado familiar
                  </span>
                  <span className="satirical-correction">
                    Mesa entera guarda silencio piadoso y le convida otra porción de costillar por caridad humana
                  </span>
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                  El incidente culminó sin heridos tras una explicación didáctica de tres horas sobre el partido de los leprosos de 1920.
                </p>
              </div>

              {/* Despacho de Cables & Teletipo */}
              <div
                style={{
                  border: '2px solid var(--ink)',
                  padding: '16px',
                  backgroundColor: 'var(--paper-elevated)',
                  textAlign: 'center',
                }}
              >
                <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--red-urgent)' }}>
                  SERVICIO DE TELETIPO 24HS
                </span>
                <h4 className="font-display" style={{ margin: '8px 0', fontSize: '1.2rem' }}>
                  Despachos Fluviales & Regionales
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginBottom: '14px' }}>
                  Flujo ininterrumpido de cables de agencias, cotizaciones del puerto y novedades metropolitanas.
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
                  ABRIR TERMINAL DE CABLES ➔
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
            <strong>ROSARIO EN TIEMPO REAL</strong> — Crónica histórica, sala de redacción en vivo y memoria del Pago de los Arroyos.
            <br />
            Homenaje perpetuo a don Manuel Belgrano, don Justo José de Urquiza y la Mesa de los Galanes.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              type="button"
              onClick={() => handleSelectSection('futbol')}
              style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
            >
              MANUAL DE CLUBES
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleSelectSection('portada')}
              style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
            >
              BELGRANO 1812
            </button>
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

