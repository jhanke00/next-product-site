import { formatPrice, formatNumber } from '@utils/common';

describe('formatPrice', () => {
  it('formats price in USD by default', () => {
    expect(formatPrice(1234.56)).toBe('$1,234.56');
  });

  it('formats price in EUR', () => {
    expect(formatPrice(1234.56, 'EUR')).toBe('€1,234.56');
  });

  it('handles zero price', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('handles negative values', () => {
    expect(formatPrice(-100)).toBe('-$100.00');
  });
});

describe('formatNumber', () => {
  it('formats number with default locale', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('formats number with German locale', () => {
    expect(formatNumber(1234567, 'de-DE')).toBe('1.234.567');
  });

  it('formats number with options', () => {
    expect(formatNumber(0.1234, 'en-US', { style: 'percent', minimumFractionDigits: 2 })).toBe('12.34%');
  });
});
