import { describe, it, expect } from 'vitest';
import { formatServiceData } from '../../src/utils/formatters';

describe('formatServiceData', () => {
  it('formats weather, river height, and dollar exchange rates cleanly', () => {
    const formatted = formatServiceData({
      temp: 22,
      weatherDesc: 'Soleado',
      dolarBlue: 1250,
      paranaLevel: '2.45m',
      puenteRosarioVictoria: 'Normal',
    });

    expect(formatted).toContain('22°C Soleado');
    expect(formatted).toContain('Dólar Blue: $1250');
    expect(formatted).toContain('Río Paraná: 2.45m');
    expect(formatted).toContain('Pte. Rosario-Victoria: Normal');
  });
});
