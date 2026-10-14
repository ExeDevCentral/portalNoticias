# Especificación de Diseño: Rosario en Tiempo Real (Portal de Noticias & Agregador en Vivo)

**Fecha**: 2026-10-13  
**Estado**: Validado  
**Tipo**: Arquitectónico  

---

## 1. Visión y Propósito

**Rosario en Tiempo Real** es una plataforma periodística digital de alta velocidad e identidad visual propia, diseñada para informar a los ciudadanos de Rosario y la región al instante. 

Combina:
1. **La autoridad y jerarquía de un gran diario tradicional**: Secciones bien definidas (Seguridad/Policiales, Política, Deportes con foco en Newell's y Rosario Central, Economía/Puerto, Sociedad y Cultura).
2. **La inmediatez y agilidad de una sala de redacción moderna**: Cinta de alertas en vivo ("Último Momento"), feed cronológico continuo, indicadores de clima, río Paraná, puentes y cotización del dólar.
3. **Automatización inteligente + Curaduría editorial**: Agregador continuo de medios rosarinos (La Capital, Rosario3, El Ciudadano, etc.) mediante RSS y scraping limpio, con un panel de administración para emitir alertas rojas prioritarias y notas exclusivas.

---

## 2. Identidad Visual y Diseño Exclusivo (Cero Genérico)

Para evitar la apariencia de plantillas estándar tipo Bootstrap o dashboards genéricos, el diseño sigue un lenguaje visual periodístico contemporáneo inspirado en medios como *The Verge*, *Axios* y *The New York Times*, adaptado al contexto rosarino:

### Paleta de Colores
* **Fondo Principal (Modo Oscuro Editorial)**: `#0B0F17` (Azul medianoche profundo) con elevaciones en `#131B2A` y `#1C2538`.
* **Fondo Principal (Modo Claro Periodístico)**: `#F8F9FA` con tarjetas en `#FFFFFF` y bordes sutiles en `#E2E8F0`.
* **Acento "En Vivo" / Breaking**: `#E63946` (Rojo carmesí de alerta máxima) con efecto *pulse* animado.
* **Acento Río / Región**: `#0077B6` / `#0096C7` (Azul Paraná para secciones institucionales y puerto).
* **Acento Financiero / Alertas**: `#F59E0B` (Ámbar editorial para cotizaciones y tránsito).
* **Tipografía**:
  * **Titulares de Portada**: *Fraunces* o *Playfair Display* (serif contemporánea con gran personalidad y peso visual).
  * **Cuerpo y Lectura**: *Plus Jakarta Sans* o *Inter* (óptima legibilidad en móviles y pantallas de alta densidad).
  * **Timestamps y Tickers**: *JetBrains Mono* o fuente tabular monoespaciada para horas exactas (`23:25`).

### Componentes Clave de UI
* **Header & Ticker Superior**:
  * Ticker financiero y servicios: Clima en Rosario (humedad, temp, viento del río), Dólar Blue/Oficial, estado del Puente Rosario-Victoria y Circunvalación.
  * Ticker "ÚLTIMO MOMENTO": marquesina horizontal interactiva con las últimas 5 noticias críticas.
* **Hero Editorial Dividido (Grid 12 Columnas)**:
  * **Columna Principal (7 cols)**: Noticia de portada de gran formato con imagen en alta definición, badge de fuente original, tiempo transcurrido y botón de lectura rápida.
  * **Columna Lateral "EN VIVO" (5 cols)**: Feed vertical cronológico estilo sala de redacción con animación de entrada cada vez que entra un cable nuevo vía Server-Sent Events (SSE).
* **Grilla Temática Modular**:
  * Bloque **Rosario & Región**: Seguridad y sucesos locales.
  * Bloque **Clásicos del Fútbol**: Cobertura especial y actualizada de Newell's Old Boys y Rosario Central.
  * Bloque **Economía & Campo**: Puerto de Rosario, granos y comercio regional.

---

## 3. Arquitectura del Sistema

```
                       ┌───────────────────────────────┐
                       │      FUENTES DE ROSARIO       │
                       │ (La Capital, Rosario3, etc.)  │
                       └───────────────┬───────────────┘
                                       │ (RSS / Scraper cada 3m)
                                       ▼
                       ┌───────────────────────────────┐
                       │   CRAWLER & EXTRACTOR ENGINE  │
                       │   - rss-parser / cheerio      │
                       │   - Deduplicación (Hash URL)  │
                       │   - Clasificador de categoría │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │  BASE DE DATOS (SQLite/Drizzle│
                       │  o MongoDB Mongoose)          │
                       │  - Noticias, Categorías,      │
                       │    Alertas Rojas, Fuentes     │
                       └───────┬───────────────▲───────┘
                               │               │
                 (Lectura SSR) │               │ (Publicar / Fijar)
                               ▼               │
┌─────────────────────────────────┐   ┌────────┴────────┐
│   FRONTEND NEXT.JS (App Router) │   │  PANEL ADMIN    │
│   - Portada Híbrida             │   │  - Alerta Roja  │
│   - Artículos con SEO y Schema  │   │  - Notas Propias│
│   - SSE Client (/api/live)      │   │  - Curaduría    │
└─────────────────────────────────┘   └─────────────────┘
```

### Tecnologías Seleccionadas
1. **Next.js 14/15 (App Router & React 18/19)**:
   * Server-Side Rendering (SSR) y *Incremental Static Regeneration* (ISR) para SEO óptimo e indexación inmediata en Google Noticias.
   * Rutas API (`app/api/`) para endpoints del agregador y streaming.
2. **TypeScript**: Tipado seguro en modelos de noticias, feeds y eventos.
3. **SQLite con Drizzle ORM** (o **MongoDB**):
   * Modelo de datos ligero, transaccional, con soporte para consultas de texto completo y orden cronológico instantáneo.
4. **Server-Sent Events (SSE)**:
   * Protocolo unidireccional HTTP nativo (`text/event-stream`), ideal para empujar alertas y notas nuevas a la interfaz web sin consumir memoria de WebSockets.
5. **Cheerio & RSS-Parser**:
   * Extracción limpia de contenido, metadatos OpenGraph, autores y fotos originales.

---

## 4. Modelos de Datos

### Entidad `NewsItem`
* `id`: string (UUID)
* `title`: string
* `slug`: string (único para URL amigable)
* `summary`: string (bajada de la noticia)
* `content`: text (cuerpo completo en HTML saneado o Markdown)
* `imageUrl`: string (URL de imagen destacada)
* `source`: string ("La Capital", "Rosario3", "El Ciudadano", "Redacción Propia")
* `sourceUrl`: string (enlace canónico a la fuente original)
* `category`: enum (`politica`, `seguridad`, `economia`, `deportes`, `sociedad`, `ciudad`)
* `isUrgent`: boolean (dispara marquesina de último momento)
* `isPinned`: boolean (fijada como principal en portada)
* `publishedAt`: timestamp
* `createdAt`: timestamp

### Entidad `LiveAlert`
* `id`: string
* `title`: string
* `level`: enum (`info`, `warning`, `critical_red`)
* `active`: boolean
* `expiresAt`: timestamp
* `createdAt`: timestamp

---

## 5. Manejo de Errores y Tolerancia a Fallos
* **Aislamiento de Crawlers**: Cada fuente externa se procesa dentro de bloques `try/catch` independientes. Si una fuente falla, no interrumpe la sincronización de las demás.
* **Sanitización de HTML**: Todo contenido extraído se pasa por un limpiador para evitar inyecciones XSS y remover publicidad intrusiva de medios externos.
* **Caché en Caso de Caída**: La portada sirve artículos en caché local para garantizar 100% de disponibilidad incluso ante cortes de red externa.

---

## 6. Plan de Verificación y Testing
* **Test de Crawling**: Validar que los parsers extraigan correctamente título, fecha, imagen y categoría de al menos 3 fuentes reales de Rosario.
* **Test de Deduplicación**: Confirmar que notas ya existentes no se dupliquen al ejecutar el crawler en ciclos continuos.
* **Test de Tiempo Real (SSE)**: Verificar que al insertar una noticia urgente en la base de datos, el cliente web conectado reciba la actualización en menos de 1 segundo.
* **Test de Accesibilidad y Responsive**: Asegurar contraste tipográfico AAA, navegación por teclado y diseño adaptable perfecto en móviles y escritorio.
