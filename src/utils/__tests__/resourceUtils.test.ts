import { filterResourcesByProduct } from '../resourceUtils';

describe('filterResourcesByProduct', () => {
  const resources = [
    { id: 'lr-1', productId: 'p1', title: 'A', type: 'guide' as const },
    { id: 'lr-2', productId: 'p2', title: 'B', type: 'tutorial' as const },
    { id: 'lr-3', productId: 'p1', title: 'C', type: 'video' as const },
  ];

  it('filters resources by productId', () => {
    const filtered = filterResourcesByProduct(resources, 'p1');
    expect(filtered).toHaveLength(2);
    expect(filtered.map((r) => r.id)).toEqual(['lr-1', 'lr-3']);
  });

  it('returns empty array if no match', () => {
    const filtered = filterResourcesByProduct(resources, 'p3');
    expect(filtered).toHaveLength(0);
  });
});
