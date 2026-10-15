# Especificación de Diseño: "El Diario Serio que Miente" (Portal Periodístico Satírico & Sala de Redacción en Vivo)

**Fecha**: 2026-10-15  
**Estado**: Validado  
**Tipo**: Arquitectónico  
**Costo Operativo**: $0 USD (Fuentes RSS públicas, extracción OpenGraph de fotos de prensa, Gemini Free Tier / Fallback editorial sin costo, SQLite embebido).

---

## 1. Visión y Propósito

**"El Diario Serio que Miente"** es una publicación digital de sátira periodística contemporánea con rigor editorial clásico (estilo *The Onion*, *El Mundo Today*). 

### Principio Rector
> **La forma es de diario solemne e institucional; el contenido es el que rompe la solemnidad.**  
El humor no se disfraza ni se explica con carteles estridentes: nace de la distancia fría y rigurosa entre la maquetación seria de un periódico tradicional y la ironía de lo que realmente sucede en el mundo.

### Flujo de Funcionamiento
1. **Buscador de Cables Internacionales**: Consume feeds RSS abiertos de agencias y medios del mundo (BBC Mundo, Reuters, El País, Infobae, etc.) sin costo de APIs.
2. **Sala de Redacción con WebSocket / Streaming**:
   - El editor selecciona uno o más cables reales.
   - La IA (Gemini Free Tier o Generador Editorial Autónomo sin API) lee la nota, preserva el método periodístico (5 Ws) y produce:
     - El **titular oficial tachado** en rojo.
     - El **titular real con ironía institucional**.
     - El **copete deadpan**.
     - La **crónica de 3 párrafos**.
     - El **epígrafe formal** para la foto.
3. **Fotografía de Prensa Contextual**:
   - Extrae la foto original del cable vía metadatos OpenGraph (fotos reales de reporteros gráficos, no stock sonriente genérico).
   - Aplicación de filtro sutil de contraste editorial (desaturación parcial y grano de imprenta).
4. **Portada Asimétrica**:
   - Grilla editorial CSS Grid con estética de papel y tinta.
   - Bloque *"Lo real, que es peor"* que linkea al cable periodístico verídico.
   - Sello de advertencia de **SÁTIRA** para redes sociales (OpenGraph image).

---

## 2. Sistema de Diseño (Cero Genérico: Papel & Tinta)

### Paleta de Colores de Alta Fidelidad (Un Solo Acento)

| Rol | Hex | Uso |
| :--- | :--- | :--- |
| **Papel (Fondo)** | `#F2EDE1` | Fondo general de la página con textura limpia de prensa |
| **Tinta Principal** | `#15130F` | Texto principal, filetes dobles de imprenta, bordes de sección |
| **Tinta Suave** | `#5E5A52` | Metadatos, horas de cables, firmas, nombres de fuentes |
| **Rojo Urgente (Único Acento)** | `#C81E14` | Badges austeros, tachados de fe de erratas, rótulo "Última Hora" |
| **Marcador** | `#FFE14D` | Fondo de resaltado detrás de citas textuales destacadas |
| **Modo Oscuro Derivado** | `#0E0D0B` (fondo), `#EDE7DA` (texto), `#FF4A3D` (acento) | Conmutador opcional para lectura nocturna |

### Tipografía Jerárquica
* **Titulares y Cabecera**: *Fraunces* (Serif display con gran personalidad, solemne pero con toque excéntrico).
* **Cuerpo de Notas y Copetes**: *Newsreader* (Serif de lectura periodística, interlineado 1.6).
* **Metadatos, Horas y Tickers**: *IBM Plex Mono* (Monoespaciada de agencia de noticias).

### El Gesto Firma: La Fe de Erratas
En cada titular principal se muestra el titular oficial tachado en rojo con `line-through` y debajo la versión satírica:
> ~~Gobierno anuncia plan de estabilidad económica~~  
> **Gobierno anuncia que seguirá anunciando hasta que la realidad mejore**

### Badges & Secciones con Tono Deadpan (Humor Seco)
* **Badges**:
  * `[ÚLTIMO MOMENTO (hace 3 días)]`
  * `[SEGÚN FUENTES QUE PREFIEREN NO EXISTIR]`
  * `[NOTA DE COLOR GRIS]`
  * `[DECLARACIONES NO VINCULANTES]`
* **Secciones del Diario**:
  * `Política (por ahora)`
  * `Economía (ficción)`
  * `Sociedad (lo que queda)`
  * `Fe de Erratas`
  * `Lo real, que es peor` (link a la noticia original externa)

---

## 3. Arquitectura Técnica

```
 ┌─────────────────────────────────────────────────────────────┐
 │ FUENTES RSS ABIERTAS Y GRATUITAS (Reuters, BBC, El País)    │
 └──────────────────────────────┬──────────────────────────────┘
                                │ (rss-parser / fetch gratuito)
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ BUSCADOR DE CABLES & SALA DE REDACCIÓN (/redaccion)         │
 │ - Filtra por categoría y palabras clave                     │
 │ - Muestra cables entrantes con su foto de prensa original   │
 └──────────────────────────────┬──────────────────────────────┘
                                │ (Selección de cable)
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ MOTOR DE REESCRITURA PERIODÍSTICA (WebSocket / Streaming)    │
 │ - Gemini 1.5/2.0 Flash (Free Tier) o Fallback Autónomo Local │
 │ - Prompt de Estilo: Método periodístico + Titular tachado   │
 │ - Emisión de tokens en tiempo real hacia la vista editorial │
 └──────────────────────────────┬──────────────────────────────┘
                                │ (Botón: "Imprimir en Portada")
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ BASE DE DATOS LOCAL EMBEBIDA (SQLite con Drizzle ORM)       │
 │ - Tablas: articles, cables, config                          │
 │ - Costo: $0, sin servidores externos                        │
 └──────────────────────────────┬──────────────────────────────┘
                                │ (Lectura SSR / ISR)
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ PORTADA EDITORIAL ("El Diario Serio que Miente")            │
 │ - CSS Grid asimétrico con área de titular, lateral y bloque │
 │ - Tarjetas con tachado de fe de erratas y foto tratada      │
 │ - OpenGraph dinámico con sello de advertencia de SÁTIRA     │
 └─────────────────────────────────────────────────────────────┘
```

---

## 4. Esquema de Datos (Drizzle ORM + SQLite)

### Archivo: `src/db/schema.ts`
```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const articles = sqliteTable('articles', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  officialTitle: text('official_title').notNull(),    // Titular oficial tachado en rojo
  satiricalTitle: text('satirical_title').notNull(),  // Titular real / satírico
  dek: text('dek').notNull(),                         // Copete en Newsreader
  body: text('body').notNull(),                       // Crónica periodística en 3 párrafos
  highlightQuote: text('highlight_quote'),            // Cita con resaltado amarillo
  category: text('category').notNull(),               // 'politica', 'economia', 'sociedad', etc.
  badge: text('badge').notNull(),                     // 'ÚLTIMO MOMENTO (hace 3 días)', etc.
  imageUrl: text('image_url').notNull(),              // Foto de prensa
  imageCaption: text('image_caption').notNull(),      // Epígrafe sobrio
  originalSourceUrl: text('original_source_url'),     // Link al cable verídico
  originalSourceName: text('original_source_name'),   // Ej: 'BBC', 'Reuters'
  publishedAt: integer('published_at', { mode: 'timestamp' }).notNull(),
  status: text('status').default('published'),
});

export const cables = sqliteTable('cables', {
  id: text('id').primaryKey(),
  feedSource: text('feed_source').notNull(),
  originalTitle: text('original_title').notNull(),
  originalSummary: text('original_summary'),
  sourceUrl: text('source_url').notNull(),
  imageUrl: text('image_url'),
  fetchedAt: integer('fetched_at', { mode: 'timestamp' }).notNull(),
  processed: integer('processed', { mode: 'boolean' }).default(false),
});
```

---

## 5. El Prompt de Redacción Satírico-Periodística

Para que la IA conserve el rigor periodístico sin caer en chistes vulgares ni perder la noticia real:

```markdown
Eres el jefe de redacción de "El Diario Serio", un periódico de sátira institucional de alta categoría.
Tu lema es: "La forma es solemne, la realidad es la que decepciona".

REGLAS OBLIGATORIAS:
1. No inventes los hechos base: usa los datos del cable real (quién, qué, cuándo, dónde).
2. Genera:
   - officialTitle: El titular corporativo/oficial que la fuente publicó o que un gobierno diría.
   - satiricalTitle: El titular real con mordacidad seca (deadpan).
   - dek: Una bajada periodística impecable que contextualice con datos reales pero remate con lucidez ácida.
   - body: 3 párrafos con estructura de pirámide invertida y tono formal de corresponsal de prensa.
   - imageCaption: Un epígrafe formal para la foto que refuerce la ironía.
   - badge: Uno de los sellos del diario ("ÚLTIMO MOMENTO (hace 3 días)", "Según fuentes que prefieren no existir", etc.).
3. NUNCA uses emojis, signos de exclamación excesivos ni aclares que es una broma.
```

---

## 6. Prevención de Riesgos y Seguridad

1. **Riesgo Legal y Desinformación en Redes**:
   - Todo link compartido genera automáticamente una tarjeta OpenGraph con un sello gráfico rojo en la esquina superior: `[ SÁTIRA PERIODÍSTICA ]`.
   - El footer contiene aviso legal permanente de publicación de humor y ficción.
2. **Resiliencia $0 Costo**:
   - Si no hay API key de Gemini cargada en `.env`, el sistema activa el **Generador Editorial Autónomo**, permitiendo probar la interfaz, el WebSocket simulado y la portada sin gastar un peso ni bloquear el flujo.
3. **Cero Dependencia de Servicios Pagos**:
   - RSS abiertos (Node nativo / rss-parser).
   - SQLite local almacenado en archivo local `data/diario.db`.
