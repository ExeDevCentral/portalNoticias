'use client';

import React from 'react';
import {
  IconFeather,
  IconQuote,
  IconShield,
} from './Icons';

export type RosarioSection = 'portada' | 'seguridad' | 'economia' | 'futbol' | 'cultura';

interface CronicasRosarinasProps {
  activeSection: RosarioSection;
  onSelectSection: (section: RosarioSection) => void;
}

export default function CronicasRosarinas({
  activeSection,
  onSelectSection,
}: Readonly<CronicasRosarinasProps>) {
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
            <span>SISTEMA DE CRÓNICAS HISTÓRICAS & MANUAL AL PASO</span>
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
            La historia de Rosario contada con la gravedad de Belgrano, la ambición de Urquiza y la ironía filosa de un café en El Cairo.
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
          {(
            [
              { key: 'portada', label: '1812: Barrancas' },
              { key: 'seguridad', label: 'Seguridad & Ciudad' },
              { key: 'economia', label: '1852: Puerto Urquiza' },
              { key: 'futbol', label: 'Manual Fútbol' },
              { key: 'cultura', label: 'Pichincha & Noche' },
            ] as const
          ).map((tab) => {
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

      {/* BLOQUE ESPECIAL: EL PARLAMENTO DE LOS PATRICIOS (BELGRANO & URQUIZA) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
        }}
      >
        {/* Despacho Manuel Belgrano */}
        <div
          style={{
            backgroundColor: 'var(--paper-elevated)',
            border: '1px solid var(--ink-faint)',
            borderTop: '4px solid var(--blue-parana)',
            padding: '20px 22px',
            position: 'relative',
          }}
        >
          <div
            className="font-mono"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.72rem',
              color: 'var(--ink-soft)',
              marginBottom: '10px',
            }}
          >
            <span style={{ fontWeight: 700, color: 'var(--blue-parana)', letterSpacing: '0.08em' }}>
              EL DESPACHO DEL GENERAL (1812)
            </span>
            <span>BATERÍA LIBERTAD • BARRANCAS</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--blue-parana)', marginTop: '2px' }}>
              <IconQuote size={24} />
            </div>
            <div>
              <p
                className="font-body"
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                  color: 'var(--ink)',
                  margin: '0 0 10px 0',
                }}
              >
                &ldquo;Vengo al Pago de los Arroyos, monto dos baterías de cañones frente a las islas y mando a coser una bandera celeste y blanca porque los soldados no sabían a quién jurarle lealtad. Desde Buenos Aires, don Bernardino Rivadavia me escribe furioso ordenándome que la esconda en un cajón para no disgustar al embajador inglés. Hice lo que cualquier caballero sensato haría en Rosario: la izé de todas formas, apagué el teléfono y me marché a caballo rumbo a Jujuy.&rdquo;
              </p>
              <div
                className="font-mono"
                style={{
                  fontSize: '0.76rem',
                  color: 'var(--ink-soft)',
                  borderTop: '1px dashed var(--ink-faint)',
                  paddingTop: '8px',
                }}
              >
                <strong>Manuel Belgrano</strong> — Creador de la Bandera, desobediente profesional del Triunvirato y primer ciudadano honorario de las barrancas.
              </div>
            </div>
          </div>
        </div>

        {/* Despacho Justo José de Urquiza */}
        <div
          style={{
            backgroundColor: 'var(--paper-elevated)',
            border: '1px solid var(--ink-faint)',
            borderTop: '4px solid var(--amber-alert)',
            padding: '20px 22px',
            position: 'relative',
          }}
        >
          <div
            className="font-mono"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.72rem',
              color: 'var(--ink-soft)',
              marginBottom: '10px',
            }}
          >
            <span style={{ fontWeight: 700, color: 'var(--amber-alert)', letterSpacing: '0.08em' }}>
              EL DECRETO DEL CAUDILLO (1852)
            </span>
            <span>PRESIDENCIA DE LA CONFEDERACIÓN</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--amber-alert)', marginTop: '2px' }}>
              <IconQuote size={24} />
            </div>
            <div>
              <p
                className="font-body"
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                  color: 'var(--ink)',
                  margin: '0 0 10px 0',
                }}
              >
                &ldquo;Rosario era una modesta villa de pescadores y cuatreros hasta que derroté a Rosas en Caseros y firmé el decreto que la declaró Ciudad. Necesitaba un puerto ultramarino con agallas para ahogar financieramente la soberbia de la Aduana de Buenos Aires. Tres veces promulgó el Congreso que Rosario debía ser la Capital Federal de la República Argentina; tres veces la vetó el celo porteño. Hoy sacan por estas aguas el cereal que alimenta a medio planeta, y todavía en Retiro creen que Santa Fe termina en San Nicolás.&rdquo;
              </p>
              <div
                className="font-mono"
                style={{
                  fontSize: '0.76rem',
                  color: 'var(--ink-soft)',
                  borderTop: '1px dashed var(--ink-faint)',
                  paddingTop: '8px',
                }}
              >
                <strong>Justo José de Urquiza</strong> — General en Jefe del Ejército Grande, Presidente de la Confederación y padrino fundador del puerto rebelde.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN FÚTBOL: MANUAL PARA EXTRANJEROS (SELECCIONADA O INTEGRADA) */}
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
              NOTA AL PASO • OBLIGATORIA
            </span>
            <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
              CÓDIGO DE CONVIVENCIA REGIONAL N° 1
            </span>
          </div>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
            LECTURA: 4 MINUTOS SIN GRITAR
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
          Manual de Iniciación para Extranjeros sobre la Religión Bíblica de Rosario
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
          Cómo dos escuelas inglesas, un tren de carga y un leprosario municipal crearon la única ciudad del país donde Boca y River producen lástima antropológica.
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
            <strong>PRIMER MANDAMIENTO ROSARINO:</strong> En esta ciudad no existe ser &ldquo;simpatizante de River pero hincha de Central&rdquo; ni &ldquo;de Boca y un poco de Newell&apos;s&rdquo;. Proferir semejante herejía en una pizzería de Pellegrini o en un quiosco de Arroyito es causal inmediata de compasión médica. En Rosario la elección es binaria, vitalicia e irreversible hasta la cremación.
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
            <span className="badge-deadpan">1812 — ACTA DE FUNDACIÓN POR DESOBEDIENCIA</span>
            <h3 style={{ margin: '10px 0 14px 0' }}>
              <span className="strikethrough-official">
                El Triunvirato ordena conservar los colores hispánicos para mantener prudencia diplomática
              </span>
              <span className="satirical-correction" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)' }}>
                Belgrano desembarca en el barro rosarino, cose dos trapos celestes y declara fundada la insumisión nacional
              </span>
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--ink-soft)', marginBottom: '16px' }}>
              Rosario es una de las pocas ciudades del continente americano que no fue fundada por ningún conquistador con espada y crucifijo, sino que se fue amontonando espontáneamente alrededor de una capilla humilde y el contrabando del río. Por eso, cuando don Manuel Belgrano llegó con sus hombres en 1812 y les preguntó a los pobladores de qué lado estaban, los rosarinos simplemente respondieron: <em>&ldquo;Del que nos deje comerciar en paz sin pagarle alcabalas a Buenos Aires&rdquo;</em>.
            </p>
            <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', borderTop: '1px solid var(--ink-faint)', paddingTop: '10px' }}>
              ARCHIVO HISTÓRICO: 27 de febrero de 1812. Las baterías &ldquo;Libertad&rdquo; e &ldquo;Independencia&rdquo; registraron un total de cero disparos contra naves reales pero cien por ciento de efectividad cívica.
            </div>
          </div>
        )}

        {activeSection === 'seguridad' && (
          <div>
            <span className="badge-deadpan">SEGURIDAD & CIUDAD — DE LOS CAÑONES AL ANILLO DIGITAL</span>
            <h3 style={{ margin: '10px 0 14px 0' }}>
              <span className="strikethrough-official">
                Comisión bicameral promete pacificación integral mediante 400 folletos impresos en papel satinado
              </span>
              <span className="satirical-correction" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)' }}>
                Belgrano observa 180 domos de inteligencia artificial en Circunvalación y pregunta por qué no apuntan al puerto porteño
              </span>
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--ink-soft)', marginBottom: '16px' }}>
              En 1812, la seguridad metropolitana de Rosario consistía en cuatro cañones de bronce apuntando a los camalotes del Paraná con la esperanza de que ningún bergantín español supiera nadar. Doscientos catorce años después, un anillo perimetral con algoritmos de visión nocturna y reconocimiento de matrículas escanea cada colectivo que ingresa por la Autopista a Córdoba. La única constante es el viento del este, que sigue oliendo a humo de islas y café tostado.
            </p>
            <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', borderTop: '1px solid var(--ink-faint)', paddingTop: '10px' }}>
              CENTRO DE MONITOREO METROPOLITANO: 180 cámaras activas, 42 patrullas de alta frecuencia y tres millones de mates cebados por guardia.
            </div>
          </div>
        )}

        {activeSection === 'economia' && (
          <div>
            <span className="badge-deadpan">ECONOMÍA & HIDROVÍA — LA VENGANZA DE URQUIZA</span>
            <h3 style={{ margin: '10px 0 14px 0' }}>
              <span className="strikethrough-official">
                Aduana Central celebra récord de retenciones agropecuarias aplicadas desde oficinas con aire acondicionado en Balcarce 50
              </span>
              <span className="satirical-correction" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)' }}>
                Ochenta buques ultramarinos cargan la riqueza de la pampa húmeda frente a las barrancas mientras Rosario paga la nafta más cara del país
              </span>
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--ink-soft)', marginBottom: '16px' }}>
              En 1852, Urquiza creó la Aduana de Rosario con derechos diferenciales para que los barcos europeos no tuvieran que arrodillarse ante el puerto de Buenos Aires. Ciento setenta y cuatro años después, la Hidrovía Paraná-Paraguay es la arteria por donde sale el 80% de la harina y aceite de soja de la República. El Paraná es marrón, espeso y majestuoso: lleva en su corriente más dólares que toda la City porteña, pero los rosarinos todavía tienen que cruzar a Entre Ríos en balsa si hay niebla en el puente.
            </p>
            <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', borderTop: '1px solid var(--ink-faint)', paddingTop: '10px' }}>
              DATO LOGÍSTICO: Calado oficial en 34 pies. Tiempo promedio de carga de un Panamax: 28 horas continuas al son de cumbia santafesina.
            </div>
          </div>
        )}

        {activeSection === 'futbol' && (
          <div>
            <span className="badge-deadpan">FÚTBOL & PSICOLOGÍA COLECTIVA</span>
            <h3 style={{ margin: '10px 0 14px 0' }}>
              <span className="strikethrough-official">
                Sociólogos sugieren tomar el clásico con mesura, tranquilidad y perspectiva existencial
              </span>
              <span className="satirical-correction" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)' }}>
                Un millón de ciudadanos suspende el raciocinio durante 96 horas y calcula probabilidades con el almanaque en la mano
              </span>
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--ink-soft)', marginBottom: '16px' }}>
              El clásico rosarino no es un partido de fútbol: es un juicio universal de noventa minutos donde el perdedor es condenado a seis meses de silencio sepulcral en el asado de los domingos y el ganador adquiere inmunidad parlamentaria para recordar cualquier córner hasta el fin de los tiempos. Quien intente explicar la teoría del juego con números y posesión de balón nunca vio a un abuelo llorar de rodillas en la vereda de Génova y Cordiviola.
            </p>
            <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', borderTop: '1px solid var(--ink-faint)', paddingTop: '10px' }}>
              ESTADO DEL CLÁSICO: Localidades agotadas tanto en el Coloso Marcelo Bielsa como en el Gigante de Arroyito. Prohibido hablar de otra cosa.
            </div>
          </div>
        )}

        {activeSection === 'cultura' && (
          <div>
            <span className="badge-deadpan">CULTURA & NOCHE — DE PICHINCHA AL RÍO</span>
            <h3 style={{ margin: '10px 0 14px 0' }}>
              <span className="strikethrough-official">
                Guía turística europea describe a Pichincha como un apacible barrio residencial de clase media acomodada
              </span>
              <span className="satirical-correction" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)' }}>
                El antiguo reino de Madame Safó y la Zwi Migdal reconvertido en santuario del vermut tirado y el sándwich Carlitos
              </span>
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--ink-soft)', marginBottom: '16px' }}>
              Hacia 1930, el barrio de Pichincha era el epicentro prostibulario y prostibulario más temido y cinematográfico del Río de la Plata, gobernado por rufianes polacos y franceses con bigote engominado. Hoy los viejos burdeles son cervecerías artesanales donde diseñadores gráficos discuten tipografías comiendo un Carlitos tostado con lomito y queso derretido. La metamorfosis urbana fue total, salvo por la humedad del río, que sigue entrando sin pedir permiso por la calle Jujuy.
            </p>
            <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', borderTop: '1px solid var(--ink-faint)', paddingTop: '10px' }}>
              PATRIMONIO INMATERIAL: El Carlitos tostado en pan de miga con manteca y ketchup no se negocia. Cualquier intento de ponerle palta es delito federal.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
