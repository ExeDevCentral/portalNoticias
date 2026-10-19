import { describe, it, expect } from 'vitest';
import { partitionNewsForHomepage } from '../../src/utils/news-partition';

describe('partitionNewsForHomepage', () => {
  it('isolates pinned hero article, urgent ticker items, and thematic blocks', () => {
    const mockItems = [
      { id: '1', title: 'Nota Pinned', isPinned: true, isUrgent: false, category: 'politica', publishedAt: new Date() },
      { id: '2', title: 'Nota Urgente', isPinned: false, isUrgent: true, category: 'seguridad', publishedAt: new Date() },
      { id: '3', title: 'Clásico Rosarino', isPinned: false, isUrgent: false, category: 'deportes', publishedAt: new Date() },
      { id: '4', title: 'Puerto y Granos', isPinned: false, isUrgent: false, category: 'economia', publishedAt: new Date() },
    ] as any;

    const result = partitionNewsForHomepage(mockItems);
    expect(result.hero?.title).toBe('Nota Pinned');
    expect(result.urgent.length).toBe(1);
    expect(result.byCategory.deportes.length).toBe(1);
    expect(result.byCategory.economia.length).toBe(1);
  });
});
