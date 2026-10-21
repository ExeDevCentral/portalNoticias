'use client';

import React, { useState } from 'react';
import {
  IconFeather,
  IconQuote,
  IconShield,
  IconBook,
  IconAnchor,
} from './Icons';

export type RosarioSection = 'portada' | 'seguridad' | 'economia' | 'futbol' | 'cultura';

interface CronicasRosarinasProps {
  activeSection: RosarioSection;
  onSelectSection: (section: RosarioSection) => void;
}

type DossierTab = 'panoramica' | 'barrancas' | 'puerto' | 'antropologia';

const CRONICA_TABS: { key: RosarioSection; label: string }[] = [
  { key: 'portada', label: '1812: Barrancas' },
  { key: 'seguridad', label: 'Seguridad & Ciudad' },
  { key: 'economia', label: '1852: Puerto Libre' },
  { key: 'futbol', label: 'Manual Fútbol' },
  { key: 'cultura', label: 'Pichincha & Noche' },
];

const DOSSIER_TABS: { key: DossierTab; label: string }[] = [
  { key: 'panoramica', label: 'Visión Comparativa' },
  { key: 'barrancas', label: 'Dossier Barrancas (1812)' },
  { key: 'puerto', label: 'Dossier Puerto Libre (1852)' },
  { key: 'antropologia', label: 'Ensayo Antropológico' },
];

function renderDossierIcon(key: DossierTab) {
  switch (key) {
    case 'panoramica':
      return <IconFeather size={12} />;
    case 'barrancas':
      return <IconBook size={12} />;
    case 'puerto':
      return <IconAnchor size={12} />;
    case 'antropologia':
      return <IconShield size={12} />;
  }
}

export default function CronicasRosarinas({
  activeSection,
  onSelectSection,
}: Readonly<CronicasRosarinasProps>) {
  const [dossierTab, setDossierTab] = useState<DossierTab>('panoramica');

  return (
    <section id="cronicas-rosarinas" style={{ marginTop: '40px' }}>
      {/* Encabezado del Sistema Editorial */}
      <div
        style={{
          borderTop: '2px solid var(--ink)',
          borderBottom: '1px solid var(--ink-faint)',
          padding: '16px 0',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div
            className="font-mono"
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--red-urgent)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <IconFeather size={13} />
            <span>CRÓNICAS HISTÓRICAS & MEMORIA REGIONAL</span>
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Crónicas del Pago de los Arroyos
          </h2>
          <p
            className="font-body"
            style={{
              fontSize: '1rem',
              color: 'var(--ink-soft)',
              fontStyle: 'italic',
              margin: '4px 0 0 0',
            }}
          >
            Memoria fluvial, desacato cívico y el destino federal forjado en las barrancas del Paraná.
          </p>
        </div>

        {/* Selector de Crónica Rápida */}
        <div
          className="font-mono"
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {CRONICA_TABS.map((tab) => {
            const isActive = activeSection === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onSelectSection(tab.key)}
                style={{
                  background: isActive ? 'var(--ink)' : 'var(--paper-elevated)',
                  color: isActive ? 'var(--paper)' : 'var(--ink)',
                  border: '1px solid var(--ink-faint)',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: '2px',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.04em',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          BLOQUE DE PROFUNDIDAD HISTÓRICA & ANTROPOLÓGICA: BARRANCAS (1812) Y PUERTO LIBRE (1852)
         ========================================================================= */}
      <div
        style={{
          border: '1px solid var(--ink-faint)',
          backgroundColor: 'var(--paper-elevated)',
          padding: '24px',
          marginBottom: '36px',
        }}
      >
        {/* Cabecera del Dossier Académico-Literario */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--ink-faint)',
            paddingBottom: '14px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <span
              className="font-mono"
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--blue-parana)',
                letterSpacing: '0.08em',
              }}
            >
              INVESTIGACIÓN HISTÓRICA & ANTROPOLÓGICA
            </span>
            <h3
              className="font-display"
              style={{
                fontSize: '1.45rem',
                margin: '4px 0 0 0',
                fontWeight: 800,
              }}
            >
              Los Dos Hitos Fundacionales: Las Barrancas (1812) y El Puerto Libre (1852)
            </h3>
          </div>

          {/* Pestañas del Dossier */}
          <div className="font-mono" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {DOSSIER_TABS.map((tab) => {
              const isCurrent = dossierTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setDossierTab(tab.key)}
                  style={{
                    backgroundColor: isCurrent ? 'var(--ink)' : 'var(--paper)',
                    color: isCurrent ? 'var(--paper)' : 'var(--ink-soft)',
                    border: '1px solid var(--ink-faint)',
                    padding: '5px 12px',
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    fontWeight: isCurrent ? 700 : 500,
                    borderRadius: '2px',
                    transition: 'all 0.15s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {renderDossierIcon(tab.key)}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENIDO 1: VISIÓN COMPARATIVA PANORÁMICA */}
        {dossierTab === 'panoramica' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Tarjeta Barrancas */}
            <div
              style={{
                backgroundColor: 'var(--paper)',
                border: '1px solid var(--ink-faint)',
                borderTop: '4px solid var(--blue-parana)',
                padding: '20px',
              }}
            >
              <div
                className="font-mono"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                  color: 'var(--blue-parana)',
                  fontWeight: 700,
                  marginBottom: '8px',
                }}
              >
                <span>LA DIMENSIÓN ÉTICA Y SIMBÓLICA (1812)</span>
                <span>BARRANCAS DEL PARANÁ</span>
              </div>
              <h4 className="font-display" style={{ fontSize: '1.2rem', margin: '0 0 8px 0' }}>
                Las Barrancas de 1812: El símbolo sin linaje colonial
              </h4>
              <p className="font-body" style={{ fontSize: '0.96rem', lineHeight: 1.6, color: 'var(--ink-soft)', margin: 0 }}>
                En una comarca ribereña sin cabildo formal, las tropas y los vecinos comprendieron que un ejército patriota no podía luchar con estandartes ajenos. La creación de la enseña nacional en las barrancas y la firme negativa a esconderla tras la amonestación del Triunvirato legaron a Rosario su rasgo primordial: <em>la legitimidad del desacato cuando la causa es justa</em>.
              </p>
              <div
                className="font-mono"
                style={{
                  marginTop: '14px',
                  paddingTop: '10px',
                  borderTop: '1px dashed var(--ink-faint)',
                  fontSize: '0.74rem',
                  color: 'var(--ink)',
                }}
              >
                <strong>Hito antropológico:</strong> Juramento civil ante vecinos y milicianos el 27 de febrero de 1812.
              </div>
            </div>

            {/* Tarjeta Puerto Libre */}
            <div
              style={{
                backgroundColor: 'var(--paper)',
                border: '1px solid var(--ink-faint)',
                borderTop: '4px solid var(--amber-alert)',
                padding: '20px',
              }}
            >
              <div
                className="font-mono"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                  color: 'var(--amber-alert)',
                  fontWeight: 700,
                  marginBottom: '8px',
                }}
              >
                <span>LA DIMENSIÓN GEOPOLÍTICA & ECONÓMICA (1852)</span>
                <span>CONFEDERACIÓN ARGENTINA</span>
              </div>
              <h4 className="font-display" style={{ fontSize: '1.2rem', margin: '0 0 8px 0' }}>
                El Puerto Libre de 1852: La apertura rebelde y la metrópoli autoforjada
              </h4>
              <p className="font-body" style={{ fontSize: '0.96rem', lineHeight: 1.6, color: 'var(--ink-soft)', margin: 0 }}>
                En 1852, un decreto federal elevó a la modesta Villa a la jerarquía de Ciudad y puerto de ultramar para disputar la exclusividad aduanera porteña. La postergación de Rosario como Capital de la República (tres veces sancionada por el Congreso y tres veces vetada por Mitre y Sarmiento) consolidó la doctrina de Nicasio Oroño: <em>Rosario, hija de su propio esfuerzo</em>.
              </p>
              <div
                className="font-mono"
                style={{
                  marginTop: '14px',
                  paddingTop: '10px',
                  borderTop: '1px dashed var(--ink-faint)',
                  fontSize: '0.74rem',
                  color: 'var(--ink)',
                }}
              >
                <strong>Hito antropológico:</strong> Ley de Derechos Diferenciales de 1854 y apertura directa al comercio atlántico.
              </div>
            </div>
          </div>
        )}

        {/* CONTENIDO 2: DOSSIER PROFUNDO BARRANCAS 1812 */}
        {dossierTab === 'barrancas' && (
          <div style={{ backgroundColor: 'var(--paper)', padding: '22px', border: '1px solid var(--ink-faint)' }}>
            <div className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--blue-parana)', fontWeight: 700, marginBottom: '6px' }}>
              EL DESACATO ÉTICO EN EL PAGO DE LOS ARROYOS (FEBRERO DE 1812)
            </div>
            <h4 className="font-display" style={{ fontSize: '1.5rem', margin: '0 0 12px 0' }}>
              La invención de un símbolo en una orilla sin cabildo: antropología del juramento
            </h4>
            <div style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--ink-soft)' }}>
              <p style={{ marginBottom: '14px' }}>
                A diferencia de Santa Fe la Vieja o Buenos Aires, el caserío de la Capilla del Rosario no poseía acta de fundación real ni linaje de encomenderos. Hacia febrero de 1812, cuando el destacamento patriota arribó con el encargo de vigilar los corsarios realistas que bajaban desde Montevideo, encontró un poblado de hacendados, troperos y pescadores sin escudo aristocrático.
              </p>
              <div
                style={{
                  borderLeft: '3px solid var(--blue-parana)',
                  paddingLeft: '16px',
                  margin: '18px 0',
                  fontStyle: 'italic',
                  color: 'var(--ink)',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ color: 'var(--blue-parana)', flexShrink: 0, marginTop: '2px' }}>
                  <IconQuote size={18} />
                </div>
                <div>
                  &ldquo;Siendo preciso enarbolar bandera y no teniéndola, la mandé hacer blanca y celeste, conforme a los colores de la escarapela nacional. Espero que sea de la aprobación de Vuestra Excelencia.&rdquo;
                  <div className="font-mono" style={{ fontSize: '0.75rem', fontStyle: 'normal', color: 'var(--ink-soft)', marginTop: '4px' }}>
                    — Despacho oficial remitido desde la Batería Libertad al Primer Triunvirato, 27 de febrero de 1812.
                  </div>
                </div>
              </div>
              <p style={{ marginBottom: '14px' }}>
                La respuesta de Bernardino Rivadavia y el Triunvirato (3 de marzo de 1812) fue fulminante: ordenaron destruir la bandera o sepultarla bajo reserva por prudencia ante la diplomacia británica, que aún exigía sostener la ficción de fidelidad a Fernando VII. Para cuando el correo porteño llegó al Paraná, la tropa patriota ya marchaba al mando del Ejército del Norte. Al enterarse meses después en Jujuy, el coronel en jefe respondió con una dignidad epistolar que aún resuena: <em>«La guardaré silenciosamente para enarbolarla el día de una gran victoria»</em>.
              </p>
              <p style={{ margin: 0 }}>
                <strong>Lectura antropológica:</strong> Rosario adoptó este momento fundante como una liturgia cónica laica. Cosme Maciel izando el paño, María Catalina Echeverría de Vidal cosiéndolo en su hogar y el pueblo en silencio frente a las islas del Espinillo fundaron una memoria basada no en la obediencia cortesana, sino en la audacia civil comunitaria.
              </p>
            </div>
          </div>
        )}

        {/* CONTENIDO 3: DOSSIER PROFUNDO PUERTO DE LA CONFEDERACIÓN 1852 */}
        {dossierTab === 'puerto' && (
          <div style={{ backgroundColor: 'var(--paper)', padding: '22px', border: '1px solid var(--ink-faint)' }}>
            <div className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--amber-alert)', fontWeight: 700, marginBottom: '6px' }}>
              EL PUERTO FEDERAL DE LA CONFEDERACIÓN (1852–1873)
            </div>
            <h4 className="font-display" style={{ fontSize: '1.5rem', margin: '0 0 12px 0' }}>
              La geopolítica del río abierto y la capital que la oligarquía vetó tres veces
            </h4>
            <div style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--ink-soft)' }}>
              <p style={{ marginBottom: '14px' }}>
                El 5 de agosto de 1852, a instancias del gobernador santafesino Domingo Crespo, el gobierno provisorio de la Confederación firmó el histórico decreto que elevó a la modesta Villa del Rosario al rango de <strong>Ciudad</strong>. La visión federal comprendía que la libre navegación de los ríos interiores (garantizada en la Constitución de 1853) carecía de sentido práctico sin un puerto de aguas profundas que compitiera de igual a igual con el monopolio de Buenos Aires.
              </p>
              <div
                style={{
                  borderLeft: '3px solid var(--amber-alert)',
                  paddingLeft: '16px',
                  margin: '18px 0',
                  fontStyle: 'italic',
                  color: 'var(--ink)',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ color: 'var(--amber-alert)', flexShrink: 0, marginTop: '2px' }}>
                  <IconQuote size={18} />
                </div>
                <div>
                  &ldquo;Rosario no es una dársena provincial: es la boca del comercio del interior de la República. Quien pretenda someterla a la aduana de una sola provincia condena a la Confederación a la miseria perpetua.&rdquo;
                  <div className="font-mono" style={{ fontSize: '0.75rem', fontStyle: 'normal', color: 'var(--ink-soft)', marginTop: '4px' }}>
                    — Mensaje Federal a la Legislatura de Paraná, 1854.
                  </div>
                </div>
              </div>
              <p style={{ marginBottom: '14px' }}>
                La posterior promulgación de la <strong>Ley de Derechos Diferenciales (1854)</strong> —que rebajaba aranceles a las naves que atracaran directamente en el Paraná sin tocar Buenos Aires— produjo una de las transformaciones demográficas más vertiginosas del continente: Rosario saltó de 3.000 pobladores a más de 23.000 en 1869, atrayendo comerciantes genoveses, financistas británicos y marineros del Danubio.
              </p>
              <p style={{ margin: 0 }}>
                <strong>La tragedia constitucional de la Capital:</strong> Entre 1868 y 1873, el Congreso de la Nación sancionó por ley el traslado de la Capital de la República a Rosario en tres ocasiones sucesivas. Las tres leyes fueron vetadas: la primera por Bartolomé Mitre (1868) y las dos siguientes por Domingo Faustino Sarmiento (1869 y 1873). Esta frustración forjó en la sociedad rosarina una desconfianza instintiva hacia el poder central y un orgullo secular por su condición de metrópoli mercantil que no vive del erario estatal.
              </p>
            </div>
          </div>
        )}

        {/* CONTENIDO 4: ENSAYO ANTROPOLÓGICO INTEGRAL */}
        {dossierTab === 'antropologia' && (
          <div style={{ backgroundColor: 'var(--paper)', padding: '22px', border: '1px solid var(--ink-faint)' }}>
            <div className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--red-urgent)', fontWeight: 700, marginBottom: '6px' }}>
              ENSAYO DE SOCIOLOGÍA HISTÓRICA REGIONAL
            </div>
            <h4 className="font-display" style={{ fontSize: '1.5rem', margin: '0 0 12px 0' }}>
              La paradoja rosarina: Huérfana de conquistador, hija del río y el trabajo
            </h4>
            <div style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--ink-soft)' }}>
              <p style={{ marginBottom: '14px' }}>
                La matriz cultural de Rosario se explica por una singularidad antropológica: es la única gran concentración urbana de la Argentina que nunca tuvo fundador con título nobiliario ni fue sede virreinal, eclesiástica o burocrática. Mientras Córdoba se edificaba en torno a la teología y Buenos Aires sobre el privilegio fiscal de su Aduana, Rosario creció como una colonia fenicia: dependiente exclusivamente de su calado náutico, el acopio de granos y la inventiva de sus habitantes.
              </p>
              <p style={{ marginBottom: '14px' }}>
                Del <strong>desacato de 1812 en las barrancas</strong> heredó la dimensión moral: el orgullo de haber sido el escenario de la primera gran desobediencia cívica de la patria, donde un símbolo nacional nació del paño cosido por una vecina y no de la heráldica real.
              </p>
              <p style={{ marginBottom: '14px' }}>
                De la <strong>apertura portuaria de 1852</strong> recibió la dimensión material: la confirmación de que la riqueza del interior del país podía dialogar directamente con el Atlántico y Europa sin pedir la venia de los salones porteños.
              </p>
              <p style={{ margin: 0 }}>
                En la intersección de ambas fuerzas floreció la personalidad rosarina moderna: apasionada, escéptica de los dogmas oficiales, refractaria a los mandatos foráneos y consumida por dos amores viscerales: el río Paraná que se va al mar y la pelota de cuero que rueda cada domingo en el Parque o en Arroyito.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          SECCIÓN FÚTBOL: MANUAL PARA EXTRANJEROS (CENTRAL, NEWELL'S & APODOS)
         ========================================================================= */}
      <div
        style={{
          border: '2px solid var(--ink)',
          backgroundColor: 'var(--paper)',
          padding: '28px',
          marginBottom: '40px',
          boxShadow: '4px 4px 0px var(--ink-faint)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                backgroundColor: 'var(--red-urgent)',
                color: '#FFF',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '2px',
                letterSpacing: '0.06em',
              }}
            >
              ESTUDIO SOCIOCULTURAL • IDENTIDAD DEPORTIVA
            </span>
            <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
              CULTURA POPULAR & COHESIÓN URBANA
            </span>
          </div>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
            TIEMPO DE LECTURA: 4 MINUTOS
          </span>
        </div>

        <h3
          className="font-display"
          style={{
            fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: '8px',
          }}
        >
          Ensayo Sociológico sobre la Polaridad del Fútbol Rosarino
        </h3>
        <p
          className="font-body"
          style={{
            fontSize: '1.15rem',
            fontStyle: 'italic',
            color: 'var(--ink-soft)',
            marginBottom: '24px',
            borderBottom: '1px solid var(--ink-faint)',
            paddingBottom: '14px',
          }}
        >
          Génesis ferroviaria y pedagógica: cómo el antagonismo constructivo entre Rosario Central y Newell&apos;s Old Boys forjó la personalidad deportiva y social de la ciudad.
        </p>

        {/* Columnas del Origen de Central y Newell's */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '28px',
          }}
        >
          {/* Rosario Central */}
          <div
            style={{
              backgroundColor: 'var(--paper-elevated)',
              borderLeft: '4px solid #1E3A8A',
              padding: '18px',
            }}
          >
            <div className="font-mono" style={{ fontSize: '0.72rem', color: '#1E3A8A', fontWeight: 700, marginBottom: '6px' }}>
              FUNDADO EN 1889 • TALLERES FERROVIARIOS
            </div>
            <h4 className="font-display" style={{ fontSize: '1.3rem', margin: '0 0 10px 0' }}>
              Rosario Central: El vapor, el riel y la grasa obrera
            </h4>
            <p style={{ fontSize: '0.96rem', lineHeight: 1.6, color: 'var(--ink-soft)' }}>
              Nació en la víspera de la Nochebuena de 1889 en los galpones del <em>Central Argentine Railway</em>. Setenta obreros y maquinistas británicos y criollos, encabezados por Thomas Molineux, fundaron el club bajo el estruendo de calderas y carbón. No había té de las cinco ni guantes de seda: se jugaba entre vías de tren y silbatos de turno fabril.
            </p>
          </div>

          {/* Newell's Old Boys */}
          <div
            style={{
              backgroundColor: 'var(--paper-elevated)',
              borderLeft: '4px solid #DC2626',
              padding: '18px',
            }}
          >
            <div className="font-mono" style={{ fontSize: '0.72rem', color: '#DC2626', fontWeight: 700, marginBottom: '6px' }}>
              FUNDADO EN 1903 • COLEGIO ANGLO-ARGENTINO
            </div>
            <h4 className="font-display" style={{ fontSize: '1.3rem', margin: '0 0 10px 0' }}>
              Newell&apos;s Old Boys: La academia, la tiza y el cuero inglés
            </h4>
            <p style={{ fontSize: '0.96rem', lineHeight: 1.6, color: 'var(--ink-soft)' }}>
              Nació de las aulas del Colegio Comercial Anglo-Argentino de Isaac Newell y Anna Jockinsen. Fueron sus egresados (literalmente los &ldquo;Viejos Muchachos de Newell&rdquo;) quienes formalizaron la institución en el Parque de la Independencia. Trajeron las primeras pelotas cosidas con vejiga de cerdo, uniforme riguroso y la mística de la docencia británica trasplantada al barro santafesino.
            </p>
          </div>
        </div>

        {/* El Bautismo del Odio: Leprosos y Canallas */}
        <div
          style={{
            backgroundColor: 'var(--paper-elevated)',
            border: '1px solid var(--ink-faint)',
            padding: '20px 24px',
            marginBottom: '24px',
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--red-urgent)',
              letterSpacing: '0.08em',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <IconShield size={14} />
            <span>EL SANTO GRIAL DEL APODO: EL PARTIDO DEL LEPROSARIO (AÑOS 1920)</span>
          </div>

          <p style={{ fontSize: '1.02rem', lineHeight: 1.65, color: 'var(--ink)', marginBottom: '14px' }}>
            Todo extranjero sensato pregunta: <em>¿Por qué alguien se autoproclamaría con orgullo portador de lepra o sinónimo de canallada moral?</em> La respuesta es la mayor lección de sociología rosarina jamás documentada:
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
              margin: '16px 0',
            }}
          >
            <div style={{ padding: '14px', background: 'var(--paper)', border: '1px solid var(--ink-faint)' }}>
              <div className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DC2626' }}>
                EL ORIGEN DE &ldquo;LEPROSOS&rdquo;:
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', marginTop: '6px' }}>
                La comisión de damas del <strong>Hospital Carrasco</strong> organizó un partido benéfico a beneficio de los enfermos de lepra. Newell&apos;s aceptó la invitación de inmediato para recaudar fondos. Los hinchas de Central, con fina crueldad de época, les gritaron: <em>&ldquo;¡Ahí van los leprosos!&rdquo;</em>. Newell&apos;s recogió el mote y lo convirtió en estandarte invencible.
              </p>
            </div>

            <div style={{ padding: '14px', background: 'var(--paper)', border: '1px solid var(--ink-faint)' }}>
              <div className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E3A8A' }}>
                EL ORIGEN DE &ldquo;CANALLAS&rdquo;:
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', marginTop: '6px' }}>
                Rosario Central, alegando desavenencias dirigenciales, se negó a disputar el clásico benéfico para los enfermos. La furia de los rojinegros fue inmediata: <em>&ldquo;¡Son unos canallas, no tienen corazón!&rdquo;</em>. Lejos de ofenderse, la hinchada auriazul adoptó la etiqueta como sinónimo de rebeldía implacable y orgullo obrero.
              </p>
            </div>
          </div>

          <div
            className="font-mono"
            style={{
              backgroundColor: 'var(--paper)',
              padding: '12px 16px',
              fontSize: '0.84rem',
              borderLeft: '3px solid var(--red-urgent)',
              color: 'var(--ink)',
            }}
          >
            <strong>SINGULARIDAD IDENTITARIA:</strong> En Rosario la adhesión futbolística es excluyente y profundamente local. La polaridad entre Newell&apos;s Old Boys y Rosario Central estructura la vida cotidiana, las conversaciones públicas y la pertenencia barrial, constituyendo uno de los patrimonios intangibles más singulares de Sudamérica.
          </div>
        </div>
      </div>

      {/* DETALLE DINÁMICO SEGÚN LA SECCIÓN SELECCIONADA */}
      <div
        style={{
          border: '1px solid var(--ink-faint)',
          backgroundColor: 'var(--paper-elevated)',
          padding: '28px',
          marginBottom: '40px',
        }}
      >
        {activeSection === 'portada' && (
          <div>
            <span className="badge-deadpan">1812 — BATERÍAS DEL PARANÁ Y GÉNESIS DE LA ENSEÑA PATRIA</span>
            <h3 style={{ margin: '10px 0 14px 0', fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}>
              La creación de la enseña nacional en las barrancas y la afirmación de la soberanía civil
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--ink-soft)', marginBottom: '16px' }}>
              Rosario creció históricamente sin fundadores militares ni mercedes reales, articulada de forma espontánea alrededor de su orilla fluvial y su vocación de intercambio. En febrero de 1812, las baterías Libertad e Independencia no sólo vigilaron el paso de la escuadra realista: fueron el escenario donde se enarboló por vez primera el paño celeste y blanco, consolidando el compromiso de la población ribereña con la causa emancipadora.
            </p>
            <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', borderTop: '1px solid var(--ink-faint)', paddingTop: '10px' }}>
              REGISTRO HISTÓRICO: 27 de febrero de 1812. Baterías Libertad e Independencia en las costas del Pago de los Arroyos.
            </div>
          </div>
        )}

        {activeSection === 'seguridad' && (
          <div>
            <span className="badge-deadpan">SEGURIDAD & CIUDAD — SISTEMA INTEGRADO DE MONITOREO</span>
            <h3 style={{ margin: '10px 0 14px 0', fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}>
              Despliegue operativo y tecnología analítica en los corredores metropolitanos
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--ink-soft)', marginBottom: '16px' }}>
              La gestión del orden público en el conglomerado urbano incorpora herramientas de videovigilancia de última generación: más de 180 domos de alta resolución con lectura automática de patentes y reconocimiento óptico sobre Avenida de Circunvalación y los accesos provinciales. La articulación permanente entre fuerzas locales, provinciales y federales busca garantizar la trazabilidad y la respuesta inmediata ante emergencias.
            </p>
            <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', borderTop: '1px solid var(--ink-faint)', paddingTop: '10px' }}>
              CENTRO DE MONITOREO METROPOLITANO: Vigilancia continua en cuadrantes estratégicos y coordinación multiagencial.
            </div>
          </div>
        )}

        {activeSection === 'economia' && (
          <div>
            <span className="badge-deadpan">ECONOMÍA & HIDROVÍA — EL NODO AGROEXPORTADOR GLOBAL</span>
            <h3 style={{ margin: '10px 0 14px 0', fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}>
              La cuenca del Paraná y su infraestructura de ultramar como motor productivo
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--ink-soft)', marginBottom: '16px' }}>
              Desde su habilitación como puerto de ultramar en 1852, las terminales del Gran Rosario conforman el complejo agroindustrial y portuario más eficiente del Cono Sur, canalizando cerca del 80% de las exportaciones agroalimentarias de la Argentina. Con un calado navegable mantenido a 34 pies, el canal troncal de la Hidrovía Paraná-Paraguay conecta directamente la producción de la pampa húmeda con los mercados asiáticos y europeos.
            </p>
            <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', borderTop: '1px solid var(--ink-faint)', paddingTop: '10px' }}>
              DATOS DE OPERATORIA: Despacho ininterrumpido en muelles privados y estatales; monitoreo hidrométrico diario.
            </div>
          </div>
        )}

        {activeSection === 'futbol' && (
          <div>
            <span className="badge-deadpan">FÚTBOL & FENOMENOLOGÍA SOCIAL</span>
            <h3 style={{ margin: '10px 0 14px 0', fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}>
              El clásico rosarino: liturgia urbana y arraigo barrial incondicional
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--ink-soft)', marginBottom: '16px' }}>
              El duelo futbolístico de la ciudad representa uno de los fenómenos de pasión colectiva más intensos de América Latina. Distribuida de manera equilibrada y fervorosa a lo largo de las seccionales, la rivalidad entre Newell&apos;s Old Boys y Rosario Central moviliza a la sociedad con semanas de antelación, conjugando historia, literatura popular y una lealtad deportiva que trasciende generaciones.
            </p>
            <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', borderTop: '1px solid var(--ink-faint)', paddingTop: '10px' }}>
              COBERTURA DEPORTIVA: Acreditación de prensa internacional y despliegue preventivo en el Parque de la Independencia y Arroyito.
            </div>
          </div>
        )}

        {activeSection === 'cultura' && (
          <div>
            <span className="badge-deadpan">CULTURA & SOCIEDAD — MEMORIA Y TRANSFORMACIÓN URBANA</span>
            <h3 style={{ margin: '10px 0 14px 0', fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}>
              De antiguo barrio ferroportuario a polo gastronómico y creativo contemporáneo
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--ink-soft)', marginBottom: '16px' }}>
              El tradicional sector de Pichincha y el Bajo ha protagonizado un virtuoso proceso de revalorización patrimonial. Aquellas esquinas de intensa actividad obrera y ferroviaria de comienzos del siglo XX conviven hoy con galerías de arte independiente, talleres de diseño, propuestas gastronómicas de vanguardia y el clásico sándwich Carlitos como estandarte del encuentro social rosarino.
            </p>
            <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', borderTop: '1px solid var(--ink-faint)', paddingTop: '10px' }}>
              CIRCUITO PATRIMONIAL: Preservación de arquitectura histórica y fomento a las industrias creativas locales.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
