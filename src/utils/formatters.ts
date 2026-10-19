export interface ServiceDataInput {
  temp?: number;
  weatherDesc?: string;
  dolarBlue?: number;
  dolarOficial?: number;
  paranaLevel?: string;
  puenteRosarioVictoria?: string;
}

export function formatServiceData(data: ServiceDataInput): string {
  const parts: string[] = [];

  if (data.temp !== undefined && data.weatherDesc) {
    parts.push(`${data.temp}°C ${data.weatherDesc}`);
  }

  if (data.dolarBlue !== undefined) {
    parts.push(`Dólar Blue: $${data.dolarBlue}`);
  }

  if (data.paranaLevel) {
    parts.push(`Río Paraná: ${data.paranaLevel}`);
  }

  if (data.puenteRosarioVictoria) {
    parts.push(`Pte. Rosario-Victoria: ${data.puenteRosarioVictoria}`);
  }

  return parts.join(' • ');
}

export function formatDateSpanish(date: Date): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).toUpperCase();
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const d = date instanceof Date ? date : new Date(date);
  const diffMinutes = Math.floor((now.getTime() - d.getTime()) / 60000);

  if (diffMinutes < 1) return 'Hace instantes';
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} d`;
}
